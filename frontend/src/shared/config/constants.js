
// ── API ──
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
export const WS_URL  = import.meta.env.VITE_WS_URL  ?? 'ws://localhost:8000/ws'

// ── Simulation ──
export const TICK_INTERVAL  = 1000   // ms
export const MAX_EVENTS     = 100
export const MAX_DECISIONS  = 20
export const MAX_INSTANCES  = 8

// ── CPU thresholds ──
export const CPU_THRESHOLDS = {
  healthy:  60,
  warning:  85,
}

// ── AI ──
export const AI_THINKING_DELAY = {
  fast:   600,   // scale in
  normal: 900,   // scale out
  slow:   1500,  // recovery
}

// ── Graph layout ──
export const NODE_DIMENSIONS = {
  default: { width: 120, height: 50 },
  lb:      { width: 160, height: 50 },
  db:      { width: 140, height: 50 },
  queue:   { width: 120, height: 50 },
}

export const NODE_POSITIONS = {
  'internet':   { x: 220, y: 20  },
  'lb-1':       { x: 200, y: 100 },
  'app-01':     { x: 50,  y: 200 },
  'app-02':     { x: 210, y: 200 },
  'app-03':     { x: 370, y: 200 },
  'db-primary': { x: 70,  y: 310 },
  'db-replica': { x: 350, y: 310 },
  'queue-1':    { x: 210, y: 310 },
}

// ── Regions ──
export const REGIONS = [
  {
    id:     'us-east',
    name:   'us-east-1',
    status: 'active',
    x:      30,
    y:      80,
    width:  500,
    height: 210,
  },
  {
    id:     'eu-west',
    name:   'eu-west-1',
    status: 'standby',
    x:      300,
    y:      295,
    width:  230,
    height: 90,
  },
]

// ── Default nodes ──
export const DEFAULT_NODES = [
  { id: 'lb-1',        name: 'Load Balancer', type: 'lb',       cpu: 22,  status: 'healthy', region: 'us-east' },
  { id: 'app-01',      name: 'App-01',        type: 'instance', cpu: 34,  status: 'healthy', region: 'us-east' },
  { id: 'app-02',      name: 'App-02',        type: 'instance', cpu: 31,  status: 'healthy', region: 'us-east' },
  { id: 'app-03',      name: 'App-03',        type: 'instance', cpu: null, status: 'offline', region: 'us-east' },
  { id: 'db-primary',  name: 'DB Primary',    type: 'db',       cpu: 61,  status: 'healthy', region: 'us-east', role: 'primary' },
  { id: 'db-replica',  name: 'DB Replica',    type: 'db',       cpu: 14,  status: 'healthy', region: 'eu-west', role: 'replica' },
  { id: 'queue-1',     name: 'Queue',         type: 'queue',    cpu: 8,   status: 'healthy', region: 'us-east' },
]

// ── Default edges ──
export const DEFAULT_EDGES = [
  { id: 'e1', sourceId: 'lb-1',       targetId: 'app-01',      rps: 210, type: 'traffic'     },
  { id: 'e2', sourceId: 'lb-1',       targetId: 'app-02',      rps: 210, type: 'traffic'     },
  { id: 'e3', sourceId: 'app-01',     targetId: 'db-primary',  rps: 80,  type: 'traffic'     },
  { id: 'e4', sourceId: 'app-02',     targetId: 'db-primary',  rps: 70,  type: 'traffic'     },
  { id: 'e5', sourceId: 'app-01',     targetId: 'queue-1',     rps: 30,  type: 'traffic'     },
  { id: 'e6', sourceId: 'db-primary', targetId: 'db-replica',  rps: 0,   type: 'replication' },
]