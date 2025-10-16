# Implementation Plan: 端口规范化和开发环境升级

**Branch**: `003-3000-1-9158` | **Date**: 2025-10-15 | **Spec**: [端口规范化和开发环境升级](spec.md)
**Input**: Feature specification from `/specs/003-3000-1-9158/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

端口规范化和开发环境升级功能将重新配置所有服务使用新的端口规划（前端9158、后端9168、缓存9178、数据库9198、管理界面9188），并将前端开发环境集成到统一的开发容器中，实现一键启动和端口冲突解决。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0+, Node.js 18+
**Primary Dependencies**: Vite 4.5+, React 18.2+, NestJS 10.x, Prisma 5.0+, Redis 4.6+, PostgreSQL 15+
**Storage**: PostgreSQL, Redis
**Testing**: Vitest, Jest, React Testing Library
**Target Platform**: Cross-platform development containers (Docker)
**Project Type**: Web application with monorepo structure
**Performance Goals**: 开发环境启动时间 < 2分钟，热重载响应时间 < 1秒
**Constraints**: 端口9158-9198专用，支持容器化部署，环境隔离
**Scale/Scope**: 支持多项目并行开发，团队协作

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gates Analysis

**✅ Test-Driven Development (Principle I)**:
- 所有配置更改必须先写测试验证端口配置正确性
- 需要为开发环境启动流程编写集成测试
- 必须测试端口冲突检测功能

**✅ Code Style Standards (Principle II)**:
- 所有配置文件必须遵循项目的ESLint和Prettier规则
- TypeScript严格类型检查必须通过
- 无新代码实现，主要是配置更改，风险较低

**✅ Monorepo Principles (Principle III)**:
- 保持现有monorepo结构不变
- 端口配置在各应用中独立配置
- 无新增包，无循环依赖风险

**✅ Independent User Stories (Principle IV)**:
- 三个用户故事（端口冲突、统一环境、环境隔离）可独立实现
- P1优先级故事可独立交付价值

**✅ TypeScript-First Development (Principle V)**:
- 所有配置文件使用TypeScript类型定义
- 环境配置必须有严格类型检查

**✅ Frontend Framework Standards (Principle VI)**:
- 前端继续使用Vite + React + YJS技术栈
- 端口更改不影响框架选择
- 热重载功能必须在Vite中配置

**✅ Tauri Desktop Application Support (Principle VII)**:
- 桌面应用打包不受端口配置影响
- Tauri应用可继续使用相同的后端API

### Status: ✅ PASSED (Pre & Post Phase 1 Design)

所有宪法原则检查通过，设计阶段无违规项。

**Phase 1 Design Review**:
- ✅ 数据模型使用TypeScript严格类型定义
- ✅ API合同遵循RESTful最佳实践
- ✅ 快速启动指南符合用户体验要求
- ✅ 无新增包依赖，保持monorepo结构
- ✅ 配置更改不涉及核心业务逻辑重构

可以进行下一阶段实施规划。

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
noteum/
├── apps/
│   ├── client/                    # Vite + React + YJS frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── vite.config.ts         # Port 9158 configuration
│   │   └── tests/
│   └── services/                  # NestJS + tRPC backend
│       ├── src/
│       │   ├── modules/
│       │   ├── services/
│       │   └── main.ts
│       ├── tests/
│       └── nest-cli.json          # Port 9168 configuration
├── packages/
│   ├── ui/                        # Shared UI components
│   └── utils/                     # Shared utilities
├── docker-compose.dev.yml         # Development environment with all services
├── docker-compose.prod.yml        # Production configuration
└── scripts/
    └── dev-setup.sh               # One-command development environment startup
```

**Structure Decision**: Web application with monorepo structure. Frontend (Vite + React) in `apps/client`, backend (NestJS + tRPC) in `apps/services`, shared packages in `packages/`. Docker Compose for development environment orchestration.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
