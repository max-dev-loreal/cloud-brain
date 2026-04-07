
import { useEffect, useCallback, useRef } from 'react'
import { useAIStore }          from './store'
import { useSimulationStore }  from '@/features/simulation/store'
import { useEventsStore }      from '@/features/events/store'
import { fetchAIDecision }     from './api'
import { formatTime }          from '@/shared/lib/format'
import { randomChance }        from '@/shared/lib/utils'

export function useAIOrchestrator() {
  const isEnabled   = useAIStore(s => s.isEnabled)
  const isThinking  = useAIStore(s => s.isThinking)
  const decisions   = useAIStore(s => s.decisions)
  const toggleAI    = useAIStore(s => s.toggleAI)
  const addDecision = useAIStore(s => s.addDecision)
  const setThinking = useAIStore(s => s.setThinking)

  const addEvent  = useEventsStore(s => s.addEvent)
  const nodes     = useSimulationStore(s => s.nodes)
  const tick      = useSimulationStore(s => s.tick)
  const rps       = useSimulationStore(s => s.rps)
  const latency   = useSimulationStore(s => s.latency)
  const spikeMode = useSimulationStore(s => s.spikeMode)
  const chaosMode = useSimulationStore(s => s.chaosMode)

  const setNodeCpu    = useSimulationStore(s => s.setNodeCpu)
  const setNodeStatus = useSimulationStore(s => s.setNodeStatus)
  const addEdge       = useSimulationStore(s => s.addEdge)
  const edges         = useSimulationStore(s => s.edges)

  const lastActionRef = useRef({})

  // ── Attempt to call the real AI backend ──
  const callAI = useCallback(async (context) => {
    try {
      setThinking(true)
      const decision = await fetchAIDecision(context)
      addDecision({ ...decision, time: formatTime(tick) })
      return decision
    } catch {
      // backend not ready — fallback to local logic
      return null
    }
  }, [tick, setThinking, addDecision])

  // ── Local orchestrator logic ──
  const runLocalOrchestrator = useCallback(() => {
    if (!isEnabled) return

    const time = formatTime(tick)
    const last = lastActionRef.current

    // 1. Spike → scale out
    if (spikeMode) {
      const overloaded = nodes.filter(
        n => n.type === 'instance' && n.cpu !== null && n.cpu > 75
      )
      const app03 = nodes.find(n => n.id === 'app-03')

      if (overloaded.length >= 2 && app03?.status === 'offline' && !last.scaleOut) {
        last.scaleOut = true
        setThinking(true)

        setTimeout(() => {
          setNodeCpu('app-03', 15)

          const edgeExists = edges.find(e => e.id === 'e-lb-app03')
          if (!edgeExists) {
            addEdge({
              id:       'e-lb-app03',
              sourceId: 'lb-1',
              targetId: 'app-03',
              rps:      Math.round(rps / 3),
              type:     'traffic',
            })
          }

          addDecision({
            action:  'scale_out',
            reason:  `CPU > 75% on ${overloaded.length} nodes. App-03 deployed.`,
            targets: ['app-03'],
            time,
          })
          addEvent({ type: 'ok', message: 'AI: App-03 deployed', time })
        }, 900)
      }
    }

    // 2. Spike off → scale in
    if (!spikeMode && last.scaleOut) {
      const app03 = nodes.find(n => n.id === 'app-03')
      if (app03?.status !== 'offline') {
        last.scaleOut = false

        setTimeout(() => {
          setNodeStatus('app-03', 'offline')
          setNodeCpu('app-03', null)

          addDecision({
            action:  'scale_in',
            reason:  'Load normalized. App-03 terminated.',
            targets: ['app-03'],
            time,
          })
          addEvent({ type: 'info', message: 'AI: App-03 terminated', time })
        }, 600)
      }
    }

    // 3. Chaos → recover crashed nodes
    if (chaosMode) {
      const offline = nodes.filter(
        n => n.type === 'instance' && n.status === 'offline'
      )

      offline.forEach(node => {
        const key = `recover-${node.id}`
        if (last[key]) return
        last[key] = true

        setTimeout(() => {
          setNodeCpu(node.id, 18)
          addDecision({
            action:  'recover',
            reason:  `${node.name} offline. Recovery initiated.`,
            targets: [node.id],
            time,
          })
          addEvent({ type: 'ok', message: `AI: recovering ${node.name}`, time })

          // Reset the flag after 10s so it can crash again
          setTimeout(() => { delete last[key] }, 10000)
        }, 1500)
      })
    }

    // 4. High latency → reroute
    if (latency > 200 && !last.reroute) {
      last.reroute = true
      setTimeout(() => {
        addDecision({
          action:  'reroute',
          reason:  `Latency ${latency}ms > 200ms threshold. Rerouting traffic.`,
          targets: ['lb-1'],
          time,
        })
        addEvent({ type: 'warn', message: `AI: latency ${latency}ms, rerouting`, time })
        setTimeout(() => { last.reroute = false }, 15000)
      }, 500)
    }

    // 5. Periodic status
    if (tick > 0 && tick % 20 === 0) {
      addDecision({
        action:  'idle',
        reason:  `Tick ${tick}. RPS ${rps}, lat ${latency}ms. All systems nominal.`,
        targets: [],
        time,
      })
    }
  }, [
    isEnabled, tick, nodes, edges,
    spikeMode, chaosMode, rps, latency,
    setNodeCpu, setNodeStatus, addEdge,
    addDecision, addEvent, setThinking,
  ])

  // ── Run orchestrator on every tick ──
  useEffect(() => {
    if (!isEnabled) return
    runLocalOrchestrator()
  }, [tick]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    isEnabled,
    isThinking,
    decisions,
    toggleAI,
    lastDecision: decisions[0] ?? null,
  }
}