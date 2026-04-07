import { BrowserRouter } from 'react-router-dom'

export function Providers({ children }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}