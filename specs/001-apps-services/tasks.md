---
description: 'Task list for Apps/Services 项目框架 implementation'
---

# Tasks: Apps/Services 项目框架

**Input**: Design documents from `/specs/001-apps-services/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: TDD approach required by Constitution - tests will be written first and made to fail before implementation

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3...)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md structure: `apps/services/` in monorepo

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize NestJS project structure in apps/services/
- [ ] [P] T002 Install core dependencies: NestJS, tRPC, Prisma, y-websocket, ulid
- [ ] [P] T003 Configure TypeScript with strict mode and ULID support
- [ ] [P] T004 Configure ESLint and Prettier following monorepo standards

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 [P] Setup Prisma configuration with PostgreSQL and pgvector
- [ ] T006 [P] Create base Prisma schema for User, Session models
- [ ] [P] T007 Implement NestJS JWT authentication middleware
- [ ] [P] T008 Setup tRPC configuration and routing structure
- [ ] [P] T009 Configure base WebSocket adapter for y-websocket
- [ ] T010 [P] Setup ULID generation and validation utilities
- [ ] T011 [P] Configure Redis for session and cache management
- [ ] T012 [P] Setup environment configuration with .env support
- [ ] [P] T013 Create Docker configuration for development environment
- [ ] T014 [P] Setup database migrations framework

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 项目基础结构配置 (Priority: P1) 🎯 MVP

**Goal**: 建立基础的项目结构和配置，使开发环境可用

**Independent Test**: 通过验证所有配置文件存在且语法正确来独立测试；运行基础命令确保环境工作

### Tests for User Story 1 (TDD - Write tests FIRST) ⚠️

**NOTE**: Write these tests FIRST, ensure they FAIL before implementation

- [ ] T015 [P] [US1] Unit test for project configuration validation in test/unit/config.test.ts
- [ ] [P] T016 [US1] Integration test for basic app startup in test/e2e/app.test.ts
- [ ] [P] T017 [US1] Contract test for health check endpoint in test/contract/health.test.ts

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create main.ts application entry point in apps/services/src/main.ts
- [ ] T019 [US1] [P] Create app.module.ts root module in apps/services/src/app.module.ts
- [ ] [US1] T020 Implement health check service in apps/services/src/health/health.service.ts
- [US1] T021 Create health controller in apps/services/src/health/health.controller.ts
- [US1] T022 Configure tRPC router and basic app structure in apps/services/src/trpc/trpc.module.ts
- [US1] T023 [P] Add ULID utility functions in apps/services/src/common/utils/ulid.util.ts
- [US1] T024 [P] Add environment configuration service in apps/services/src/config/config.service.ts
- [US1] T025 [P] Setup logging configuration in apps/services/src/common/logger/logger.service.ts
- [US1] T026 [US1] Create basic error handling middleware in apps/services/src/common/middleware/error.middleware.ts
- [US1] T027 [US1] Implement package.json scripts (dev, build, test, lint)
- [US1] T028 [P] Create Dockerfile for containerized deployment
- [US1] T029 [US1] Configure development Docker Compose with PostgreSQL and Redis

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 用户认证和会话管理 (Priority: P1)

**Goal**: 实现用户注册、登录、会话管理和基础认证功能

**Independent Test**: 用户可以注册账户、登录、管理会话，认证中间件正常工作

### Tests for User Story 2 (TDD - Write tests FIRST) ⚠️

- [ ] T030 [P] [US2] Unit test for user registration service in test/unit/auth/auth.service.test.ts
- [ ] T031 [P] [US2] Unit test for JWT token generation and validation in test/unit/auth/jwt.service.test.ts
- [ ] [P] [US2] Unit test for password hashing/verification in test/unit/auth/password.service.test.ts
- [ ] [P] [US2] Integration test for complete authentication flow in test/e2e/auth.test.ts

### Implementation for User Story 2

- [ ] T032 [P] [US2] Create User entity in apps/services/src/modules/users/entities/user.entity.ts
- [ ] [US3] T033 [US2] Create UserProfile entity in apps/services/src/modules/users/entities/user-profile.entity.ts
- [US3] T034 [US2] Create Session entity in apps/services/src/modules/auth/entities/session.entity.ts
- [US3] T035 [P] [US2] Implement UserService in apps/services/src/modules/users/users.service.ts
- [US3] T036 [US2] Implement AuthService in apps/services/src/modules/auth/auth.service.ts
- [US3] T037 [P] [US2] Create JWT service for token management in apps/services/src/modules/auth/jwt.service.ts
- [US3] T038 [P] [US2] Create Password service for hashing/verification in apps/services/src/modules/auth/password.service.ts
- [US3] T039 [US3] Implement auth controller with register/login endpoints in apps/services/src/modules/auth/auth.controller.ts
- [US3] T040 [US2] Create auth middleware for JWT validation in apps/services/src/common/middleware/auth.middleware.ts
- [US3] T041 [P] [US2] Implement user management controller in apps/services/src/modules/users/users.controller.ts
- [US3] T042 [US3] Add tRPC auth router in apps/services/src/modules/auth/auth.router.ts
- [US3] T043 [US3] Add tRPC users router in apps/services/src/modules/users/users.router.ts

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - 笔记本基础管理 (Priority: P1)

**Goal**: 实现笔记本的创建、查询、权限管理基础功能

**Independent Test**: 用户可以创建笔记本、设置可见性、管理笔记本列表

### Tests for User Story 3 (TDD - Write tests FIRST) ⚠️

- [ ] T044 [P] [US3] Unit test for notebook creation service in test/unit/notebooks/notebooks.service.test.ts
- [ ] [P] [US3] Unit test for permission validation in test/unit/notebooks/permission.service.test.ts
- [ ] [P] [US3] Integration test for notebook CRUD operations in test/e2e/notebooks.test.ts

### Implementation for User Story 3

- [ ] T045 [P] [US3] Update Prisma schema with Notebook entities
- [US3] T046 [P] [US3] Create Notebook entity in apps/services/src/modules/notebooks/entities/notebook.entity.ts
- [US3] T047 [P] [US3] Create NotebookCollaborator entity in apps/services/src/modules/notebooks/entities/notebook-collaborator.entity.ts
- [US3] T048 [P] [US3] Create NotebookTag entity in apps/services/src/modules/notebooks/entities/notebook-tag.entity.ts
- [US3] T049 [P] [US3] Implement NotebookService in apps/services/src/modules/notebooks/notebooks.service.ts
- [US3] T050 [P] [US3] Create permission validation service in apps/services/src/modules/notebooks/permission.service.ts
- [US3] T051 [3] Implement notebooks controller in apps/services/src/modules/notebooks/notebooks.controller.ts
- [US3] T052 [3] Create notebook tRPC router in apps/services/src/modules/notebooks/notebooks.router.ts
- [US3] T053 [P] [US3] Add notebook management Zod schemas in apps/services/src/modules/notebooks/dto/notebook.dto.ts

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - 笔记基础管理 (Priority: P1)

**Goal**: 实现笔记的创建、查询、权限继承功能

**Independent Test**: 用户可以在笔记本中创建笔记、管理笔记内容、权限继承正常工作

### Tests for User Story 4 (TDD - Write tests FIRST) ⚠️

- [ ] T054 [P] [US4] Unit test for note creation and permission inheritance in test/unit/notes/notes.service.test.ts
- [ ] [P] [US4] Unit test for note type handling in test/unit/notes/note-types.service.test.ts
- [ ] [P] [US4] Integration test for notebook-to-note relationship in test/e2e/notebook-notes.test.ts

### Implementation for User Story 4

- [ ] T055 [P] [US4] Update Prisma schema with Note entities and relationships
- [US4] T056 [P] [US4] Create Note entity in apps/services/src/modules/notes/entities/note.entity.ts
- [US4] T057 [P] [US4] Create NoteCollaborator entity in apps/services/src/modules/notes/entities/note-collaborator.entity.ts
- [US4] T058 [P] [US4] Create YJS related entities (NoteSnapshot, NoteUpdate) in apps/services/src/modules/notes/entities/
- [US4] T059 [P] [US4] Create NoteEmbedding entity for AI readiness in apps/services/src/modules/notes/entities/note-embedding.entity.ts
- [US4] T060 [P] [US4] Implement NoteService in apps/services/src/modules/notes/notes.service.ts
- [4] T061 [4] Implement permission inheritance logic in NoteService
- [US4] T062 [P] [US4] Create notes controller in apps/services/src/modules/notes/notes.controller.ts
- [US4] T063 [4] Create note tRPC router in apps/services/src/modules/notes/notes.router.ts
- [US4] T064 [P] [4] Add note management Zod schemas in apps/services/src/modules/notes/dto/note.dto.ts
- [US4] T065 [4] Implement note type constants and utilities

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: User Story 5 - WebSocket 协作基础 (Priority: P2)

**Goal**: 实现基础的 WebSocket 连接和 y-websocket 集成

**Independent Test**: WebSocket 连接可以建立，基本的文档同步功能工作

### Tests for User Story 5 (TDD - Write tests FIRST) ⚠️

- [ ] T066 [P] [US5] Unit test for WebSocket connection management in test/unit/websocket/websocket-gateway.test.ts
- [ ] [P] [US5] Unit test for y-websocket provider in test/unit/websocket/yjs-provider.service.test.ts
- [ ] [P] [US5] Integration test for real-time document updates in test/e2e/websocket.test.ts

### Implementation for User Story 5

- [ ] T067 [P] [US5] Create WebSocket gateway in apps/services/src/websocket/yjs.gateway.ts
- [US5] T068 [P] [5] Create y-websocket provider service in apps/services/src/websocket/yjs-provider.service.ts
- [5] T069 [5] Create document persistence service in apps/services/src/websocket/document-persistence.service.ts
- [5] T070 [5] Create user awareness service in apps/services/src/websocket/awareness.service.ts
- [5] T071 [P] [5] Add WebSocket adapter configuration in apps/services/src/main.ts
- [5] T072 [5] Create WebSocket module in apps/services/src/websocket/websocket.module.ts

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently

---

## Phase 8: User Story 6 - AI 功能准备 (Priority: P3)

**Goal**: 为未来的 AI 功能集成做好准备

**Independent Test**: Langchain.js 集成正常，向量存储功能可用

### Tests for User Story 6 (TDD - Write tests FIRST) ⚠️

- [ ] T073 [P] [US6] Unit test for vector storage in test/unit/ai/vector-storage.service.test.ts
- [ ] [P] [US6] Unit test for embedding generation (if applicable) in test/unit/ai/embedding.service.test.ts
- [ ] [P] [US6] Integration test for vector search functionality in test/e2e/ai.test.ts

### Implementation for User Story 6

- [US6] T074 [P] [US6] Add langchain.js dependency to package.json
- [US6] T075 [P] [6] Create vector storage service in apps/services/src/ai/vector-storage.service.ts
- [US6] T076 [6] Create embedding service interface for future use in apps/services/src/ai/embedding.service.ts
- [US6] T077 [6] Add AI module structure in apps/services/src/ai/
- [US6] T078 [6] Configure vector database extensions (pgvector)

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T079 [P] Update project documentation in README.md
- [ ] [P] T080 [P] Update quickstart.md with current API examples
- [P] T081 [P] Code cleanup and refactoring across all modules
- [P] T082 [P] Performance optimization for database queries
- [P] T083 [P] Security hardening and validation
- [P] T084 [P] Additional error handling improvements
- [P] T085 [P] Run comprehensive test suite validation
- [P] T086 [P] Validate quickstart.md examples work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with Story 1 (auth middleware)
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Depends on Story 2 (user management)
- **User Story 4 (P1)**: Can start after Foundational (Phase 2) - Depends on Stories 1, 2, 3
- **User Story 5 (P2)**: Can start after Story 4 (Note entities exist) - Integrates with Story 4
- **User Story 6 (P3)**: Can start after Story 4 (for vector integration) - Integrates with Story 4

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Models before services
- Services before controllers/routers
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, higher priority stories can start while lower stories wait
- All tests for a user story marked [P] can run in parallel
- Different entities within a story marked [P] can run in parallel
- Different stories can be worked on sequentially as dependencies allow

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD approach):
Task: "Unit test for project configuration validation in test/unit/config.test.ts"
Task: "Integration test for basic app startup in test/e2e/app.test.ts"
Task: "Contract test for health check endpoint in test/contract/health.test.ts"

# Launch configuration tasks together:
Task: "Configure TypeScript with strict mode and ULID support"
Task: "Configure ESLint and Prettier following monorepo standards"
Task: "Configure base WebSocket adapter for y-websocket"
```

---

## Implementation Strategy

### MVP First (User Stories 1-2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Project Structure)
4. Complete Phase 4: User Story 2 (Authentication)
5. **STOP AND VALIDATE**: Test stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add Story 1 → Test independently → Deploy/Demo (Infrastructure!)
3. Add Story 2 → Test independently → Deploy/Demo (Auth!)
4. Add Story 3 → Test independently → Deploy/Demo (Notebooks!)
5. Add Story 4 → Test independently → Deploy/Demo (Notes!)
6. Add Story 5 → Test independently → Deploy/Demo (Collaboration!)
7. Add Story 6 → Test independently → Deploy/Demo (AI Ready!)

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: Stories 1 & 2 (Infrastructure & Auth - sequential)
   - Developer B: Story 3 (Notebooks) - starts after Story 2
   - Developer C: Story 4 (Notes) - starts after Story 3
3. Developer A can start Story 5 (WebSocket) once Story 4 is complete
4. Developer B can start Story 6 (AI) once Story 4 is complete
5. Stories complete and integrate sequentially as dependencies allow

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **CRITICAL**: Write tests first, ensure they fail, then implement to make them pass (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- ULID is used for all primary keys instead of UUID
- All database changes require Prisma migrations
