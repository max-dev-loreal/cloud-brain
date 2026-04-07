import { useAIStore } from '@/features/ai/store'

const ACTION_STYLES = {
  scale_out:    { color: '#1D9E75', label: 'SCALE OUT'  },
  scale_in:     { color: '#378ADD', label: 'SCALE IN'   },
  reroute:      { color: '#7F77DD', label: 'REROUTE'    },
  alert:        { color: '#BA7517', label: 'ALERT'      },
  recover:      { color: '#1D9E75', label: 'RECOVER'    },
  optimize:     { color: '#378ADD', label: 'OPTIMIZE'   },
  idle:         { color: '#444',    label: 'IDLE'       },
}

function DecisionCard({ decision }) {
  const style = ACTION_STYLES[decision.action] ?? ACTION_STYLES.idle

  return (
    <div style={{
      background: '#141414',
      border: `0.5px solid ${style.color}22`,
      borderLeft: `2px solid ${style.color}`,
      borderRadius: 6,
      padding: '8px 10px',
      marginBottom: 6,
    }}>

      {/* top line: action + time */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
      }}>
        <span style={{
          fontSize: 9,
          fontWeight: 500,
          color: style.color,
          letterSpacing: '0.06em',
        }}>
          {style.label}
        </span>
        <span style={{
          fontSize: 10,
          color: '#333',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {decision.time}
        </span>
      </div>

      {/* Reason */}
      <div style={{
        fontSize: 11,
        color: '#aaa',
        lineHeight: 1.4,
        marginBottom: decision.targets?.length ? 4 : 0,
      }}>
        {decision.reason}
      </div>

      {/* Affected Nodes */}
      {decision.targets?.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
          {decision.targets.map(target => (
            <span
              key={target}
              style={{
                fontSize: 9,
                color: style.color,
                background: `${style.color}11`,
                border: `0.5px solid ${style.color}33`,
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              {target}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function AIStatusBadge({ isEnabled, isThinking }) {
  const color   = !isEnabled ? '#333' : isThinking ? '#BA7517' : '#1D9E75'
  const label   = !isEnabled ? 'disabled' : isThinking ? 'thinking...' : 'monitoring'
  const dotAnim = isThinking
    ? { animation: 'pulse 1s ease-in-out infinite' }
    : {}

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{
        width: 6, height: 6,
        borderRadius: '50%',
        background: color,
        transition: 'background 0.3s',
        ...dotAnim,
      }} />
      <span style={{ fontSize: 10, color }}>
        {label}
      </span>
    </div>
  )
}

export function AIDecisions() {
  const decisions  = useAIStore(s => s.decisions)
  const isEnabled  = useAIStore(s => s.isEnabled)
  const isThinking = useAIStore(s => s.isThinking)

  return (
    <div style={{
      borderBottom: '0.5px solid #1e1e1e',
      padding: '10px 14px',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontSize: 10,
          color: '#444',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          AI Orchestrator
        </span>
        <AIStatusBadge isEnabled={isEnabled} isThinking={isThinking} />
      </div>

      {/* Decisions */}
      {!isEnabled ? (
        <div style={{ fontSize: 11, color: '#333', textAlign: 'center', padding: '8px 0' }}>
          AI is disabled
        </div>
      ) : decisions.length === 0 ? (
        <div style={{ fontSize: 11, color: '#333', textAlign: 'center', padding: '8px 0' }}>
          No decisions yet
        </div>
      ) : (
        decisions.slice(0, 5).map(d => (
          <DecisionCard key={d.id} decision={d} />
        ))
      )}

    </div>
  )
}