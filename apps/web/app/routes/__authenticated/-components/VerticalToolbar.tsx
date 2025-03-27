import * as React from 'react'

interface ToolbarButtonProps {
  icon: React.ReactNode
  title: string
  onClick: () => void
  color?: string
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, title, onClick, color = 'gray' }) => {
  const colorClasses = {
    gray: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
    teal: 'text-teal-500 hover:text-teal-600 dark:hover:text-teal-400',
    blue: 'text-blue-500 hover:text-blue-600 dark:hover:text-blue-400',
    purple: 'text-purple-500 hover:text-purple-600 dark:hover:text-purple-400',
  }

  return (
    <button
      className={`${colorClasses[color as keyof typeof colorClasses]} transition-colors`}
      title={title}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

export interface VerticalToolbarProps {
  className?: string
}

export const VerticalToolbar: React.FC<VerticalToolbarProps> = ({ className = '' }) => {
  const handleButtonClick = (feature: string) => {
    alert(`${feature}功能尚未实现`)
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col items-center p-3 space-y-6 ${className}`}
    >
      {/* 闪光/魔法功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        }
        title="魔法功能"
        onClick={() => handleButtonClick('魔法')}
        color="teal"
      />

      {/* 代码功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        }
        title="代码片段"
        onClick={() => handleButtonClick('代码')}
      />

      {/* 链接功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        }
        title="添加链接"
        onClick={() => handleButtonClick('链接')}
      />

      {/* 文档功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        }
        title="文档功能"
        onClick={() => handleButtonClick('文档')}
      />

      {/* 上传功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        }
        title="上传文件"
        onClick={() => handleButtonClick('上传')}
      />

      {/* 图层功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        }
        title="图层管理"
        onClick={() => handleButtonClick('图层')}
      />

      {/* 添加页面功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
        }
        title="添加页面"
        onClick={() => handleButtonClick('添加页面')}
      />

      {/* 文本文档功能 */}
      <ToolbarButton
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        }
        title="文本文档"
        onClick={() => handleButtonClick('文本文档')}
      />
    </div>
  )
}

export default VerticalToolbar
