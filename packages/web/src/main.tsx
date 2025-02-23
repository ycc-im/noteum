import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { trpc } from './utils/TRPC/TRPC';
import App from './App';

console.log('初始化前端应用...');

console.log('创建 QueryClient...');
function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: import.meta.env.VITE_TRPC_BACKEND_URL,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('找不到 root 元素!');
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TRPCProvider>
        <App />
      </TRPCProvider>
    </React.StrictMode>
  );
}
