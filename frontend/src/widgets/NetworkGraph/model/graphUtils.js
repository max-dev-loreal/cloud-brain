export const NODE_COLORS = {
    healthy:  { fill: '#E1F5EE', stroke: '#0F6E56', text: '#085041' },
    warning:  { fill: '#FAEEDA', stroke: '#854F0B', text: '#633806' },
    critical: { fill: '#FCEBEB', stroke: '#A32D2D', text: '#791F1F' },
    offline:  { fill: '#F1EFE8', stroke: '#5F5E5A', text: '#444441' },
}

export function getNodeStatus(cpu) {
    if (cpu === null) return 'offline'
    if (cpu  < 60)  return 'healthy'
    if (cpu  < 85)  return 'warning'
}

export function getNodeColor(cpu) {
    return NODE_COLORS[getNodeStatus(cpu)]
}

export function getEdgeThikness(rps) {
    if (rps === 0) return 0.5
    if (rps  < 100) return 1
    if (rps  < 500) return 1.5
    if (rps  < 1000) return 2.5
    return 4
}

//Calculates the point on the edge of the rectangle where the arrow lands so that the line doesn't go inside the node
 export function calcEdgePoints(source, target) {
     const sx = source.x + source.width / 2
  const sy = source.y + source.height / 2
  const tx = target.x + target.width / 2
  const ty = target.y + target.height / 2

  const dx = tx - sx
  const dy = ty - sy
  const angle = Math.atan2(dy, dx)

  // exit a target
  const sw = source.width / 2 + 2
  const sh = source.height / 2 + 2
  const sx2 = sx + Math.cos(angle) * Math.min(sw, Math.abs(sw / Math.cos(angle)))
  const sy2 = sy + Math.sin(angle) * Math.min(sh, Math.abs(sh / Math.sin(angle)))

  // go in a target 
  const tw = target.width / 2 + 2
  const th = target.height / 2 + 2
  const tx2 = tx - Math.cos(angle) * Math.min(tw, Math.abs(tw / Math.cos(angle)))
  const ty2 = ty - Math.sin(angle) * Math.min(th, Math.abs(th / Math.sin(angle)))

  return { x1: sx2, y1: sy2, x2: tx2, y2: ty2 }
}

// position node by default, in a real project it can be replaced with D3 force simulation
export function buildDefaultLayout(nodes) {
  const LAYOUT = {
    'internet':  { x: 260, y: 20,  width: 120, height: 44 },
    'lb-1':      { x: 220, y: 100, width: 160, height: 50 },
    'app-01':    { x: 50,  y: 200, width: 120, height: 50 },
    'app-02':    { x: 220, y: 200, width: 120, height: 50 },
    'app-03':    { x: 390, y: 200, width: 120, height: 50 },
    'db-primary':{ x: 80,  y: 310, width: 140, height: 50 },
    'db-replica':{ x: 360, y: 310, width: 140, height: 50 },
    'queue-1':   { x: 220, y: 310, width: 120, height: 50 },
  }

  return nodes.map(node => ({
    ...node,
    ...(LAYOUT[node.id] ?? { x: 100, y: 400, width: 120, height: 50 }),
  }))
}


 
