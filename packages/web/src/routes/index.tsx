import { createFileRoute, Link } from '@tanstack/react-router'
import { useLogto } from '@logto/react'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { isAuthenticated, isLoading } = useLogto()

  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <img
          src={logo}
          className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
          alt="logo"
        />
        
        <h1 className="text-4xl font-bold mb-4">欢迎来到 Noteum</h1>
        
        {isLoading ? (
          <p className="text-xl mb-8">加载中...</p>
        ) : isAuthenticated ? (
          <div className="mb-8">
            <p className="text-xl mb-4">您已成功登录！</p>
            <Link 
              to="/dashboard"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              进入仪表板
            </Link>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-xl mb-6">开始使用智能笔记系统</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                立即登录
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#282c34] transition-colors"
              >
                注册账户
              </Link>
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-2 text-base">
          <a
            className="text-[#61dafb] hover:underline"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <a
            className="text-[#61dafb] hover:underline"
            href="https://tanstack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TanStack
          </a>
        </div>
      </header>
    </div>
  )
}
