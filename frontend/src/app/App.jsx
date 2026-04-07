import { Providers } from './providers'
import { AppRoutes } from './routes'
import '../shared/styles/global.css'

export function App() {
  return (
    <Providers>
      <AppRoutes />
    </Providers>
  )
}