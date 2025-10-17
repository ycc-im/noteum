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

### Apps Directory Commands
- `cd apps && pnpm dev:all` - 从apps目录启动所有服务
- `cd apps && pnpm dev:services` - 从apps目录启动后端
- `cd apps && pnpm dev:client` - 从apps目录启动前端

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
<!-- MANUAL ADDITIONS END -->
