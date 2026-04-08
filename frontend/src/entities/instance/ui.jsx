// src/entities/instance/ui.jsx
import { cpuToColor, TYPE_LABELS } from './model'
import { formatCpu } from '@/shared/lib/format'

// ── node graph (SVG) ──
export function InstanceNode({ node, x, y, width = 120, height = 50, onClick }) {
  const color   = cpuToColor(node.cpu)
  const cx      = x + width / 2
  const typeTag = TYPE_LABELS[node.type] ?? 'SVC'

  return (
    <g
      onClick={() => onClick?.(node)}
      style={{ cursor: 'pointer' }}
    >
      <rect
        x={x} y={y}
        width={width} height={height}
        rx={8}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={0.5}
        style={{ transition: 'fill 0.4s, stroke 0.4s' }}
      />

      {/* Type tag — small tag on the left */}
      <rect
        x={x + 6} y={y + 6}
        width={22} height={14}
        rx={3}
        fill={color.stroke}
        opacity={0.3}
      />
      <text
        x={x + 17} y={y + 13}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 8,
          fontWeight: 500,
          fill: color.text,
          fontFamily: 'var(--font-sans, monospace)',
        }}
      >
        {typeTag}
      </text>

      {/* Name of the node */}
      <text
        x={cx} y={y + height / 2 - 7}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 11,
          fontWeight: 500,
          fill: color.text,
          fontFamily: 'var(--font-sans, sans-serif)',
          transition: 'fill 0.4s',
        }}
      >
        {node.name}
      </text>

      {/* CPU */}
      <text
        x={cx} y={y + height / 2 + 9}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 10,
          fill: color.stroke,
          fontFamily: 'var(--font-sans, sans-serif)',
          transition: 'fill 0.4s',
        }}
      >
        {formatCpu(node.cpu)}
      </text>

      {/* Status indicator — dot on the top right */}
      <circle
        cx={x + width - 8}
        cy={y + 8}
        r={3}
        fill={color.stroke}
        style={{ transition: 'fill 0.4s' }}
      />
    </g>
  )
}

// ── card instance (ui panel) ──
export function InstanceCard({ node, onClick }) {
  const color   = cpuToColor(node.cpu)
  const typeTag = TYPE_LABELS[node.type] ?? 'SVC'

  return (
    <div
      onClick={() => onClick?.(node)}
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          10,
        padding:      '8px 12px',
        background:   '#141414',
        border:       `0.5px solid ${color.stroke}`,
        borderRadius: 8,
        cursor:       onClick ? 'pointer' : 'default',
        transition:   'border-color 0.3s',
      }}
    >
      {/* type */}
      <div style={{
        width:        28,
        height:       28,
        borderRadius: 6,
        background:   `${color.stroke}22`,
        border:       `0.5px solid ${color.stroke}`,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        fontSize:     9,
        fontWeight:   500,
        color:        color.text,
        flexShrink:   0,
      }}>
        {typeTag}
      </div>

      {/* name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize:     12,
          fontWeight:   500,
          color:        '#ccc',
          whiteSpace:   'nowrap',
          overflow:     'hidden',
          textOverflow: 'ellipsis',
        }}>
          {node.name}
        </div>
        <div style={{ fontSize: 10, color: color.text, marginTop: 1 }}>
          {node.status}
        </div>
      </div>

      {/* CPU */}
      <div style={{
        fontSize:          13,
        fontWeight:        500,
        color:             color.text,
        fontVariantNumeric: 'tabular-nums',
        flexShrink:        0,
      }}>
        {formatCpu(node.cpu)}
      </div>
    </div>
  )
}