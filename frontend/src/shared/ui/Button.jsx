export function Button({ children, variant = 'default', onClick, disabled }) {
  const styles = {
    default: { border: '0.5px solid #333', color: '#888'    },
    active:  { border: '0.5px solid #185FA5', color: '#378ADD' },
    danger:  { border: '0.5px solid #A32D2D', color: '#E24B4A' },
    info:    { border: '0.5px solid #534AB7', color: '#7F77DD' },
    success: { border: '0.5px solid #0F6E56', color: '#1D9E75' },
    ghost:   { border: '0.5px solid transparent', color: '#555' },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        background:    'transparent',
        padding:       '5px 12px',
        borderRadius:  6,
        fontSize:      12,
        cursor:        disabled ? 'not-allowed' : 'pointer',
        opacity:       disabled ? 0.4 : 1,
        transition:    'all 0.15s',
        whiteSpace:    'nowrap',
        fontFamily:    'inherit',
        lineHeight:    1.4,
      }}
      onMouseEnter={e => {
        if (!disabled) e.target.style.opacity = '0.75'
      }}
      onMouseLeave={e => {
        if (!disabled) e.target.style.opacity = '1'
      }}
    >
      {children}
    </button>
  )
}