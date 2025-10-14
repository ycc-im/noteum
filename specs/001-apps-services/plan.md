# Implementation Plan: Apps/Services 项目框架

**Branch**: `001-apps-services` | **Date**: 2025-10-15 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-apps-services/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

基于 NestJS LTS 版本构建 apps/services 基础框架，集成 y-websocket 协作支持、Prisma ORM、PostgreSQL 向量数据库、tRPC API 和 WebSocket 服务，为未来 AI 功能集成做好准备。重点关注基础框架搭建，数据库表设计将作为独立任务处理。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0+ (NestJS 10.x LTS)
**Primary Dependencies**: NestJS, tRPC, Prisma, y-websocket, langchain.js
**Storage**: PostgreSQL with vector extensions (pgvector)
**Testing**: Jest (NestJS Testing), Supertest
**Target Platform**: Linux server (Docker containerized)
**Project Type**: web (API + WebSocket service)
**Performance Goals**: <100ms API response, WebSocket real-time sync
**Constraints**: Docker deployment, binary + structured data compatibility
**Scale/Scope**: Team collaboration service, multi-client real-time sync

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### GATE 1: Test-Driven Development (NON-NEGOTIABLE)
✅ **PASS**: Plan includes Jest testing framework with unit and integration tests. Will follow TDD principles during implementation.

### GATE 2: Code Style Standards
✅ **PASS**: TypeScript with Prettier/ESLint configuration inherited from root monorepo.

### GATE 3: Monorepo Principles
✅ **PASS**: Implementation fits within existing monorepo structure (apps/services), respects workspace boundaries.

### GATE 4: Independent User Stories
✅ **PASS**: Feature can be broken into independently testable user stories (P1:基础框架, P2:WebSocket协作, P3:AI集成准备).

### GATE 5: TypeScript-First Development
✅ **PASS**: Full TypeScript implementation with strict typing, using Prisma for type-safe database access.

## Project Structure

### Documentation (this feature)

```
specs/001-apps-services/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
apps/services/
├── src/
│   ├── main.ts          # NestJS application entry point
│   ├── app.module.ts    # Root module
│   ├── config/          # Configuration management
│   ├── database/        # Database configuration
│   ├── modules/
│   │   ├── trpc/        # tRPC integration
│   │   ├── websocket/   # WebSocket and y-websocket
│   │   ├── ai/          # Langchain integration (future)
│   │   └── core/        # Core functionality
│   ├── common/          # Shared utilities
│   └── types/           # TypeScript definitions
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── prisma/
│   ├── schema.prisma    # Prisma schema
│   └── migrations/      # Database migrations
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── package.json

# Database storage compatibility
binary-storage/          # yjs binary data (if needed)
structured-storage/     # Prisma/PostgreSQL structured data
```

**Structure Decision**: Monorepo web application with integrated API + WebSocket service. NestJS framework provides the foundation for modular development with separate modules for tRPC, WebSocket/y-websocket, and future AI capabilities. Database design accommodates both binary yjs data and structured relational data through PostgreSQL.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
