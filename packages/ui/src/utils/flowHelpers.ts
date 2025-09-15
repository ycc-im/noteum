import { Node, Edge } from 'reactflow'

// 布局相关的工具函数
export interface LayoutOptions {
  direction: 'TB' | 'BT' | 'LR' | 'RL'
  spacing: { x: number; y: number }
}

// 自动布局 - 简单的层级布局
export function autoLayout(nodes: Node[], edges: Edge[], options: LayoutOptions = {
  direction: 'TB',
  spacing: { x: 200, y: 100 }
}): Node[] {
  if (nodes.length === 0) return nodes

  // 构建邻接表
  const adjacencyList = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  // 初始化
  nodes.forEach(node => {
    adjacencyList.set(node.id, [])
    inDegree.set(node.id, 0)
  })

  // 构建图
  edges.forEach(edge => {
    adjacencyList.get(edge.source)?.push(edge.target)
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
  })

  // 拓扑排序分层
  const layers: string[][] = []
  const queue: string[] = []
  const processed = new Set<string>()

  // 找到入度为0的节点
  nodes.forEach(node => {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id)
    }
  })

  while (queue.length > 0 || processed.size < nodes.length) {
    const currentLayer: string[] = []
    
    // 处理当前层
    while (queue.length > 0) {
      const nodeId = queue.shift()!
      currentLayer.push(nodeId)
      processed.add(nodeId)
    }

    if (currentLayer.length === 0) {
      // 处理环或孤立节点
      const remaining = nodes.filter(node => !processed.has(node.id))
      if (remaining.length > 0) {
        currentLayer.push(remaining[0].id)
        processed.add(remaining[0].id)
      }
    }

    layers.push(currentLayer)

    // 更新入度并添加到队列
    currentLayer.forEach(nodeId => {
      adjacencyList.get(nodeId)?.forEach(targetId => {
        if (!processed.has(targetId)) {
          const newInDegree = (inDegree.get(targetId) || 0) - 1
          inDegree.set(targetId, newInDegree)
          if (newInDegree === 0) {
            queue.push(targetId)
          }
        }
      })
    })
  }

  // 计算位置
  const updatedNodes = nodes.map(node => {
    let layerIndex = 0
    let nodeIndexInLayer = 0

    // 找到节点在哪一层
    for (let i = 0; i < layers.length; i++) {
      const index = layers[i].indexOf(node.id)
      if (index !== -1) {
        layerIndex = i
        nodeIndexInLayer = index
        break
      }
    }

    const layerSize = layers[layerIndex].length
    const centerOffset = (layerSize - 1) * options.spacing.x / 2

    let x: number, y: number

    if (options.direction === 'TB' || options.direction === 'BT') {
      x = nodeIndexInLayer * options.spacing.x - centerOffset
      y = layerIndex * options.spacing.y
      if (options.direction === 'BT') {
        y = (layers.length - 1 - layerIndex) * options.spacing.y
      }
    } else {
      x = layerIndex * options.spacing.x
      y = nodeIndexInLayer * options.spacing.y - centerOffset
      if (options.direction === 'RL') {
        x = (layers.length - 1 - layerIndex) * options.spacing.x
      }
    }

    return {
      ...node,
      position: { x, y }
    }
  })

  return updatedNodes
}

// 验证流程的有效性
export function validateFlow(nodes: Node[], edges: Edge[]): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // 检查孤立节点
  const connectedNodes = new Set<string>()
  edges.forEach(edge => {
    connectedNodes.add(edge.source)
    connectedNodes.add(edge.target)
  })

  const isolatedNodes = nodes.filter(node => !connectedNodes.has(node.id))
  if (isolatedNodes.length > 1) {
    warnings.push(`发现 ${isolatedNodes.length} 个孤立节点`)
  }

  // 检查循环依赖
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function hasCycle(nodeId: string): boolean {
    if (recursionStack.has(nodeId)) return true
    if (visited.has(nodeId)) return false

    visited.add(nodeId)
    recursionStack.add(nodeId)

    const outgoingEdges = edges.filter(edge => edge.source === nodeId)
    for (const edge of outgoingEdges) {
      if (hasCycle(edge.target)) return true
    }

    recursionStack.delete(nodeId)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id) && hasCycle(node.id)) {
      errors.push('检测到循环依赖')
      break
    }
  }

  // 检查无效连接
  const nodeIds = new Set(nodes.map(node => node.id))
  const invalidEdges = edges.filter(edge => 
    !nodeIds.has(edge.source) || !nodeIds.has(edge.target)
  )
  if (invalidEdges.length > 0) {
    errors.push(`发现 ${invalidEdges.length} 个无效连接`)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

// 计算流程统计信息
export function getFlowStats(nodes: Node[], edges: Edge[]) {
  const nodeTypes = new Map<string, number>()
  const edgeTypes = new Map<string, number>()

  nodes.forEach(node => {
    const type = node.type || 'default'
    nodeTypes.set(type, (nodeTypes.get(type) || 0) + 1)
  })

  edges.forEach(edge => {
    const type = edge.type || 'default'
    edgeTypes.set(type, (edgeTypes.get(type) || 0) + 1)
  })

  return {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    nodeTypes: Object.fromEntries(nodeTypes),
    edgeTypes: Object.fromEntries(edgeTypes),
    complexity: nodes.length + edges.length,
  }
}

// 导出流程为JSON
export function exportFlowToJSON(nodes: Node[], edges: Edge[]) {
  return JSON.stringify({
    nodes,
    edges,
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      stats: getFlowStats(nodes, edges)
    }
  }, null, 2)
}

// 从JSON导入流程
export function importFlowFromJSON(jsonString: string): {
  nodes: Node[]
  edges: Edge[]
  metadata?: any
} {
  try {
    const data = JSON.parse(jsonString)
    return {
      nodes: data.nodes || [],
      edges: data.edges || [],
      metadata: data.metadata
    }
  } catch (error) {
    throw new Error('Invalid JSON format')
  }
}