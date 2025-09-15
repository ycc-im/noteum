
import { Handle, Position, NodeProps } from 'reactflow'

export interface CustomNodeData {
  label: string
  description?: string
  type?: 'default' | 'input' | 'output' | 'process'
}

export function CustomNode({ data, selected }: NodeProps<CustomNodeData>) {
  const getNodeStyle = () => {
    const baseStyle = {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '2px solid',
      background: 'white',
      minWidth: '150px',
      fontSize: '14px',
      fontFamily: 'system-ui, sans-serif',
    }

    switch (data.type) {
      case 'input':
        return {
          ...baseStyle,
          borderColor: selected ? '#10b981' : '#6ee7b7',
          background: '#ecfdf5',
        }
      case 'output':
        return {
          ...baseStyle,
          borderColor: selected ? '#ef4444' : '#fca5a5',
          background: '#fef2f2',
        }
      case 'process':
        return {
          ...baseStyle,
          borderColor: selected ? '#3b82f6' : '#93c5fd',
          background: '#eff6ff',
        }
      default:
        return {
          ...baseStyle,
          borderColor: selected ? '#6b7280' : '#d1d5db',
          background: '#f9fafb',
        }
    }
  }

  return (
    <div style={getNodeStyle()}>
      {data.type !== 'output' && (
        <Handle
          type="target"
          position={Position.Top}
          style={{ background: '#555' }}
        />
      )}
      
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
          {data.label}
        </div>
        {data.description && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {data.description}
          </div>
        )}
      </div>

      {data.type !== 'input' && (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{ background: '#555' }}
        />
      )}
    </div>
  )
}