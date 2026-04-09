
export function Layout({ children }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      height:         '100vh',
      width:          '100vw',
      overflow:       'hidden',
      background:     '#0f0f0f',
      color:          '#e5e5e5',
      fontFamily:     '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      {children}
    </div>
  )
}