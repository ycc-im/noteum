import React from 'react';
import { Link } from '@tanstack/react-router';
import { useLogto } from '@logto/react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { isAuthenticated, isLoading, signOut } = useLogto();

  const handleSignOut = async () => {
    await signOut(`${window.location.origin}`);
  };

  return (
    <header className="p-2 flex gap-2 bg-card text-foreground justify-between border-b">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link
            to="/demo/start/server-funcs"
            className="hover:text-primary transition-colors"
          >
            Start - Server Functions
          </Link>
        </div>

        <div className="px-2 font-bold">
          <Link
            to="/demo/start/api-request"
            className="hover:text-primary transition-colors"
          >
            Start - API Request
          </Link>
        </div>
      </nav>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="px-3 py-1 text-sm text-muted-foreground">
            加载中...
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center gap-2">
            <UserInfo />
            <Button onClick={handleSignOut} variant="destructive" size="sm">
              登出
            </Button>
          </div>
        ) : (
          <Button asChild size="sm">
            <Link to="/login" search={{ redirect: undefined }}>
              登录
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

function UserInfo() {
  const { getIdTokenClaims } = useLogto();
  const [userInfo, setUserInfo] = React.useState<any>(null);

  React.useEffect(() => {
    // Only fetch user info on client side
    if (typeof window === 'undefined') return;

    const fetchUserInfo = async () => {
      try {
        const claims = await getIdTokenClaims();
        setUserInfo(claims);
      } catch (error) {
        console.warn('Failed to get user claims:', error);
      }
    };

    fetchUserInfo();
  }, [getIdTokenClaims]);

  if (!userInfo) {
    return <div className="px-2 text-sm text-muted-foreground">用户</div>;
  }

  return (
    <div className="px-2 text-sm text-muted-foreground">
      欢迎, {userInfo.name || userInfo.email || userInfo.sub}
    </div>
  );
}
