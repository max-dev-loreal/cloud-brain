// src/features/metrics/hooks.js
import { useState, useEffect, useRef, useCallback } from 'react'
import { useSimulationStore } from '@/features/simulation/store'
import { fetchNodeMetrics, fetchAllMetrics, fetchMetricsHistory } from './api'
import { API_URL } from '@/shared/config/constants'

export function useNodeMetrics(nodeId) {
  const node = useSimulationStore(
    s => s.nodes.find(n => n.id === nodeId)
  )

  const [remote, setRemote] = useState(null)
  const [error,  setError]  = useState(null)

  useEffect(() => {
    if (!nodeId) return
    let cancelled = false

    fetchNodeMetrics(nodeId)
      .then(data => { if (!cancelled) setRemote(data) })
      .catch(err  => { if (!cancelled) setError(err.message) })

    return () => { cancelled = true }
  }, [nodeId])

  return {
    cpu:     remote?.cpu     ?? node?.cpu     ?? null,
    status:  remote?.status  ?? node?.status  ?? 'offline',
    latency: remote?.latency ?? null,
    error,
  }
}

export function useAllMetrics(intervalMs = 5000) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const timerRef = useRef(null)

  const fetch_ = useCallback(async () => {
    try {
      const data = await fetchAllMetrics()
      setMetrics(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_()
    timerRef.current = setInterval(fetch_, intervalMs)
    return () => clearInterval(timerRef.current)
  }, [fetch_, intervalMs])

  return { metrics, loading, error }
}

export function useMetricsHistory(nodeId, limit = 60) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const simulationNode = useSimulationStore(
    s => s.nodes.find(n => n.id === nodeId)
  )
  const localHistory = useRef([])

  useEffect(() => {
    if (!simulationNode) return
    localHistory.current = [
      ...localHistory.current,
      { ts: Date.now(), cpu: simulationNode.cpu },
    ].slice(-limit)

    setHistory([...localHistory.current])
  }, [simulationNode, nodeId, limit])

  useEffect(() => {
    if (!nodeId) return
    let cancelled = false

    fetchMetricsHistory(nodeId, limit)
      .then(data => {
        if (!cancelled) {
          setHistory(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [nodeId, limit])

  return { history, loading } 
}                               

export function useMetricsSocket() {
  const [connected, setConnected] = useState(false)
  const socketRef  = useRef(null)
  const setNodeCpu = useSimulationStore(s => s.setNodeCpu)

  useEffect(() => {
    const ws = new WebSocket(`${API_URL.replace('http', 'ws')}/ws/metrics`)
    socketRef.current = ws

    ws.onopen    = () => setConnected(true)
    ws.onclose   = () => setConnected(false)
    ws.onerror   = () => setConnected(false)

    ws.onmessage = (e) => {
      try {
        const { nodeId, cpu } = JSON.parse(e.data)
        if (nodeId && cpu !== undefined) {
          setNodeCpu(nodeId, cpu)
        }
      } catch {
        // ignore malformed messages
      }
    }

    return () => ws.close()
  }, [setNodeCpu])

  return { connected }
}   