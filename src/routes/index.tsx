import { createFileRoute, Link } from '@tanstack/react-router';
import { useLogto } from '@logto/react';
import logo from '../logo.svg';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated, isLoading } = useLogto();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)] p-4">
      <img
        src={logo}
        className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite] mb-8"
        alt="logo"
      />

      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
        欢迎来到 Noteum
      </h1>

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
        <div className="mb-8 space-y-6">
          <p className="text-xl mb-6">开始使用智能笔记系统</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              search={{}}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium min-w-[120px]"
            >
              立即登录
            </Link>
            <Link
              to="/login"
              search={{}}
              className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#282c34] transition-colors font-medium min-w-[120px]"
            >
              注册账户
            </Link>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 text-lg mt-8">
        <a
          className="text-[#61dafb] hover:underline transition-colors"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <a
          className="text-[#61dafb] hover:underline transition-colors"
          href="https://tanstack.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn TanStack
        </a>
      </div>
    </div>
  );
}
