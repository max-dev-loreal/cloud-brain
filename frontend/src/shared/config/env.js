// helpers for work with env variables

export const isDev  = import.meta.env.DEV
export const isProd = import.meta.env.PROD

export const config = {
  apiUrl:     import.meta.env.VITE_API_URL  ?? 'http://localhost:8000',
  wsUrl:      import.meta.env.VITE_WS_URL   ?? 'ws://localhost:8000/ws',
  debugMode:  import.meta.env.VITE_DEBUG    === 'true',
}
