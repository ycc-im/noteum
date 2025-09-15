import { useState, useCallback } from 'react'
import { Node, Edge, Connection, addEdge } from 'reactflow'

export interface FlowState {
  nodes: Node[]
  edges: Edge[]
}

export interface UseFlowStateReturn {
  nodes: Node[]
  edges: Edge[]
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>
  addNode: (node: Omit<Node, 'id'>) => string
  removeNode: (nodeId: string) => void
  addConnection: (connection: Connection) => void
  removeEdge: (edgeId: string) => void
  clearFlow: () => void
  getFlowData: () => FlowState
  loadFlowData: (data: FlowState) => void
}

export function useFlowState(
  initialNodes: Node[] = [],
  initialEdges: Edge[] = []
): UseFlowStateReturn {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)

  // 添加节点
  const addNode = useCallback((nodeData: Omit<Node, 'id'>) => {
    const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newNode: Node = {
      ...nodeData,
      id: nodeId,
    }
    
    setNodes((nds) => [...nds, newNode])
    return nodeId
  }, [])

  // 删除节点
  const removeNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
  }, [])

  // 添加连接
  const addConnection = useCallback((connection: Connection) => {
    const edgeId = `${connection.source}-${connection.target}-${Date.now()}`
    const newEdge = {
      ...connection,
      id: edgeId,
      type: 'customEdge',
    }
    setEdges((eds) => addEdge(newEdge, eds))
  }, [])

  // 删除边
  const removeEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
  }, [])

  // 清空流程
  const clearFlow = useCallback(() => {
    setNodes([])
    setEdges([])
  }, [])

  // 获取流程数据
  const getFlowData = useCallback((): FlowState => {
    return { nodes, edges }
  }, [nodes, edges])

  // 加载流程数据
  const loadFlowData = useCallback((data: FlowState) => {
    setNodes(data.nodes)
    setEdges(data.edges)
  }, [])

  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    removeNode,
    addConnection,
    removeEdge,
    clearFlow,
    getFlowData,
    loadFlowData,
  }
}