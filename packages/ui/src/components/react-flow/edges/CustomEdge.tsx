import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer } from 'reactflow'

export interface CustomEdgeData {
  label?: string
  type?: 'default' | 'success' | 'error' | 'warning'
  animated?: boolean
}

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<CustomEdgeData>) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const getEdgeStyle = () => {
    const baseStyle = {
      strokeWidth: selected ? 3 : 2,
    }

    switch (data?.type) {
      case 'success':
        return {
          ...baseStyle,
          stroke: '#10b981',
        }
      case 'error':
        return {
          ...baseStyle,
          stroke: '#ef4444',
        }
      case 'warning':
        return {
          ...baseStyle,
          stroke: '#f59e0b',
        }
      default:
        return {
          ...baseStyle,
          stroke: selected ? '#3b82f6' : '#6b7280',
        }
    }
  }

  const getMarkerEnd = () => {
    const color = data?.type === 'success' ? '#10b981' : 
                  data?.type === 'error' ? '#ef4444' : 
                  data?.type === 'warning' ? '#f59e0b' : 
                  selected ? '#3b82f6' : '#6b7280'

    return {
      type: 'arrowclosed' as const,
      width: 20,
      height: 20,
      color,
    }
  }

  return (
    <>
      <path
        id={id}
        className={`react-flow__edge-path ${data?.animated ? 'animated' : ''}`}
        d={edgePath}
        style={getEdgeStyle()}
        markerEnd={`url(#${getMarkerEnd().type})`}
      />
      
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              padding: '4px 8px',
              background: 'white',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              color: '#374151',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}

      <style>{`
        .animated {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }
        
        @keyframes dashdraw {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </>
  )
}