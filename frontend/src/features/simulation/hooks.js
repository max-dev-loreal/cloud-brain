import { useEffect, useCallback } from 'react'
import { useSimulationStore } from './store'
import { useEventsStore }     from '@/features/events/store'
import { useAIStore }         from '@/features/ai/store'
import { formatTime }         from '@/shared/lib/format'
import { randomChance }       from '@/shared/lib/utils'

export function useSimulation() {
  const store      = useSimulationStore()
  const addEvent   = useEventsStore(s => s.addEvent)
  const aiEnabled  = useAIStore(s => s.isEnabled)
  const addDecision = useAIStore(s => s.addDecision)
  const setThinking = useAIStore(s => s.setThinking)

  // ── per-tick handler ──
  const onTick = useCallback(({ tick, nodes, rps, latency, chaosMode, spikeMode }) => {
    const time = formatTime(tick)

    // Chaos: random events
    if (chaosMode) {
      if (randomChance(0.07)) {
        const targets = nodes.filter(n => n.type === 'instance')
        const victim  = targets[Math.floor(Math.random() * targets.length)]
        if (victim) {
          addEvent({ type: 'err', message: `${victim.name} crashed`, time })
          useSimulationStore.getState().setNodeStatus(victim.id, 'offline')

          if (aiEnabled) {
            setThinking(true)
            setTimeout(() => {
              addDecision({
                action:  'recover',
                reason:  `${victim.name} crashed. Initiating recovery.`,
                targets: [victim.id],
                time,
              })
              addEvent({ type: 'ok', message: `AI: recovering ${victim.name}`, time })
              useSimulationStore.getState().setNodeCpu(victim.id, 20)
            }, 1500)
          }
        }
      }

      if (randomChance(0.04)) {
        addEvent({ type: 'warn', message: 'Network partition detected', time })
      }
    }

    // Spike: AI Auto-Scaling
    if (spikeMode && aiEnabled) {
      const overloaded = nodes.filter(
        n => n.type === 'instance' && n.cpu !== null && n.cpu > 75
      )

      const app03 = nodes.find(n => n.id === 'app-03')

      if (overloaded.length >= 2 && app03?.status === 'offline') {
        setThinking(true)
        setTimeout(() => {
          useSimulationStore.getState().setNodeCpu('app-03', 15)

          addDecision({
            action:  'scale_out',
            reason:  `CPU > 75% on ${overloaded.length} instances. Deploying App-03.`,
            targets: ['app-03'],
            time,
          })

          addEvent({ type: 'ok', message: 'AI: App-03 deployed', time })

          // add edge  LB → app-03
          const edgeExists = useSimulationStore
            .getState()
            .edges.find(e => e.id === 'e-lb-app03')

          if (!edgeExists) {
            useSimulationStore.getState().addEdge({
              id: 'e-lb-app03',
              sourceId: 'lb-1',
              targetId: 'app-03',
              rps: Math.round(rps / 3),
              type: 'traffic',
            })
          }
        }, 800)
      }
    }

    // Spike off: scale in
    if (!spikeMode && aiEnabled) {
      const app03 = nodes.find(n => n.id === 'app-03')
      if (app03?.status !== 'offline' && app03?.cpu < 20) {
        addDecision({
          action:  'scale_in',
          reason:  'Load normalized. Terminating App-03.',
          targets: ['app-03'],
          time,
        })
        addEvent({ type: 'info', message: 'AI: App-03 terminated', time })
        useSimulationStore.getState().setNodeStatus('app-03', 'offline')
        useSimulationStore.getState().setNodeCpu('app-03', null)
      }
    }

    // periodical ai report
    if (tick % 15 === 0 && aiEnabled) {
      addDecision({
        action: 'idle',
        reason: `Lat ${latency}ms, RPS ${rps}. Architecture optimal.`,
        targets: [],
        time,
      })
    }
  }, [aiEnabled, addEvent, addDecision, setThinking])

  // register callback on store
  useEffect(() => {
    useSimulationStore.getState()._registerOnTick(onTick)
    return () => useSimulationStore.getState()._registerOnTick(null)
  }, [onTick])

  return {
    nodes:           store.nodes,
    edges:           store.edges,
    regions:         store.regions,
    isRunning:       store.isRunning,
    chaosMode:       store.chaosMode,
    spikeMode:       store.spikeMode,
    rps:             store.rps,
    latency:         store.latency,
    startTraffic:    store.startTraffic,
    stopTraffic:     store.stopTraffic,
    triggerChaos:    store.triggerChaos,
    triggerSpike:    store.triggerSpike,
    resetSimulation: store.resetSimulation,
  }
}