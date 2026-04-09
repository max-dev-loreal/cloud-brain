
export function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background:   '#1a1a1a',
        border:       '0.5px solid #2a2a2a',
        borderRadius: 8,
        padding:      '12px 14px',
        cursor:       onClick ? 'pointer' : 'default',
        transition:   'border-color 0.2s',
        ...style,
      }}
      onMouseEnter={e => {
        if (onClick) e.currentTarget.style.borderColor = '#3a3a3a'
      }}
      onMouseLeave={e => {
        if (onClick) e.currentTarget.style.borderColor = '#2a2a2a'
      }}
    >
      {children}
    </div>
  )
}