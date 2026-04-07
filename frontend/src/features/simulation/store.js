import { create } from 'zustand'
import {
  DEFAULT_NODES,
  DEFAULT_EDGES,
  REGIONS,
  TICK_INTERVAL,
} from '@/shared/config/constants'
import { clamp, randomBetween, randomChance } from '@/shared/lib/utils'

export const useSimulationStore = create((set, get) => ({
  // ── State ──
  nodes:     DEFAULT_NODES,
  edges:     DEFAULT_EDGES,
  regions:   REGIONS,
  isRunning: false,
  chaosMode: false,
  spikeMode: false,
  tick:      0,
  rps:       420,
  latency:   38,
  _timer:    null,

  // ── Actions ──
  startTraffic: () => {
    const { _timer, _tick } = get()
    if (_timer) return
    const timer = setInterval(_tick, TICK_INTERVAL)
    set({ isRunning: true, _timer: timer })
  },

  stopTraffic: () => {
    const { _timer } = get()
    if (_timer) clearInterval(_timer)
    set({ isRunning: false, _timer: null })
  },

  triggerChaos: () => {
    const { chaosMode, isRunning, startTraffic } = get()
    if (!isRunning) startTraffic()
    set({ chaosMode: !chaosMode })
  },

  triggerSpike: () => {
    const { spikeMode, isRunning, startTraffic } = get()
    if (!isRunning) startTraffic()
    set({ spikeMode: !spikeMode })
  },

  resetSimulation: () => {
    const { _timer } = get()
    if (_timer) clearInterval(_timer)
    set({
      nodes:     DEFAULT_NODES,
      edges:     DEFAULT_EDGES,
      isRunning: false,
      chaosMode: false,
      spikeMode: false,
      tick:      0,
      rps:       420,
      latency:   38,
      _timer:    null,
    })
  },

  setNodeCpu: (nodeId, cpu) =>
    set(state => ({
      nodes: state.nodes.map(n =>
        n.id === nodeId
          ? { ...n, cpu, status: _cpuToStatus(cpu) }
          : n
      ),
    })),

  setNodeStatus: (nodeId, status) =>
    set(state => ({
      nodes: state.nodes.map(n =>
        n.id === nodeId ? { ...n, status } : n
      ),
    })),

  setEdgeRps: (edgeId, rps) =>
    set(state => ({
      edges: state.edges.map(e =>
        e.id === edgeId ? { ...e, rps } : e
      ),
    })),

  addNode: (node) =>
    set(state => ({
      nodes: [...state.nodes, node],
    })),

  removeNode: (nodeId) =>
    set(state => ({
      nodes: state.nodes.filter(n => n.id !== nodeId),
      edges: state.edges.filter(
        e => e.sourceId !== nodeId && e.targetId !== nodeId
      ),
    })),

  addEdge: (edge) =>
    set(state => ({
      edges: [...state.edges, edge],
    })),

  // ── Internal tick ──
  _tick: () => {
    const {
      nodes, edges,
      chaosMode, spikeMode,
      tick, rps, latency,
      _onTick,
    } = get()

    const nextTick = tick + 1

    // RPS
    let nextRps = spikeMode
      ? clamp(rps + randomBetween(50, 150), 100, 5000)
      : clamp(rps + randomBetween(-20, 20), 200, 600)

    // Latency
    let nextLatency = spikeMode
      ? clamp(latency + randomBetween(10, 30), 30, 500)
      : clamp(latency + randomBetween(-5, 8), 20, 80)

    // Nodes CPU
    const nextNodes = nodes.map(node => {
      if (node.status === 'offline') return node

      let delta = spikeMode
        ? randomBetween(3, 12)
        : randomBetween(-4, 6)

      if (chaosMode && randomChance(0.05)) {
        // random crash
        return { ...node, cpu: null, status: 'offline' }
      }

      const nextCpu = clamp((node.cpu ?? 0) + delta, 5, 99)
      return { ...node, cpu: nextCpu, status: _cpuToStatus(nextCpu) }
    })

    // Edges RPS proportional to 
    const nextEdges = edges.map(edge => {
      if (edge.type === 'replication') return edge
      const ratio = nextRps / (rps || 1)
      return { ...edge, rps: Math.round((edge.rps ?? 0) * ratio) }
    })

    set({
      tick:    nextTick,
      rps:     nextRps,
      latency: nextLatency,
      nodes:   nextNodes,
      edges:   nextEdges,
    })

    // notify the external hook
    _onTick?.({ tick: nextTick, nodes: nextNodes, rps: nextRps, latency: nextLatency, chaosMode, spikeMode })
  },

  // register callback from hooks
  _onTick:      null,
  _registerOnTick: (fn) => set({ _onTick: fn }),
}))

// ── Helpers ──
function _cpuToStatus(cpu) {
  if (cpu === null) return 'offline'
  if (cpu < 60)    return 'healthy'
  if (cpu < 85)    return 'warning'
  return 'critical'
}