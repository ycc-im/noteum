# Quick Start Guide: Client Frontend Framework

**Date**: 2025-10-15
**Feature**: apps/client Frontend Framework
**Target Audience**: Developers

## Overview

本指南将帮助您快速搭建基于 Vite + React + YJS + Tauri 的前端应用框架。按照以下步骤，您将在 5 分钟内拥有一个完整的开发环境。

## Prerequisites

### System Requirements

- **Node.js**: 18.x 或更高版本
- **pnpm**: 8.x 或更高版本
- **Git**: 最新版本
- **Rust**: 1.70+ (仅桌面应用开发需要)

### Optional Tools

- **VS Code**: 推荐的开发环境
- **Chrome DevTools**: 用于调试
- **Postman**: 用于 API 测试

## Quick Setup

### 1. Create Project Structure

```bash
# 在 monorepo 根目录下执行
mkdir -p apps/client
cd apps/client
```

### 2. Initialize Vite + React Project

```bash
# 使用 pnpm 创建 Vite + React + TypeScript 项目
pnpm create vite . --template react-ts

# 安装依赖
pnpm install
```

### 3. Configure Project

#### Update package.json

```json
{
  "name": "@noteum/client",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "tauri:build-debug": "tauri build --debug"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-router": "^1.0.0",
    "zustand": "^4.4.0",
    "yjs": "^13.6.0",
    "y-websocket": "^1.5.0",
    "@hocuspocus/provider": "^2.0.0",
    "clsx": "^2.0.0",
    "class-variance-authority": "^0.7.0",
    "lucide-react": "^0.292.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.0",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "typescript": "^5.2.2",
    "vite": "^4.5.0",
    "vitest": "^0.34.6",
    "@vitest/ui": "^0.34.6",
    "@vitest/coverage-v8": "^0.34.6",
    "jsdom": "^22.1.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "tailwindcss": "^3.3.5",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.31",
    "@tauri-apps/cli": "^1.5.0",
    "@tauri-apps/api": "^1.5.0"
  }
}
```

#### Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      overlay: true,
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom', '@tanstack/react-router'],
          collaboration: ['yjs', 'y-websocket', '@hocuspocus/provider'],
          desktop: ['@tauri-apps/api'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
```

#### Configure TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "~/*": ["./*"]
    },
    "types": ["vite/client", "vitest/importMeta"]
  },
  "include": ["src", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Setup Tailwind CSS

```bash
# 安装 Tailwind CSS
pnpm add -D tailwindcss autoprefixer postcss
pnpm dlx tailwindcss init -p
```

#### Configure Tailwind

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}
```

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 5. Setup shadcn/ui

```bash
# 安装 shadcn/ui CLI
pnpm add -D @shadcn/ui

# 初始化 shadcn/ui
pnpm dlx shadcn-ui@latest init
```

#### Configure shadcn/ui

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/utils"
  }
}
```

```bash
# 添加基础组件
pnpm dlx shadcn-ui@latest add button
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add dialog
pnpm dlx shadcn-ui@latest add dropdown-menu
pnpm dlx shadcn-ui@latest add toast
```

### 6. Setup Tauri (Optional)

```bash
# 初始化 Tauri
pnpm dlx @tauri-apps/cli init

# 或者手动创建 Tauri 配置
mkdir src-tauri
cd src-tauri
cargo init --name client
```

#### Configure Tauri

```json
// src-tauri/tauri.conf.json
{
  "build": {
    "beforeDevCommand": "pnpm dev",
    "beforeBuildCommand": "pnpm build",
    "devPath": "http://localhost:3000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "Noteum",
    "version": "0.1.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      }
    },
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "com.noteum.app"
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "Noteum",
        "width": 1200,
        "height": 800
      }
    ]
  }
}
```

```rust
// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
```

```toml
# src-tauri/Cargo.toml
[package]
name = "client"
version = "0.1.0"
description = "Noteum Client"
authors = ["you"]
license = ""
repository = ""
edition = "2021"

[build-dependencies]
tauri-build = { version = "1.4", features = [] }

[dependencies]
tauri = { version = "1.4", features = ["shell-open"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[features]
default = ["custom-protocol"]
```

## Basic Implementation

### 1. Create Basic App Structure

```typescript
// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routes } from './routes'
import './styles/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
    },
  },
})

const router = createRouter({ routes })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
```

```typescript
// src/routes/index.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Layout } from '@/components/layout'

export const rootRoute = createRootRoute({
  component: Layout,
})

export const routes = [
  rootRoute,
  // Add more routes here
]
```

```typescript
// src/components/layout.tsx
import { Outlet } from '@tanstack/react-router'
import { Header } from './header'
import { Sidebar } from './sidebar'

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

### 2. Create YJS Provider

