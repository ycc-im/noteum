# Research Report: Vite + React + YJS + Tauri Frontend Framework

**Date**: 2025-10-15
**Feature**: apps/client Frontend Framework
**Version**: v1.2.0 Constitution Compliant
**Research Focus**: Vite + React + YJS + Tauri + shadcn/ui Integration

## Executive Summary

基于 2025 年最佳实践的综合研究，本报告提供了实现符合新版章程要求的 Vite + React + YJS + Tauri 前端框架的技术基础。研究涵盖了现代开发模式、性能优化和实时协作应用架构考虑。

## Technology Stack Decisions

### 1. Frontend Framework: Vite + React 18 + TypeScript

**决策**: 使用 Vite 搭配 SWC 插件作为构建工具，React 18 作为 UI 框架。

**理由**:

- Vite 提供最快的热模块替换和构建时间
- SWC 提供卓越的 TypeScript 编译速度
- React 18 并发特性支持更好的实时协作用户体验
- 与 TypeScript 严格类型检查的完美集成

**关键配置**:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'react',
      devTarget: 'es2022',
      include: /\.(mdx|js|jsx|ts|tsx)$/,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          collaboration: ['yjs', 'y-websocket'],
          desktop: ['@tauri-apps/api'],
        },
      },
    },
  },
})
```

### 2. Real-time Collaboration: YJS Integration Patterns

**决策**: 使用 YJS 搭配自定义 React hooks 进行协作文档管理。

**理由**:

- YJS 提供经过验证的无冲突复制数据类型（CRDT）算法
- React hooks 模式提供与组件生命周期的清晰集成
- 支持在线和离线协作场景
- TypeScript 集成确保协作数据结构的类型安全

**Provider 架构**:

```typescript
// providers/YjsProvider.tsx
interface YjsContextValue {
  doc: Y.Doc
  provider: WebsocketProvider | HocuspocusProvider
  isConnected: boolean
  isSynced: boolean
  awareness: any
}

export function YjsProvider({
  children,
  documentId,
  websocketUrl,
  enableOfflineSupport = true,
}: YjsProviderProps) {
  // WebSocket provider + IndexedDB persistence
  // Connection state management
  // Awareness for user presence
}
```

**Custom Hooks**:

```typescript
// hooks/useYText.ts
export function useYText(name: string) {
  const { doc } = useYjs()
  const [text, setText] = useState('')

  // Sync Y.Text to React state
  // Provide mutation methods
  // Handle collaborative updates
}

