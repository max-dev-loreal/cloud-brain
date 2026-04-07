import {API_URL} from '@/shared/config/constants';

export async function fetchNodeMetrics(nodeId) {
    const res = await fetch(`${API_URL}/api/metrics/${nodeId}`)
    if (!res.ok) throw new Error('Failed to fetch metrics for ${nodeId}')
        return res.json();
}

export async function fetchAllMetrics() {
    const res = await fetch(`${API_URL}/api/metrics`)
    if (!res.ok) throw new Error('Failed to fetch  metrics')
        return res.json();
}

export async function fetchMetricsHistory(nodeId, limit = 60) {
  const res = await fetch(`${API_URL}/api/metrics/${nodeId}/history?limit=${limit}`)
  if (!res.ok) throw new Error(`Failed to fetch history for ${nodeId}`)
  return res.json()
}