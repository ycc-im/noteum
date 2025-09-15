import React, { useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'

export interface AINodeData {
  title: string
  content: string
  aiModel?: string
  status?: 'idle' | 'processing' | 'completed' | 'error'
  confidence?: number
}

export function AINode({ data, selected }: NodeProps<AINodeData>) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = () => {
    switch (data.status) {
      case 'processing':
        return '#fbbf24'
      case 'completed':
        return '#10b981'
      case 'error':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusIcon = () => {
    switch (data.status) {
      case 'processing':
        return '⏳'
      case 'completed':
        return '✅'
      case 'error':
        return '❌'
      default:
        return '🤖'
    }
  }

  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '12px',
        border: `2px solid ${selected ? getStatusColor() : '#e5e7eb'}`,
        background: 'white',
        minWidth: '250px',
        maxWidth: '350px',
        boxShadow: selected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: getStatusColor() }}
      />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px', marginRight: '8px' }}>
          {getStatusIcon()}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {data.title}
          </div>
          {data.aiModel && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              模型: {data.aiModel}
            </div>
          )}
        </div>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: getStatusColor(),
          }}
        />
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#374151',
          cursor: 'pointer',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded || data.content.length <= 100
          ? data.content
          : `${data.content.substring(0, 100)}...`}
        {data.content.length > 100 && (
          <span style={{ color: '#6b7280', fontStyle: 'italic' }}>
            {isExpanded ? ' 收起' : ' 展开'}
          </span>
        )}
      </div>

      {/* Confidence Score */}
      {data.confidence !== undefined && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            置信度: {Math.round(data.confidence * 100)}%
          </div>
          <div
            style={{
              width: '100%',
              height: '4px',
              background: '#e5e7eb',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${data.confidence * 100}%`,
                height: '100%',
                background: data.confidence > 0.8 ? '#10b981' : data.confidence > 0.6 ? '#fbbf24' : '#ef4444',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: getStatusColor() }}
      />
    </div>
  )
}