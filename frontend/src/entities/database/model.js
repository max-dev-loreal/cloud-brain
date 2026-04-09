js// src/entities/database/model.js

export const DB_STATUS = {
  healthy:     'healthy',
  warning:     'warning',
  critical:    'critical',
  offline:     'offline',
  replicating: 'replicating',
}

export const DB_ROLE = {
  primary: 'primary',
  replica: 'replica',
}

export const DB_COLORS = {
  healthy:     { fill: '#0f1a0a', stroke: '#3B6D11', text: '#639922' },
  warning:     { fill: '#1f1500', stroke: '#854F0B', text: '#BA7517' },
  critical:    { fill: '#1f0a0a', stroke: '#A32D2D', text: '#E24B4A' },
  offline:     { fill: '#141414', stroke: '#333',    text: '#444'    },
  replicating: { fill: '#0a1218', stroke: '#185FA5', text: '#378ADD' },
}

export function createDatabase({
  id,
  name,
  role    = DB_ROLE.primary,
  cpu     = null,
  status  = DB_STATUS.healthy,
  region  = 'us-east',
  lag     = 0,      // replication lag ms
  size    = 0,      // GB
}) {
  return { id, name, type: 'db', role, cpu, status, region, lag, size }
}

export function getDBColorByStatus(status) {
  return DB_COLORS[status] ?? DB_COLORS.offline
}

export function getDBColorByCpu(cpu, role) {
  if (cpu === null) return DB_COLORS.offline
  if (cpu > 85)    return DB_COLORS.critical
  if (cpu > 60)    return DB_COLORS.warning
  return DB_COLORS.healthy
}

// Status including videos and replication delay
export function getDBStatus(cpu, role, lag = 0) {
  if (cpu === null)                          return DB_STATUS.offline
  if (cpu > 85)                              return DB_STATUS.critical
  if (cpu > 60)                              return DB_STATUS.warning
  if (role === DB_ROLE.replica && lag > 500) return DB_STATUS.warning
  if (role === DB_ROLE.replica && lag > 0)   return DB_STATUS.replicating
  return DB_STATUS.healthy
}

// Is this a replica?
export function isReplica(db) {
  return db.role === DB_ROLE.replica
}

export function isPrimary(db) {
  return db.role === DB_ROLE.primary
}

// Replication lag — how much the replica is behind
export function getReplicationHealth(lagMs) {
  if (lagMs === 0)    return { label: 'in sync',  color: '#639922' }
  if (lagMs < 100)    return { label: `${lagMs}ms lag`, color: '#BA7517' }
  if (lagMs < 500)    return { label: `${lagMs}ms lag`, color: '#E24B4A' }
  return               { label: 'out of sync',    color: '#A32D2D' }
}

// Is failover needed
export function needsFailover(primary, replica) {
  if (!primary)                        return false
  if (primary.status === DB_STATUS.offline)   return true
  if (primary.status === DB_STATUS.critical)  return true
  return false
}

// Simulate failover — replica becomes primary
export function applyFailover(primary, replica) {
  return {
    newPrimary: { ...replica, role: DB_ROLE.primary, lag: 0 },
    oldPrimary: { ...primary, role: DB_ROLE.replica, status: DB_STATUS.offline },
  }
}