// hooks/usePresence.ts
export function usePresence<T = any>() {
  // User presence management
  // Cursor position tracking
  // Real-time user list
}
```

### 3. Desktop Packaging: Tauri 2.x Configuration

**决策**: 使用 Tauri 2.x 进行桌面应用打包，配合最小的 Rust 后端。

**理由**:

- 保持相同的 React 代码库用于 web 和桌面
- 提供原生桌面功能（窗口管理、系统托盘）
- 跨平台支持（Windows、macOS、Linux）
- 强大的安全模型和基于能力的权限系统

**关键配置**:

```json
{
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:5173",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  },
  "app": {
    "windows": [
      {
        "title": "Noteum",
        "width": 1200,
        "height": 800,
        "minWidth": 800,
        "minHeight": 600
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": "all"
  }
}
```

### 4. UI Components: shadcn/ui Architecture

**决策**: 使用 shadcn/ui 组件库，考虑提取到 packages/ui。

**理由**:

- shadcn/ui 提供基于 Radix UI 的现代、可访问的 React 组件
- TypeScript 优先方法，提供适当的类型定义
- 与 Tailwind CSS 的优秀集成
- 可定制和可组合的组件模式

**当前建议**: 最初保留在 `apps/client/src/components/ui` 中，计划在以下情况下提取到 `packages/ui`：

- 多个前端应用需要相同组件
- 需要在项目间共享设计系统
- 组件库达到足够的成熟度

**组件结构**:

```
apps/client/src/components/ui/
├── button.tsx
├── input.tsx
├── dialog.tsx
├── dropdown-menu.tsx
└── index.ts
```

**未来包结构**:

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── button/
│   │   ├── input/
│   │   └── dialog/
│   ├── hooks/
│   ├── utils/
│   └── index.ts
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

**shadcn/ui 集成优势**:

- 基于 Radix UI 的无障碍组件
- 完全可定制的样式系统
- TypeScript 类型安全
- 渐进式采用策略
- 与 Tailwind CSS 的深度集成

## Testing Strategy

### 1. Unit Testing: Vitest + React Testing Library

**配置**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

**测试模式**:

- 使用 React Testing Library 进行组件测试
- 使用 @testing-library/react-hooks 进行 hook 测试
- 使用模拟 WebSocket providers 进行 YJS 协作测试
- 使用模拟 APIs 进行 Tauri IPC 测试

### 2. Integration Testing

**重点领域**:

- 多用户协作场景
- 离线/在线转换处理
- 跨平台功能（web vs desktop）
- 实时数据同步

## Performance Optimizations

### 1. Code Splitting Strategy

```typescript
// Route-based splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const CollaborativeEditor = lazy(() => import('@/pages/CollaborativeEditor'))

// Feature-based splitting
const collaborationChunk = ['yjs', 'y-websocket', '@hocuspocus/provider']
const desktopChunk = ['@tauri-apps/api']
```

### 2. YJS Performance Patterns

```typescript
// Batch updates for large documents
const { batchUpdate } = useBatchedYjs(doc, 100)

// Virtualized long documents
const { visibleLines, totalHeight } = useVirtualizedYText('content', {
  itemHeight: 24,
  containerHeight: 600,
  overscan: 10,
})
```

### 3. React Optimization

- 对协作组件使用 React.memo
- 在 hooks 中实现适当的依赖数组
- 利用 React 18 并发特性
- 使用 useCallback 和 useMemo 优化重新渲染

## Development Workflow

### 1. Environment Setup

```bash
# Development commands
npm run dev              # Web development
npm run tauri:dev        # Desktop development
npm run build            # Web build
npm run tauri:build      # Desktop build
npm run test             # Unit tests
npm run test:e2e         # End-to-end tests
```

### 2. Code Quality Tools

- **ESLint**: React + TypeScript 规则
- **Prettier**: 代码格式化（2空格，无分号，单引号）
- **Husky**: 提交前 hooks 用于 linting 和测试
- **Commitlint**: 约定式提交消息

### 3. CI/CD Pipeline

```yaml
# GitHub Actions workflow
jobs:
  test:
    - type checking
    - linting
    - unit tests
    - coverage reporting

  build:
    - web application build
    - Tauri desktop build (all platforms)
    - artifact distribution
```

## Security Considerations

### 1. Content Security Policy (CSP)

```json
{
  "csp": {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'wasm-unsafe-eval'"],
    "connect-src": ["'self'", "ipc:", "wss:", "https:"],
    "style-src": ["'self'", "'unsafe-inline'"]
  }
}
```

### 2. Tauri Capabilities

```json
{
  "permissions": {
    "fs": {
      "scope": ["$APPDATA/**", "$DOCUMENT/**"]
    },
    "dialog": {
      "allow": ["open", "save"]
    }
  }
}
```

## Integration with Existing Services

### 1. Backend Service Connection

```typescript
// services/api.ts
export class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.VITE_API_URL || 'http://localhost:8080'
  }

  async authenticate(token: string): Promise<User> {
    // Authentication with existing services
  }

  async syncDocument(documentId: string, updates: Uint8Array): Promise<void> {
    // Document synchronization
  }
}
```

### 2. YJS Provider Integration

```typescript
// Connect to existing NestJS + YJS backend
const provider = new HocuspocusProvider({
  url: process.env.VITE_HOCUSPOCUS_URL,
  name: documentId,
  document: doc,
  token: authToken,
})
```

## Recommendations

### 1. Project Structure

```
apps/client/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components (initially)
│   │   ├── collaboration/  # YJS-enabled components
│   │   └── layout/          # Layout components
│   ├── providers/           # React providers (YJS, etc.)
│   ├── hooks/               # Custom hooks
│   ├── services/            # API integration
│   ├── pages/               # Page components
│   └── utils/               # Utility functions
├── src-tauri/               # Tauri configuration
├── tests/                   # Test files
├── vite.config.ts
└── package.json

# Future packages when needed:
packages/
├── ui/                      # Shared shadcn/ui components (when multiple apps need it)
└── utils/                   # Shared utilities (if needed)
```

### 2. Implementation Phases

**Phase 1**: Basic Vite + React + TypeScript setup
**Phase 2**: YJS integration and collaboration features
**Phase 3**: Tauri desktop packaging
**Phase 4**: UI component extraction to packages/ui (when needed)

### 3. Success Metrics

- 开发环境设置时间 < 5 分钟
- 热模块替换 < 100ms
- 实时协作同步延迟 < 50ms
- 跨平台桌面构建成功率 > 95%

## Conclusion

本研究为实现现代 Vite + React + YJS + Tauri 前端框架提供了全面的基础。推荐的方法在开发速度、性能和可维护性之间取得平衡，同时遵守我们的章程原则。

分阶段实施方法允许我们在继续下一阶段之前验证每个技术集成，确保协作应用的强大和可扩展基础。

**Next Steps**: 基于这些研究结果继续 Phase 1 设计工件（data-model.md, contracts/, quickstart.md）。