```typescript
// src/providers/yjs-provider.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'

interface YjsContextValue {
  doc: Y.Doc | null
  provider: WebsocketProvider | null
  isConnected: boolean
  isSynced: boolean
}

const YjsContext = createContext<YjsContextValue | null>(null)

interface YjsProviderProps {
  children: React.ReactNode
  documentId: string
  websocketUrl?: string
}

export function YjsProvider({ children, documentId, websocketUrl = 'ws://localhost:1234' }: YjsProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isSynced, setIsSynced] = useState(false)

  const docRef = useRef<Y.Doc>()
  const providerRef = useRef<WebsocketProvider>()

  useEffect(() => {
    const doc = new Y.Doc()
    docRef.current = doc

    const provider = new WebsocketProvider(websocketUrl, documentId, doc, {
      connect: true,
    })

    providerRef.current = provider

    provider.on('status', (event: any) => {
      setIsConnected(event.status === 'connected')
    })

    provider.on('sync', (synced: boolean) => {
      setIsSynced(synced)
    })

    return () => {
      provider.destroy()
      doc.destroy()
    }
  }, [documentId, websocketUrl])

  const value: YjsContextValue = {
    doc: docRef.current || null,
    provider: providerRef.current || null,
    isConnected,
    isSynced,
  }

  return (
    <YjsContext.Provider value={value}>
      {children}
    </YjsContext.Provider>
  )
}

export function useYjs() {
  const context = useContext(YjsContext)
  if (!context) {
    throw new Error('useYjs must be used within a YjsProvider')
  }
  return context
}
```

### 3. Create Collaborative Editor

```typescript
// src/components/collaboration/collaborative-editor.tsx
import React, { useEffect, useRef } from 'react'
import { useYjs } from '@/providers/yjs-provider'
import { Button } from '@/components/ui/button'

interface CollaborativeEditorProps {
  documentId: string
}

export function CollaborativeEditor({ documentId }: CollaborativeEditorProps) {
  const { doc, isConnected, isSynced } = useYjs()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!doc || !textareaRef.current) return

    const yText = doc.getText('content')

    // Sync YJS text to textarea
    const updateTextarea = () => {
      if (textareaRef.current) {
        textareaRef.current.value = yText.toString()
      }
    }

    updateTextarea()
    yText.observe(updateTextarea)

    // Handle textarea changes
    const handleTextareaChange = () => {
      if (textareaRef.current) {
        const textarea = textareaRef.current
        const cursorPos = textarea.selectionStart
        yText.delete(0, yText.length)
        yText.insert(0, textarea.value)

        // Restore cursor position
        requestAnimationFrame(() => {
          textarea.setSelectionRange(cursorPos, cursorPos)
        })
      }
    }

    const textarea = textareaRef.current
    textarea.addEventListener('input', handleTextareaChange)

    return () => {
      textarea.removeEventListener('input', handleTextareaChange)
      yText.unobserve(updateTextarea)
    }
  }, [doc])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Collaborative Editor</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <div className={`w-2 h-2 rounded-full ${isSynced ? 'bg-blue-500' : 'bg-yellow-500'}`} />
          <span className="text-sm text-muted-foreground">
            {isSynced ? 'Synced' : 'Syncing...'}
          </span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="w-full h-96 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Start typing here..."
        defaultValue=""
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Document ID: {documentId}
        </p>
        <Button variant="outline" size="sm">
          Save Document
        </Button>
      </div>
    </div>
  )
}
```

## Development Workflow

### 1. Start Development Server

```bash
# Web development
pnpm dev

# Desktop development (if Tauri is set up)
pnpm tauri:dev
```

### 2. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### 3. Build for Production

```bash
# Build web application
pnpm build

# Build desktop application
pnpm tauri:build

# Build debug version
pnpm tauri:build-debug
```

### 4. Code Quality

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Project Structure After Setup

```
apps/client/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── collaboration/  # YJS components
│   │   │   └── collaborative-editor.tsx
│   │   └── layout/         # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── main-content.tsx
│   ├── providers/          # React providers
│   │   └── yjs-provider.tsx
│   ├── routes/             # TanStack Router routes
│   │   └── index.tsx
│   ├── styles/             # Global styles
│   │   └── globals.css
│   ├── main.tsx
│   └── App.tsx
├── src-tauri/              # Tauri configuration (optional)
├── tests/                  # Test files
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.js
├── components.json
├── tsconfig.json
├── package.json
└── README.md
```

## Next Steps

1. **Add Authentication**: Implement user authentication with JWT tokens
2. **Setup API Integration**: Connect to backend services
3. **Implement Routing**: Add more routes with TanStack Router
4. **Add State Management**: Integrate Zustand stores
5. **Implement Collaboration**: Add real-time collaboration features
6. **Add Testing**: Write comprehensive tests
7. **Setup CI/CD**: Configure automated builds and deployments

## Troubleshooting

### Common Issues

1. **Port Already in Use**: Change the port in `vite.config.ts`
2. **Import Errors**: Check `tsconfig.json` path mappings
3. **Tailwind Styles Not Working**: Verify `tailwind.config.js` content configuration
4. **Tauri Build Fails**: Ensure Rust is installed and properly configured
5. **YJS Connection Issues**: Check WebSocket server URL and network connectivity

### Getting Help

- Check the [official documentation](https://vitejs.dev/)
- Review the [React documentation](https://react.dev/)
- Consult the [YJS documentation](https://docs.yjs.dev/)
- Visit the [Tauri documentation](https://tauri.app/)
- Check the [shadcn/ui documentation](https://ui.shadcn.com/)

## Conclusion

您现在拥有一个完整的 Vite + React + YJS + Tauri 开发环境！这个框架提供了：

- ⚡ 快速的开发体验 (Vite)
- 🔋 现代化的 UI 组件 (shadcn/ui)
- 🤝 实时协作功能 (YJS)
- 🖥️ 桌面应用支持 (Tauri)
- 🛣️ 类型安全的路由 (TanStack Router)
- 🧪 完整的测试支持 (Vitest)
- 🎨 优雅的样式系统 (Tailwind CSS)

开始构建您的协作应用吧！
