
export const REGION_STATUS = {
  active:   'active',
  standby:  'standby',
  degraded: 'degraded',
  offline:  'offline',
}

export const REGION_COLORS = {
  active:   { stroke: '#0F6E56', label: '#1D9E75', dash: 'none'  },
  standby:  { stroke: '#333',    label: '#444',    dash: '6 4'   },
  degraded: { stroke: '#854F0B', label: '#BA7517', dash: '4 3'   },
  offline:  { stroke: '#2a2a2a', label: '#333',    dash: '3 5'   },
}

export const KNOWN_REGIONS = {
  'us-east-1': { name: 'us-east-1', lat: 37.9,  lng: -77.0, city: 'N. Virginia'  },
  'us-west-2': { name: 'us-west-2', lat: 45.5,  lng: -122.6, city: 'Oregon'      },
  'eu-west-1': { name: 'eu-west-1', lat: 53.3,  lng: -6.2,   city: 'Ireland'     },
  'eu-central': { name: 'eu-central-1', lat: 50.1, lng: 8.7, city: 'Frankfurt'   },
  'ap-south-1': { name: 'ap-south-1', lat: 19.0, lng: 72.8,  city: 'Mumbai'      },
  'ap-northeast': { name: 'ap-northeast-1', lat: 35.7, lng: 139.7, city: 'Tokyo' },
}

export function createRegion({
  id,
  name,
  status  = REGION_STATUS.standby,
  x       = 0,
  y       = 0,
  width   = 500,
  height  = 200,
}) {
  return { id, name, status, x, y, width, height }
}

export function getRegionColor(status) {
  return REGION_COLORS[status] ?? REGION_COLORS.standby
}

// Calculates summary metrics for a region based on its nodes
export function calcRegionMetrics(nodes, regionId) {
  const regionNodes = nodes.filter(n => n.region === regionId && n.cpu !== null)

  if (regionNodes.length === 0) {
    return { avgCpu: 0, maxCpu: 0, nodeCount: 0, healthyCount: 0 }
  }

  const cpus         = regionNodes.map(n => n.cpu)
  const avgCpu       = Math.round(cpus.reduce((a, b) => a + b, 0) / cpus.length)
  const maxCpu       = Math.max(...cpus)
  const healthyCount = regionNodes.filter(n => n.status === 'healthy').length

  return {
    avgCpu,
    maxCpu,
    nodeCount:    regionNodes.length,
    healthyCount,
  }
}

// Get region status based on the nodes within it
export function getRegionStatus(nodes, regionId) {
  const metrics = calcRegionMetrics(nodes, regionId)

  if (metrics.nodeCount === 0)                          return REGION_STATUS.offline
  if (metrics.healthyCount === 0)                       return REGION_STATUS.degraded
  if (metrics.maxCpu > 85)                              return REGION_STATUS.degraded
  if (metrics.healthyCount < metrics.nodeCount)         return REGION_STATUS.degraded
  return REGION_STATUS.active
}

// SVG props for rendering the region container
export function getRegionSVGProps(region, nodes) {
  const status = getRegionStatus(nodes, region.id)
  const color  = getRegionColor(status)

  return {
    rect: {
      x:           region.x,
      y:           region.y,
      width:       region.width,
      height:      region.height,
      rx:          14,
      fill:        'none',
      stroke:      color.stroke,
      strokeWidth: 0.5,
      strokeDasharray: color.dash === 'none' ? undefined : color.dash,
    },
    label: {
      x:    region.x + 14,
      y:    region.y + 16,
      fill: color.label,
      text: region.name,
    },
  }
}

// Failover between regions
export function canFailover(sourceRegion, targetRegion, nodes) {
  const sourceStatus = getRegionStatus(nodes, sourceRegion.id)
  const targetStatus = getRegionStatus(nodes, targetRegion.id)

  return (
    sourceStatus === REGION_STATUS.degraded &&
    targetStatus === REGION_STATUS.active
  )
}