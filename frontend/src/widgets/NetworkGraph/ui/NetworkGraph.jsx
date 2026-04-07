import { useRef, useCallback } from "react";
import { useEvents } from "@/features/events/store";
import {
  buildDefaultLayout,
  calcEdgeEndpoints,
  getNodeColor,
  getEdgeThickness,
} from "../model/graphUtils";

// one node graph
function GraphNode({ node, onNodeClick }) {
  const color = getNodeColor(node.cpu);
  const cx = node.x + node.width / 2;

  return (
    <g
      className="graph-node"
      onClick={() => onNodeClick(node)}
      style={{ cursor: "pointer" }}
    >
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx={8}
        fill={color.fill}
        stroke={color.stroke}
        strokeWidth={0.5}
        style={{ transition: "fill 0.4s, stroke 0.4s" }}
      />
      <text
        x={cx}
        y={node.y + node.height / 2 - 8}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: 11,
          fontWeight: 500,
          fill: color.text,
          fontFamily: "var(--font-sans)",
          pointerEvents: "none",
          transition: "fill 0.4s",
        }}
      >
        {node.name}
      </text>
      {node.cpu !== null && (
        <text
          x={cx}
          y={node.y + node.height / 2 + 9}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: 10,
            fill: color.stroke,
            fontFamily: "var(--font-sans)",
            pointerEvents: "none",
          }}
        >
          CPU {node.cpu}%
        </text>
      )}
    </g>
  );
}

// one edge of the graph
function GraphEdge({ edge, nodesMap }) {
  const source = nodesMap[edge.sourceId];
  const target = nodesMap[edge.targetId];
  if (!source || !target) return null;

  const { x1, y1, x2, y2 } = calcEdgeEndpoints(source, target);
  const thikness = getEdgeThickness(edge.rps ?? 0);
  const isDashed = edge.type === "replication";

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={edge.color ?? "#88780"}
      strokeWidth={thikness}
      strokeOpacity={0.4}
      strokeDasharray={isDashed ? "4 3" : undefined}
      markerEnd="url(#arrow-graph)"
      style={{ transition: "stroke-width 0.3s" }}
    />
  );
}


// animated traffic particle along the edge 
function TrafficParticle({ edge, nodesMap, delay = 0 }) {
    const source = nodesMap[edge.sourceId]
    const target = nodesMap[edge.targetId]
    if (!source || !target || !edge.rps) return null

    const sx = source.x + source.width / 2
    const sy = source.y + source.height / 2
    const tx = target.x + target.width / 2
    const ty = target.y + target.height / 2
    
    const duration = Math.max(0.6, 2 - (edge.rps / 1000))

    return (
        <circle r={2.5} fill="#378ADD" opacity={0.7}>
          <animateMotion
            dur={`${duration}s`}
            repeatCount="indefinite"
            begin={`${delay}s`}
            path={`M${sx},${sy} L${tx},${ty}`}
          />
        </circle>
    )
}

// container region
function RegionBox({ region }) {
    return (
        <g>
            <rect
             x={region.x} y={region.y}
            width={region.width} height={region.height}
            rx={14}
            fill="none"
            stroke="var(--color-border-tertiary)"
            strokeWidth={0.5}
            strokeDasharray="6 4"
        />
        <text 
        x={region.x + 14}
        y={region.y + 18}
        style={{
          fontSize: 10,
          fill: 'var(--color-text-tertiary)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        {region.name}
        </text>
        </g>
    )
}

// main component
export function NetworkGraph({ nodes, edges, regions }){
    const svgRef = useRef(null)
    const { addEvent } = useEvents()

    // add position nodes 
    const layoutNodes = buildDefaultLayout(nodes)

    // fast lookup nodes by ip
    const nodesMap = Object.fromEntries(
        layoutNodes.map(n => [n.id, n])
    )


    const handleNodeClick = useCallback((node) => {
      addEvent({
        type: 'info',
        message: `Selected: ${node.name} — CPU ${node.cpu}%, status ${node.status}`,
      })
    }, [addEvent])


    return (
        <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 560 420"
      style={{ display: 'block' }}
    >
      <defs>
        <marker
          id="arrow-graph"
          viewBox="0 0 10 10"
          refX="8" refY="5"
          markerWidth="5" markerHeight="5"
          orient="auto-start-reverse"
        >
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="context-stroke"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* 1. Regions */}
      {regions.map(region => (
        <RegionBox key={region.id} region={region} />
      ))}

      {/* 2. Edges */}
      {edges.map(edge => (
        <GraphEdge
          key={edge.id}
          edge={edge}
          nodesMap={nodesMap}
        />
      ))}

      {/* 3. Particle Traffic */}
      {edges.map((edge, i) => (
        <TrafficParticle
          key={`p-${edge.id}`}
          edge={edge}
          nodesMap={nodesMap}
          delay={i * 0.3}
        />
      ))}

      {/* 4. Nodes-Top */}
      {layoutNodes.map(node => (
        <GraphNode
          key={node.id}
          node={node}
          onNodeClick={handleNodeClick}
        />
      ))}
    </svg>
  )
}

