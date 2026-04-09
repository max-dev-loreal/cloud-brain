
// mertrics
export function formatCpu(cpu) {
  if (cpu === null || cpu === undefined) return '—'
  return `${Math.round(cpu)}%`
}

export function formatRps(rps) {
  if (rps === null || rps === undefined) return '—'
  if (rps >= 1000) return `${(rps / 1000).toFixed(1)}k`
  return `${Math.round(rps)}`
}

export function formatLatency(ms) {
  if (ms === null || ms === undefined) return '—'
  if (ms >= 1000) return `${(ms / 1000).toFixed(2)}s`
  return `${Math.round(ms)}ms`
}

export function formatCost(rps) {
  if (!rps) return '$0.00'
  return `$${(rps * 0.001).toFixed(2)}`
}

export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k     = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i     = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatPercent(value, total) {
  if (!total) return '0%'
  return `${Math.round((value / total) * 100)}%`
}

// time
export function formatTime(seconds) {
  return `T+${seconds}s`
}

export function formatDuration(ms) {
  if (ms < 1000)  return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}m ${s}s`
}

export function formatTimestamp(ts) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

// Staus
export function formatStatus(status) {
  const labels = {
    healthy:     'Healthy',
    warning:     'Warning',
    critical:    'Critical',
    offline:     'Offline',
    replicating: 'Replicating',
    active:      'Active',
    standby:     'Standby',
    degraded:    'Degraded',
  }
  return labels[status] ?? status
}

export function formatNodeType(type) {
  const labels = {
    instance: 'App Instance',
    lb:       'Load Balancer',
    db:       'Database',
    queue:    'Message Queue',
  }
  return labels[type] ?? type
}

// numbers
export function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`
  return `${Math.round(n)}`
}