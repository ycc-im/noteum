import * as React from 'react'
import { Outlet, createFileRoute } from '@tanstack/react-router'

// 引入必要的图标组件
const IconToday = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
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
)

const IconTags = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
)

const IconInbox = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>
)

const IconAI = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const IconLayout = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
)

const IconNotification = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
)

const IconHelp = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const IconUser = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const IconChevronRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export const Route = createFileRoute('/__authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  // 侧边栏展开/收起状态
  const [sidebarExpanded, setSidebarExpanded] = React.useState(true)

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* 左侧边栏 */}
      <div
        className={`${
          sidebarExpanded ? 'w-64' : 'w-20'
        } flex flex-col fixed h-full bg-black text-white transition-all duration-300 ease-in-out z-10`}
      >
        {/* 顶部导航控制 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <button className="p-1 rounded hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <button className="p-1 rounded hover:bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
        </div>

        {/* 主菜单 */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2">
          <div className="px-4 space-y-1">
            <a href="/" className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800">
              <IconToday />
              {sidebarExpanded && <span>今天</span>}
            </a>
            <a
              href="/tags"
              className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
            >
              <IconTags />
              {sidebarExpanded && <span>标签</span>}
            </a>
            <a
              href="/inbox"
              className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
            >
              <IconInbox />
              {sidebarExpanded && <span>收件箱</span>}
            </a>
            <a
              href="/ai"
              className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
            >
              <IconAI />
              {sidebarExpanded && (
                <div className="flex items-center justify-between w-full">
                  <span>AI 助手</span>
                  <span className="bg-green-600 text-xs px-1 rounded">PLUS</span>
                </div>
              )}
            </a>
            <a
              href="/layouts"
              className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
            >
              <IconLayout />
              {sidebarExpanded && <span>保存布局</span>}
            </a>
          </div>

          {/* 创建新笔记 */}
          <div className="px-4 mt-4">
            <div className="flex items-center space-x-2 bg-gray-800 rounded p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              {sidebarExpanded && (
                <>
                  <input
                    type="text"
                    placeholder="创建新笔记"
                    className="bg-transparent border-none focus:outline-none flex-1"
                  />
                  <button className="p-1 rounded hover:bg-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 固定笔记 */}
          {sidebarExpanded && (
            <div className="px-4 mt-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-2">固定</h3>
              <div className="mt-2 space-y-1">
                <a
                  href="/notes/todos"
                  className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="block w-3 h-3 bg-white"></span>
                    <span>待办事项</span>
                  </div>
                </a>
                <a
                  href="/notes/ideas"
                  className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="block w-3 h-3 bg-green-500"></span>
                    <span>创意</span>
                  </div>
                </a>
                <a
                  href="/notes/daily"
                  className="flex items-center space-x-3 px-2 py-2 rounded hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="block w-3 h-3 bg-purple-500"></span>
                    <span>日常反思</span>
                  </div>
                </a>
              </div>
            </div>
          )}

          {/* 工作区 */}
          {sidebarExpanded && (
            <div className="px-4 mt-6">
              <h3 className="text-xs uppercase text-gray-500 font-semibold px-2">工作区</h3>
              <div className="mt-2 space-y-1">
                <a
                  href="/workspaces/personal"
                  className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-xs">
                      J
                    </span>
                    <span>个人工作区</span>
                  </div>
                  <IconChevronRight />
                </a>
                <a
                  href="/workspaces/team"
                  className="flex items-center justify-between px-2 py-2 rounded hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gray-500 text-xs">
                      X
                    </span>
                    <span>团队工作区</span>
                  </div>
                  <IconChevronRight />
                </a>
              </div>
              <a
                href="/workspaces/manage"
                className="block text-sm text-gray-500 hover:text-white px-2 py-2 mt-2"
              >
                管理工作区
              </a>
            </div>
          )}
        </div>

        {/* 底部工具栏 */}
        <div className="border-t border-gray-800 p-4 flex items-center justify-between">
          <button className="p-2 rounded hover:bg-gray-800">
            <IconNotification />
          </button>
          <button className="p-2 rounded hover:bg-gray-800">
            <IconHelp />
          </button>
          <button className="p-2 rounded hover:bg-gray-800">
            <IconUser />
          </button>

          {/* 收起/展开按钮 */}
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="p-2 rounded hover:bg-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {sidebarExpanded ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 右侧内容区域 */}
      <div
        className={`${
          sidebarExpanded ? 'ml-64' : 'ml-20'
        } flex-1 transition-all duration-300 ease-in-out`}
      >
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
