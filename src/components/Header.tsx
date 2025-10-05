import React from 'react'
import { Link } from '@tanstack/react-router'
import { useLogto } from '@logto/react'

export default function Header() {
  const { isAuthenticated, isLoading, signOut, getIdTokenClaims } = useLogto()

  const handleSignOut = async () => {
    await signOut(`${window.location.origin}`)
  }

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between border-b">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/server-funcs">Start - Server Functions</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/demo/start/api-request">Start - API Request</Link>
        </div>
      </nav>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="px-3 py-1 text-sm text-gray-500">加载中...</div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2">
            <UserInfo />
            <button
              onClick={handleSignOut}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              登出
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            登录
          </Link>
        )}
      </div>
    </header>
  )
}

function UserInfo() {
  const { getIdTokenClaims } = useLogto()
  const [userInfo, setUserInfo] = React.useState<any>(null)

  React.useEffect(() => {
    // Only fetch user info on client side
    if (typeof window === 'undefined') return

    const fetchUserInfo = async () => {
      try {
        const claims = await getIdTokenClaims()
        setUserInfo(claims)
      } catch (error) {
        console.warn('Failed to get user claims:', error)
      }
    }

    fetchUserInfo()
  }, [getIdTokenClaims])

  if (!userInfo) {
    return <div className="px-2 text-sm text-gray-600">用户</div>
  }

  return (
    <div className="px-2 text-sm text-gray-600">
      欢迎, {userInfo.name || userInfo.email || userInfo.sub}
    </div>
  )
}
