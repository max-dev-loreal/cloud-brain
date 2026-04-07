import { useSimulationStore } from '@/features/simulation/store'
import { formatCpu, formatRps, formatLatency, formatCost } from '@/shared/lib/format'

function MetricCard({ label, value, status = 'default' }) {
  const colors = {
    default: '#888',
    ok:      '#1D9E75',
    warn:    '#BA7517',
    danger:  '#E24B4A',
  }

  return (
    <div style={{
      background: '#1a1a1a',
      border: '0.5px solid #2a2a2a',
      borderRadius: 6,
      padding: '8px 10px',
      flex: 1,
    }}>
      <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontSize: 16,
        fontWeight: 500,
        color: colors[status],
        transition: 'color 0.3s',
      }}>
        {value}
      </div>
    </div>
  )
}

function NodeRow({ node }) {
  const getStatus = (cpu) => {
    if (cpu === null) return 'default'
    if (cpu < 60)    return 'ok'
    if (cpu < 85)    return 'warn'
    return 'danger'
  }

  const status = getStatus(node.cpu)

  const dotColor = {
    default: '#444',
    ok:      '#1D9E75',
    warn:    '#BA7517',
    danger:  '#E24B4A',
  }[status]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: '0.5px solid #1e1e1e',
      fontSize: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: dotColor,
          flexShrink: 0,
          transition: 'background 0.3s',
        }} />
        <span style={{ color: '#ccc' }}>{node.name}</span>
      </div>
      <span style={{ color: dotColor, fontVariantNumeric: 'tabular-nums' }}>
        {formatCpu(node.cpu)}
      </span>
    </div>
  )
}

export function MetricsPanel() {
  const nodes     = useSimulationStore(s => s.nodes)
  const rps       = useSimulationStore(s => s.rps)
  const latency   = useSimulationStore(s => s.latency)

  const getRpsStatus = (r) => {
    if (r < 800)  return 'ok'
    if (r < 2000) return 'warn'
    return 'danger'
  }

  const getLatStatus = (l) => {
    if (l < 60)  return 'ok'
    if (l < 150) return 'warn'
    return 'danger'
  }

  return (
    <div style={{
      padding: '12px 14px',
      borderBottom: '0.5px solid #1e1e1e',
    }}>

      {/* Global Metrics */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <MetricCard
          label="RPS"
          value={formatRps(rps)}
          status={getRpsStatus(rps)}
        />
        <MetricCard
          label="Latency"
          value={formatLatency(latency)}
          status={getLatStatus(latency)}
        />
        <MetricCard
          label="Cost/hr"
          value={formatCost(rps)}
          status="default"
        />
      </div>

      {/* Node-by-Node Metrics */}
      <div style={{
        fontSize: 10,
        color: '#444',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        Nodes
      </div>

      <div>
        {nodes.map(node => (
          <NodeRow key={node.id} node={node} />
        ))}
      </div>

    </div>
  )
}