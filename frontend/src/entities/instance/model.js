
export const INSTANCE_TYPES = {
  instance: 'instance',
  lb:       'lb',
  db:       'db',
  queue:    'queue',
}

export const INSTANCE_STATUS = {
  healthy:  'healthy',
  warning:  'warning',
  critical: 'critical',
  offline:  'offline',
}

// colors for each status (background, border, text)
export const STATUS_COLORS = {
  healthy:  { fill: '#0a1f17', stroke: '#0F6E56', text: '#1D9E75' },
  warning:  { fill: '#1f1600', stroke: '#854F0B', text: '#BA7517' },
  critical: { fill: '#1f0a0a', stroke: '#A32D2D', text: '#E24B4A' },
  offline:  { fill: '#141414', stroke: '#333',    text: '#444'    },
}

// icon type for node
export const TYPE_LABELS = {
  instance: 'APP',
  lb:       'LB',
  db:       'DB',
  queue:    'Q',
}

// fabric create new instance
export function createInstance({
  id,
  name,
  type     = INSTANCE_TYPES.instance,
  cpu      = null,
  status   = INSTANCE_STATUS.offline,
  region   = 'us-east',
  metadata = {},
}) {
  return {
    id,
    name,
    type,
    cpu,
    status,
    region,
    metadata,
    createdAt: Date.now(),
  }
}

// get status by CPU usage
export function cpuToStatus(cpu) {
  if (cpu === null || cpu === undefined) return INSTANCE_STATUS.offline
  if (cpu < 60)  return INSTANCE_STATUS.healthy
  if (cpu < 85)  return INSTANCE_STATUS.warning
  return INSTANCE_STATUS.critical
}

// get colors by CPU 
export function cpuToColor(cpu) {
  return STATUS_COLORS[cpuToStatus(cpu)]
}

// get checks
export function isHealthy(instance) {
  return instance.status === INSTANCE_STATUS.healthy
}

export function isOffline(instance) {
  return instance.status === INSTANCE_STATUS.offline
}

export function isCritical(instance) {
  return instance.status === INSTANCE_STATUS.critical
}