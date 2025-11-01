<!-- OPENSPEC:START -->

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:

- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:

- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Noteum Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-15

## Constitution Compliance

This project follows strict development principles as defined in `.specify/memory/constitution.md`:

- **Test-Driven Development**: Tests MUST be written before implementation
- **Code Style**: Prettier with 2-space indentation, no semicolons, single quotes
- **TypeScript-First**: Strict type checking, no implicit any types
- **Monorepo Structure**: apps/ for applications, packages/ for shared libraries

## Active Technologies

- TypeScript 5.0+ (NestJS 10.x LTS) + NestJS, tRPC, Prisma, y-websocket, langchain.js (001-apps-services)
- TypeScript 5.0+, Node.js 18+ + Vite 4.5+, React 18.2+, NestJS 10.x, Prisma 5.0+, Redis 4.6+, PostgreSQL 15+ (003-3000-1-9158)
- PostgreSQL, Redis (003-3000-1-9158)

## Project Structure

```
noteum/
├── apps/           # Executable applications
├── packages/       # Shared libraries
├── .specify/       # Project specifications and plans
└── docs/          # Documentation
```

## Commands

### Development Commands

- `pnpm dev:workspace` - 启动所有开发服务（Services + Client）
- `pnpm dev:services` - 仅启动后端服务
- `pnpm dev:client` - 仅启动前端应用
- `pnpm dev:health` - 检查开发环境健康状态
- `pnpm dev:stop` - 停止所有开发服务
- `pnpm dev:restart` - 重启所有开发服务
- `pnpm dev:restart-services` - 仅重启后端服务
- `pnpm dev:restart-client` - 仅重启前端应用

### Infrastructure Commands

- `pnpm docker:start` - 启动Docker开发环境
- `pnpm docker:stop` - 停止Docker开发环境
- `pnpm docker:status` - 查看Docker服务状态
- `pnpm docker:logs` - 查看Docker日志

### Quality Commands

- `npm test` - 运行测试
- `pnpm lint` - 运行代码检查
- `pnpm type-check` - 类型检查
- `pnpm ports:check` - 检查端口占用
- `pnpm ports:validate` - 验证端口配置

## Code Style

**TypeScript/JavaScript**:

- 2-space indentation
- No semicolons
- Single quotes
- Trailing commas (ES5 compatible)
- ESLint strict mode
- TypeScript strict mode

## Testing Requirements

- Tests MUST be written before implementation (TDD)
- Unit tests for all new code
- Integration tests for cross-package interactions
- 100% test coverage for new code
- All tests must pass before merging

## Recent Changes

- 003-3000-1-9158: Added TypeScript 5.0+, Node.js 18+ + Vite 4.5+, React 18.2+, NestJS 10.x, Prisma 5.0+, Redis 4.6+, PostgreSQL 15+
- 001-apps-services: Added TypeScript 5.0+ (NestJS 10.x LTS) + NestJS, tRPC, Prisma, y-websocket, langchain.js

<!-- MANUAL ADDITIONS START -->

## 开发服务器管理约束

为了防止端口无限增长和资源浪费，严格遵守以下开发服务器管理规则：

### 端口检查和重启流程
1. **启动前检查**：在启动任何开发服务器前，必须先检查端口是否已被占用
   - 前端端口检查：`lsof -ti:9158` 或 `netstat -an | grep 9158`
   - 后端端口检查：`lsof -ti:3000` 或 `netstat -an | grep 3000`

2. **发现端口占用时的处理**：
   - 如果发现端口已被占用，先停止现有服务：`kill -9 $(lsof -ti:9158)`
   - 使用项目的重启命令而不是新建服务实例：
     - `pnpm dev:restart` - 重启所有服务
     - `pnpm dev:restart-services` - 仅重启后端服务
     - `pnpm dev:restart-client` - 仅重启前端应用

3. **禁止行为**：
   - 禁止在已知端口被占用时仍然启动新的服务实例
   - 禁止使用不同端口启动同一服务的多个实例
   - 禁止绕过端口检查直接启动服务

### 推荐的启动命令

**分别启动方式（强烈推荐）**：
- 启动后端服务：`cd apps/services && pnpm start:dev`
- 启动前端应用：`FRONTEND_PORT=9158 pnpm --filter @noteum/client dev`
- 完整启动流程：先启动 services，再启动 client

**为什么推荐分别启动**：
- 更好的可控性：可以独立控制和调试每个服务
- 更清晰的错误定位：问题更容易定位到具体服务
- 更灵活的重启：可以单独重启有问题的服务
- 避免复杂的脚本依赖：减少意外麻烦

**容器化启动方式（仅在有经验时使用）**：
- 首次启动：`pnpm dev:workspace` （仅在没有问题时使用）
- 重启所有服务：`pnpm dev:restart`
- 仅重启前端：`pnpm dev:restart-client`
- 仅重启后端：`pnpm dev:restart-services`

### 服务验证
启动后使用以下命令验证服务状态：
- `pnpm dev:health` - 检查开发环境健康状态
- `pnpm ports:check` - 检查端口占用情况

<!-- MANUAL ADDITIONS END -->
