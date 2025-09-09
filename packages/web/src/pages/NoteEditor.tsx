import React, { useState } from 'react'

interface NoteEditorProps {}

/**
 * Note Editor page component - placeholder implementation
 * This will be the main editor interface with workflow-based editing capabilities
 */
export default function NoteEditor(props: NoteEditorProps) {
  const [title, setTitle] = useState('未命名笔记')
  const [content, setContent] = useState('')

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-medium text-gray-900 border-none outline-none bg-transparent"
                placeholder="输入笔记标题..."
              />
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                预览
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                保存
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Sidebar - Tools and Navigation */}
          <div className="lg:col-span-2 border-r border-gray-200 bg-gray-50">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">工具</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
                    📝 文本编辑
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
                    🖼️ 插入图片
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
                    🔗 添加链接
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
                    📊 插入表格
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">结构</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="px-3 py-1">• 介绍</div>
                  <div className="px-3 py-1">• 主要内容</div>
                  <div className="px-3 py-1">• 结论</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-7">
            <div className="p-6">
              {/* Workflow Canvas Placeholder */}
              <div className="mb-6 h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-lg mb-2">🔄</div>
                  <p className="text-gray-500 text-sm">工作流编辑器</p>
                  <p className="text-gray-400 text-xs mt-1">
                    这里将集成 React Flow 来实现可视化的笔记编辑流程
                  </p>
                </div>
              </div>

              {/* Text Editor */}
              <div className="border border-gray-200 rounded-lg">
                <div className="border-b border-gray-200 px-4 py-2">
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="font-medium text-gray-700 hover:text-gray-900">
                      粗体
                    </button>
                    <button className="font-medium text-gray-700 hover:text-gray-900">
                      斜体
                    </button>
                    <button className="font-medium text-gray-700 hover:text-gray-900">
                      标题
                    </button>
                    <div className="border-l border-gray-300 h-4"></div>
                    <button className="font-medium text-gray-700 hover:text-gray-900">
                      列表
                    </button>
                    <button className="font-medium text-gray-700 hover:text-gray-900">
                      引用
                    </button>
                  </div>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-4 border-none outline-none resize-none"
                  placeholder="开始编写您的笔记内容...

您可以使用 Markdown 语法：
# 标题
## 子标题
**粗体文本**
*斜体文本*
- 列表项
> 引用文本

[链接文本](URL)
![图片描述](图片URL)"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar - Properties and Links */}
          <div className="lg:col-span-3 border-l border-gray-200 bg-gray-50">
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  笔记属性
                </h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <label className="block text-gray-600">标签</label>
                    <input
                      type="text"
                      className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      placeholder="添加标签..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600">类别</label>
                    <select className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option>个人笔记</option>
                      <option>工作文档</option>
                      <option>学习资料</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  相关笔记
                </h3>
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white rounded border text-sm">
                    <div className="font-medium text-gray-900">项目规划</div>
                    <div className="text-gray-500 text-xs">2 天前</div>
                  </div>
                  <div className="px-3 py-2 bg-white rounded border text-sm">
                    <div className="font-medium text-gray-900">技术文档</div>
                    <div className="text-gray-500 text-xs">1 周前</div>
                  </div>
                  <button className="w-full px-3 py-2 text-sm text-indigo-600 hover:bg-white rounded border-2 border-dashed border-indigo-200">
                    + 添加关联
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  统计信息
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>字数: {content.length}</div>
                  <div>创建时间: 刚刚</div>
                  <div>最后修改: 刚刚</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
