import { useEventsStore } from '@/features/events/store'

const EVENT_STYLES = {
  ok:   { color: '#1D9E75', label: 'OK'   },
  warn: { color: '#BA7517', label: 'WARN' },
  err:  { color: '#E24B4A', label: 'ERR'  },
  info: { color: '#378ADD', label: 'INFO' },
}

function EventRow({ event }) {
  const style = EVENT_STYLES[event.type] ?? EVENT_STYLES.info

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 32px 1fr',
      gap: 6,
      padding: '5px 0',
      borderBottom: '0.5px solid #1a1a1a',
      alignItems: 'start',
    }}>
      {/* time */}
      <span style={{
        fontSize: 10,
        color: '#444',
        fontVariantNumeric: 'tabular-nums',
        paddingTop: 1,
      }}>
        {event.time}
      </span>

      {/* type */}
      <span style={{
        fontSize: 9,
        color: style.color,
        fontWeight: 500,
        letterSpacing: '0.04em',
        paddingTop: 2,
      }}>
        {style.label}
      </span>

      {/* message */}
      <span style={{
        fontSize: 11,
        color: '#aaa',
        lineHeight: 1.4,
        wordBreak: 'break-word',
      }}>
        {event.message}
      </span>
    </div>
  )
}

export function EventsFeed() {
  const events      = useEventsStore(s => s.events)
  const clearEvents = useEventsStore(s => s.clearEvents)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      minHeight: 0,
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px 6px',
        borderBottom: '0.5px solid #1e1e1e',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: 10,
          color: '#444',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Events
        </span>

        {events.length > 0 && (
          <button
            onClick={clearEvents}
            style={{
              background: 'none',
              border: 'none',
              color: '#444',
              fontSize: 10,
              cursor: 'pointer',
              padding: 0,
            }}
          >
            clear
          </button>
        )}
      </div>

      {/* List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 14px',
      }}>
        {events.length === 0 ? (
          <div style={{
            color: '#333',
            fontSize: 11,
            paddingTop: 12,
            textAlign: 'center',
          }}>
            No events yet
          </div>
        ) : (
          events.map(event => (
            <EventRow key={event.id} event={event} />
          ))
        )}
      </div>

    </div>
  )
}

