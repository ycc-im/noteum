// 模拟 Block 类型
export interface MockBlock {
  id: string
  content: string
  type: 'text' | 'image' | 'code' | 'heading' | 'paragraph' | 'list-item' | 'quote'
  children?: MockBlock[]
  collapsed?: boolean
  indent: number
}

// 模拟数据
// 确保所有模拟数据都有 indent 属性
export const mockBlocks: MockBlock[] = [
  {
    id: '1',
    content: '这是一个标题',
    type: 'heading',
    indent: 0,
    children: [
      {
        id: '1-1',
        content: '这是一段文本内容',
        type: 'text',
        indent: 1,
      },
      {
        id: '1-2',
        content: '这是一段代码',
        type: 'code',
        indent: 1,
        children: [
          {
            id: '1-2-1',
            content: 'console.log("Hello World");',
            type: 'text',
            indent: 2,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    content: '另一个标题',
    type: 'heading',
    indent: 0,
    children: [
      {
        id: '2-1',
        content: '这是第二段文本内容',
        type: 'text',
        indent: 1,
      },
    ],
  },
]
