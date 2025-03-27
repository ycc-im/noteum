import { initTRPC } from '@trpc/server'
import { z } from 'zod'

const t = initTRPC.create()

// 定义节点数据类型
export interface NodeData {
  id: string
  uid: string // 全局唯一标识符
  type: string
  position: {
    x: number
    y: number
  }
  label: string
  content: {
    type: string
    data: any
    plainText: string
    metadata?: Record<string, any>
  }
  color?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  parentId?: string
  width?: number
  height?: number
  zIndex?: number
  isHidden?: boolean
  metadata?: Record<string, any>
  userId: string
  workspaceId: string
}

// 定义边数据类型
export interface EdgeData {
  id: string
  uid: string // 全局唯一标识符
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
  markerType?: string
  label?: string
  style?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// 创建mock数据生成函数
const generateMockNodes = (date: string): NodeData[] => {
  // 解析日期
  const [year, month, day] = date.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const formattedDate = dateObj.toISOString().split('T')[0]

  return [
    {
      id: '1',
      uid: 'node_' + Math.random().toString(36).substring(2, 15),
      type: 'note',
      position: { x: 250, y: 25 },
      label: `${formattedDate}的工作计划`,
      content: {
        type: 'rich_text',
        data: {
          html: '<p>今天需要完成以下工作：</p><ul><li>完成项目设计</li><li>与团队讨论实现方案</li><li>准备周报</li></ul>',
          delta: [], // 编辑器原始数据
        },
        plainText: '今天需要完成以下工作：完成项目设计、与团队讨论实现方案、准备周报',
      },
      color: 'blue',
      tags: ['工作', '计划', '重要'],
      createdAt: `${formattedDate}T08:00:00Z`,
      updatedAt: `${formattedDate}T08:00:00Z`,
      userId: 'user1',
      workspaceId: 'workspace1',
    },
    {
      id: '2',
      uid: 'node_' + Math.random().toString(36).substring(2, 15),
      type: 'note',
      position: { x: 250, y: 250 },
      label: '项目设计文档',
      content: {
        type: 'url',
        data: {
          url: 'https://example.com/design-doc',
          title: '项目设计文档',
          description: '包含项目架构、数据模型和API设计',
        },
        plainText: '项目设计文档 - 包含项目架构、数据模型和API设计',
      },
      color: 'green',
      tags: ['文档', '设计', '项目'],
      createdAt: `${formattedDate}T09:15:00Z`,
      updatedAt: `${formattedDate}T09:15:00Z`,
      userId: 'user1',
      workspaceId: 'workspace1',
    },
    {
      id: '3',
      uid: 'node_' + Math.random().toString(36).substring(2, 15),
      type: 'note',
      position: { x: 500, y: 150 },
      label: '会议记录',
      content: {
        type: 'text',
        data: '与产品团队讨论了新功能的实现方案，决定采用ReactFlow实现节点图功能。下周一开始开发。',
        plainText:
          '与产品团队讨论了新功能的实现方案，决定采用ReactFlow实现节点图功能。下周一开始开发。',
      },
      color: 'purple',
      tags: ['会议', '记录'],
      createdAt: `${formattedDate}T14:30:00Z`,
      updatedAt: `${formattedDate}T14:30:00Z`,
      userId: 'user1',
      workspaceId: 'workspace1',
    },
    {
      id: '4',
      uid: 'node_' + Math.random().toString(36).substring(2, 15),
      type: 'note',
      position: { x: 700, y: 300 },
      label: '参考资料',
      content: {
        type: 'embed',
        data: {
          embedType: 'youtube',
          embedId: 'dQw4w9WgXcQ',
          title: 'ReactFlow教程视频',
        },
        plainText: 'ReactFlow教程视频',
      },
      color: 'red',
      tags: ['教程', '视频', '学习'],
      createdAt: `${formattedDate}T16:45:00Z`,
      updatedAt: `${formattedDate}T16:45:00Z`,
      userId: 'user1',
      workspaceId: 'workspace1',
    },
  ]
}

// 创建mock边数据
const generateMockEdges = (): EdgeData[] => {
  return [
    {
      id: 'e1-2',
      uid: 'edge_' + Math.random().toString(36).substring(2, 15),
      source: '1',
      target: '2',
      markerType: 'ArrowClosed',
      label: '参考',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'e1-3',
      uid: 'edge_' + Math.random().toString(36).substring(2, 15),
      source: '1',
      target: '3',
      markerType: 'ArrowClosed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'e3-4',
      uid: 'edge_' + Math.random().toString(36).substring(2, 15),
      source: '3',
      target: '4',
      markerType: 'ArrowClosed',
      label: '学习资料',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

// 定义工作区数据类型
export interface WorkspaceData {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  ownerId: string
  members?: string[]
  settings?: Record<string, any>
}

// 创建mock工作区数据
const generateMockWorkspaces = (): WorkspaceData[] => {
  return [
    {
      id: 'workspace1',
      name: '个人笔记',
      description: '我的个人笔记和想法',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      ownerId: 'user1',
      members: ['user1'],
    },
    {
      id: 'workspace2',
      name: '项目计划',
      description: '团队项目管理和计划',
      createdAt: '2025-02-15T00:00:00Z',
      updatedAt: '2025-03-10T00:00:00Z',
      ownerId: 'user1',
      members: ['user1', 'user2', 'user3'],
      settings: {
        theme: 'light',
        defaultView: 'flow',
      },
    },
    {
      id: 'workspace3',
      name: '学习资料',
      description: '学习笔记和参考资料',
      createdAt: '2025-03-01T00:00:00Z',
      updatedAt: '2025-03-20T00:00:00Z',
      ownerId: 'user1',
      members: ['user1', 'user4'],
    },
  ]
}

// 创建节点路由
export const nodesRouter = t.router({
  // 根据日期获取节点
  getNodesByDate: t.procedure
    .input(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)) // 验证日期格式 YYYY-MM-DD
    .query(({ input }) => {
      // 返回mock数据
      return {
        nodes: generateMockNodes(input),
        edges: generateMockEdges(),
      }
    }),

  // 根据工作区获取节点
  getNodesByWorkspace: t.procedure
    .input(
      z.object({
        workspaceId: z.string(),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      }),
    )
    .query(({ input }) => {
      // 如果提供了日期，则过滤特定日期的数据
      const nodes = input.date
        ? generateMockNodes(input.date).filter((node) => node.workspaceId === input.workspaceId)
        : generateMockNodes('2025-03-28').filter((node) => node.workspaceId === input.workspaceId)

      // 只返回该工作区相关的边
      const nodeIds = nodes.map((node) => node.id)
      const edges = generateMockEdges().filter(
        (edge) => nodeIds.includes(edge.source) && nodeIds.includes(edge.target),
      )

      return { nodes, edges }
    }),

  // 获取工作区简单版（使用简单参数）
  getWorkspace: t.procedure.input(z.string()).query(({ input }) => {
    const workspace = generateMockWorkspaces().find((ws) => ws.id === input)
    return workspace || { error: 'Workspace not found' }
  }),

  // 测试端点，不需要参数
  test: t.procedure.query(() => {
    return { message: 'API is working correctly!' }
  }),

  // 获取所有工作区
  getAllWorkspaces: t.procedure.query(() => {
    return generateMockWorkspaces()
  }),

  // 获取所有标签
  getAllTags: t.procedure.query(() => {
    // 返回mock标签数据
    return ['工作', '计划', '重要', '文档', '设计', '项目', '会议', '记录', '教程', '视频', '学习']
  }),
})
