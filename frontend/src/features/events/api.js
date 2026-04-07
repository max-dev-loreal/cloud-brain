import { API_URL } from '@/shared/config/constants'

export async function fetchEvents(limit = 100) {
  const res = await fetch(`${API_URL}/api/events?limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

export async function fetchEventsByType(type, limit = 50) {
  const res = await fetch(`${API_URL}/api/events?type=${type}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch events by type')
  return res.json()
}