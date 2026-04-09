js// src/entities/loadbalancer/model.js

export const LB_STATUS = {
  healthy:  'healthy',
  warning:  'warning',
  critical: 'critical',
  offline:  'offline',
}

export const LB_COLORS = {
  healthy:  { fill: '#0a1218', stroke: '#185FA5', text: '#378ADD' },
  warning:  { fill: '#1f1500', stroke: '#854F0B', text: '#BA7517' },
  critical: { fill: '#1f0a0a', stroke: '#A32D2D', text: '#E24B4A' },
  offline:  { fill: '#141414', stroke: '#333',    text: '#444'    },
}

export function createLoadBalancer({
  id,
  name      = 'Load Balancer',
  cpu       = null,
  status    = LB_STATUS.healthy,
  region    = 'us-east',
  algorithm = 'round-robin', // round-robin | least-conn | ip-hash
}) {
  return { id, name, type: 'lb', cpu, status, region, algorithm }
}

export function getLBColorByStatus(status) {
  return LB_COLORS[status] ?? LB_COLORS.offline
}

export function getLBColorByCpu(cpu) {
  if (cpu === null) return LB_COLORS.offline
  if (cpu < 60)    return LB_COLORS.healthy
  if (cpu < 85)    return LB_COLORS.warning
  return LB_COLORS.critical
}

// Calculates traffic distribution across edges from LB
export function calcTrafficDistribution(edges, lbId) {
  const outgoing = edges.filter(e => e.sourceId === lbId)
  const total    = outgoing.reduce((sum, e) => sum + (e.rps ?? 0), 0)

  if (total === 0) return outgoing.map(e => ({ ...e, percent: 0 }))

  return outgoing.map(e => ({
    ...e,
    percent: Math.round(((e.rps ?? 0) / total) * 100),
  }))
}

// Lb status is determined by CPU usage and RPS
export function getLBStatus(cpu, rps) {
  if (cpu === null)  return LB_STATUS.offline
  if (cpu > 85)      return LB_STATUS.critical
  if (cpu > 60)      return LB_STATUS.warning
  if (rps > 3000)    return LB_STATUS.warning
  return LB_STATUS.healthy
}