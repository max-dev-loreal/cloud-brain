import { API_URL } from '@/shared/config/constants'

export async function fetchAIDecision(payload) {
  const res = await fetch(`${API_URL}/api/ai/decision`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('AI decision request failed')
  return res.json()
}

export async function fetchAIHistory(limit = 20) {
  const res = await fetch(`${API_URL}/api/ai/history?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch AI history')
  return res.json()
}

export async function fetchAIAnalysis(nodes, metrics) {
  const res = await fetch(`${API_URL}/api/ai/analyze`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ nodes, metrics }),
  })
  if (!res.ok) throw new Error('AI analysis request failed')
  return res.json()
}