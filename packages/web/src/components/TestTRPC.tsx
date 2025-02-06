import { trpc } from '../utils/trpc';

export function TestTRPC() {
  const hello = trpc.example.hello.useQuery(
    { name: '前端' },
    {
      retry: false,
    }
  );

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      {hello.isLoading && (
        <p style={{ color: 'blue' }}>加载中...</p>
      )}
      
      {hello.data && (
        <p style={{ color: 'green' }}>
          服务器返回: {hello.data.message}
        </p>
      )}
      
      {hello.error && (
        <p style={{ color: 'red' }}>
          错误: {hello.error.message}
        </p>
      )}
    </div>
  );
}
