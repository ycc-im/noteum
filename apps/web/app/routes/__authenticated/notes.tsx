import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'

export const Route = createFileRoute('/__authenticated/notes')({
  component: NotesComponent,
})

function NotesComponent() {
  // 模拟笔记数据 - 实际应用中应从API获取
  const notes = [
    {
      id: 1,
      title: '项目计划讨论',
      category: '工作',
      date: '2025-03-26',
      color: 'blue',
      content: '讨论新项目的计划和时间线，确定主要里程碑和任务分配。',
    },
    {
      id: 2,
      title: '周末旅行安排',
      category: '个人',
      date: '2025-03-25',
      color: 'green',
      content: '计划周末去杭州的行程，包括交通、住宿和景点安排。',
    },
    {
      id: 3,
      title: '学习React Router',
      category: '学习',
      date: '2025-03-23',
      color: 'purple',
      content: '学习TanStack Router的基本用法和高级特性，包括路由配置、嵌套路由和路由守卫。',
    },
    {
      id: 4,
      title: '健身计划',
      category: '健康',
      date: '2025-03-20',
      color: 'red',
      content: '制定每周三次的健身计划，包括有氧运动和力量训练。',
    },
    {
      id: 5,
      title: '读书笔记：深入理解TypeScript',
      category: '学习',
      date: '2025-03-18',
      color: 'purple',
      content: '关于TypeScript类型系统的笔记，包括泛型、条件类型和映射类型的使用。',
    },
    {
      id: 6,
      title: '团队会议记录',
      category: '工作',
      date: '2025-03-15',
      color: 'blue',
      content: '记录团队周会的主要讨论内容和决策，以及接下来一周的工作计划。',
    },
    {
      id: 7,
      title: '购物清单',
      category: '个人',
      date: '2025-03-12',
      color: 'green',
      content: '需要购买的生活用品和食材清单，包括价格预估。',
    },
    {
      id: 8,
      title: '电影观后感：星际穿越',
      category: '娱乐',
      date: '2025-03-10',
      color: 'yellow',
      content: '观看《星际穿越》后的感想和思考，关于时间、爱与引力的哲学思考。',
    },
  ]

  // 分类和标签数据
  const categories = [
    { name: '全部', count: notes.length },
    {
      name: '工作',
      count: notes.filter((note) => note.category === '工作').length,
    },
    {
      name: '个人',
      count: notes.filter((note) => note.category === '个人').length,
    },
    {
      name: '学习',
      count: notes.filter((note) => note.category === '学习').length,
    },
    {
      name: '健康',
      count: notes.filter((note) => note.category === '健康').length,
    },
    {
      name: '娱乐',
      count: notes.filter((note) => note.category === '娱乐').length,
    },
  ]

  const [selectedCategory, setSelectedCategory] = React.useState('全部')
  const [searchQuery, setSearchQuery] = React.useState('')

  // 根据分类和搜索过滤笔记
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === '全部' || note.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">笔记</h1>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            role="img"
            aria-label="新建笔记"
          >
            <title>新建笔记</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新建笔记
        </button>
      </div>

      {/* 搜索和过滤区域 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  role="img"
                  aria-label="搜索"
                >
                  <title>搜索</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="搜索笔记..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 笔记列表 */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        {filteredNotes.length > 0 ? (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotes.map((note) => (
              <li key={note.id}>
                <a
                  href={`/notes/${note.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full bg-${note.color}-500 mr-3`} />
                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                          {note.title}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
                          {note.category}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {note.content}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p>{note.date}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">未找到笔记</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              没有符合当前筛选条件的笔记。
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  setSelectedCategory('全部')
                  setSearchQuery('')
                }}
              >
                清除筛选条件
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
