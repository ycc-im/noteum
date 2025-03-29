import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  Connection,
  NodeTypes,
  BackgroundVariant,
  NodeProps,
  Handle,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// 自定义样式，将ReactFlow logo移动到右下角
import './reactflow-custom.css'

// 导入自定义组件
import VerticalToolbar from './-components/VerticalToolbar'

export const Route = createFileRoute('/__authenticated/')({
  component: AuthenticatedIndexComponent,
})

interface NoteData {
  label: string
  content?: string
  color?: string
  tags?: string[]
  createdAt?: string
}

// 自定义笔记节点组件
const NoteNode = ({ data }: NodeProps<NoteData>) => {
  const color = data.color || 'indigo'

  return (
    <div
      className={`p-3 border-2 border-${color}-500 bg-white dark:bg-gray-800 rounded-lg shadow-md min-w-[200px]`}
    >
      {/* 处理连接点 */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />

      <div className="flex items-center mb-2">
        <div className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></div>
        <div className="font-medium text-gray-900 dark:text-white">{data.label}</div>
      </div>
      {data.content && (
        <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{data.content}</div>
      )}
      {data.tags && data.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {data.createdAt && (
        <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">{data.createdAt}</div>
      )}
    </div>
  )
}

// 节点类型映射
const nodeTypes: NodeTypes = {
  note: NoteNode,
}

// 初始节点数据
const initialNodes: Node<NoteData>[] = [
  {
    id: '1',
    type: 'note',
    data: {
      label: '我的第一个笔记',
      content: '这是一个基于ReactFlow的笔记画布，你可以在这里创建和连接各种笔记节点。',
      color: 'blue',
      tags: ['示例', '入门'],
      createdAt: '2025-03-26 23:10',
    },
    position: { x: 250, y: 25 },
  },
]

// 初始连线数据
const initialEdges: Edge[] = []

function AuthenticatedIndexComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = React.useState<Node<NoteData> | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editData, setEditData] = React.useState<NoteData | null>(null)

  // 当节点被选中时的处理函数
  const onNodeClick = React.useCallback((event: React.MouseEvent, node: Node<NoteData>) => {
    setSelectedNode(node)
  }, [])

  // 当画布被点击时取消选中
  const onPaneClick = React.useCallback(() => {
    setSelectedNode(null)
  }, [])

  // 开始编辑节点
  const startEditingNode = () => {
    if (selectedNode) {
      setEditData({
        ...selectedNode.data,
      })
      setIsEditing(true)
    }
  }

  // 保存编辑的节点
  const saveNodeEdit = () => {
    if (selectedNode && editData) {
      setNodes((nds) => {
        return nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: editData,
            }
          }
          return node
        })
      })
      setIsEditing(false)
      setEditData(null)
    }
  }

  // 取消编辑
  const cancelEditing = () => {
    setIsEditing(false)
    setEditData(null)
  }

  // 删除选中节点
  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id),
      )
      setSelectedNode(null)
    }
  }

  // 添加新节点的处理函数
  const onAddNode = () => {
    const newNode: Node<NoteData> = {
      id: `${Date.now()}`,
      type: 'note',
      data: {
        label: `新笔记 ${nodes.length + 1}`,
        content: '点击编辑笔记内容...',
        color: ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random() * 5)],
        tags: ['新建'],
        createdAt: new Date().toLocaleString('zh-CN'),
      },
      position: {
        x: Math.random() * 500,
        y: Math.random() * 500,
      },
    }
    setNodes((nds) => nds.concat(newNode))
  }

  // 连接节点的处理函数
  const onConnect = React.useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        // 确保连接有源和目标
        if (!params.source || !params.target) return eds

        return eds.concat({
          id: `e${params.source}-${params.target}`,
          source: params.source,
          target: params.target,
          sourceHandle: params.sourceHandle,
          targetHandle: params.targetHandle,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        })
      })
    },
    [setEdges],
  )

  return (
    <div className="w-full h-full p-0 m-0 overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
      {isEditing && editData ? (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">编辑笔记</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标题
                </label>
                <input
                  type="text"
                  value={editData.label}
                  onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  内容
                </label>
                <textarea
                  value={editData.content || ''}
                  onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  标签
                </label>
                <input
                  type="text"
                  value={editData.tags?.join(', ') || ''}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      tags: e.target.value
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="用逗号分隔标签"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  颜色
                </label>
                <select
                  value={editData.color || 'blue'}
                  onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="blue">蓝色</option>
                  <option value="green">绿色</option>
                  <option value="purple">紫色</option>
                  <option value="red">红色</option>
                  <option value="yellow">黄色</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
              <button
                onClick={saveNodeEdit}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

        {/* 垂直功能菜单条 */}
        <Panel position="top-left" className="ml-4 mt-4">
          <VerticalToolbar />
        </Panel>

        <Panel position="top-right">
          <div className="flex flex-col space-y-2">
            <button
              onClick={onAddNode}
              className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition-colors flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              添加笔记
            </button>

            {selectedNode && (
              <div className="mt-4 bg-white dark:bg-gray-800 p-3 rounded shadow-md">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">选中的笔记</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={startEditingNode}
                    className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200 rounded hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors flex items-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    编辑
                  </button>
                  <button
                    onClick={deleteSelectedNode}
                    className="px-3 py-1.5 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors flex items-center text-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    删除
                  </button>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}
