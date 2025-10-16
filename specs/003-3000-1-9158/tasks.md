---
description: "Task list for 端口规范化和开发环境升级 feature implementation"
---

# Tasks: 端口规范化和开发环境升级

**Input**: Design documents from `/specs/003-3000-1-9158/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: This feature involves configuration changes and infrastructure setup. Tests will focus on port validation and environment startup verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions
- **Frontend**: `apps/client/`
- **Backend**: `apps/services/`
- **Docker**: Repository root
- **Scripts**: `scripts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and port configuration preparation

- [X] T001 Create port configuration utility types in packages/utils/src/port-config.ts
- [X] T002 [P] Create environment variable templates in .env.example and .env.local.example
- [X] T003 [P] Create Docker configuration templates in docker-compose.dev.yml.new and docker-compose.prod.yml.new

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core port configuration infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create port conflict detection utility in scripts/check-ports.ts
- [X] T005 [P] Create port configuration validation in packages/utils/src/port-validator.ts
- [X] T006 [P] Create environment variable validation schema in apps/services/src/config/validation.schema.ts
- [X] T007 Create base port configuration interface in packages/utils/src/interfaces/port-config.interface.ts
- [X] T008 Setup logging infrastructure for port management in packages/utils/src/logger.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 端口冲突解决 (Priority: P1) 🎯 MVP

**Goal**: 开发者可以在不同的项目间同时工作，而不会遇到端口冲突问题

**Independent Test**: 可以通过同时启动多个项目验证端口不冲突，每个服务都能正常访问

### Implementation for User Story 1

- [ ] T009 [US1] Update frontend Vite configuration to use port 9158 in apps/client/vite.config.ts
- [ ] T010 [US1] Update backend NestJS configuration to use port 9168 in apps/services/src/main.ts
- [ ] T011 [US1] Create frontend port configuration in apps/client/src/config/ports.ts
- [ ] T012 [US1] Create backend port configuration in apps/services/src/config/ports.ts
- [ ] T013 [US1] Update environment variables for frontend port in apps/client/.env
- [ ] T014 [US1] Update environment variables for backend port in apps/services/.env
- [ ] T015 [US1] [P] Create port availability tests in apps/client/tests/port-availability.test.ts
- [ ] T016 [US1] [P] Create port availability tests in apps/services/tests/port-availability.test.ts
- [ ] T017 [US1] Add port validation scripts to package.json dev scripts
- [ ] T018 [US1] Create port conflict resolution documentation in docs/port-resolution.md

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - 统一开发环境 (Priority: P1)

**Goal**: 开发者可以通过一键启动命令启动完整的开发环境，包括前端、后端和所有依赖服务

**Independent Test**: 可以通过一键启动命令启动所有服务，验证每个服务都按预期端口运行

### Implementation for User Story 2

- [ ] T019 [US2] Update docker-compose.dev.yml with new port mappings (9158, 9168, 9178, 9188, 9198)
- [ ] T020 [US2] Create frontend Dockerfile with port 9158 exposure in apps/client/Dockerfile
- [ ] T021 [US2] Create backend Dockerfile with port 9168 exposure in apps/services/Dockerfile
- [ ] T022 [US2] [P] Configure Redis service with port 9178 in docker-compose.dev.yml
- [ ] T023 [US2] [P] Configure PostgreSQL service with port 9198 in docker-compose.dev.yml
- [ ] T024 [US2] Configure PgAdmin service with port 9188 in docker-compose.dev.yml
- [ ] T025 [US2] Create development environment startup script in scripts/dev-setup.sh
- [ ] T026 [US2] Create development environment health check script in scripts/health-check.sh
- [ ] T027 [US2] Create service status monitoring in scripts/service-status.sh
- [ ] T028 [US2] [P] Create Docker Compose startup tests in tests/docker/startup.test.ts
- [ ] T029 [US2] Add dev-setup script to root package.json
- [ ] T030 [US2] Create service dependency management in docker-compose.dev.yml

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - 开发环境隔离 (Priority: P2)

**Goal**: 开发者可以在隔离的环境中进行开发，确保本地环境干净且不受项目依赖影响

**Independent Test**: 可以通过开发环境内外对比验证隔离效果，以及通过不同项目的并行开发验证环境隔离

### Implementation for User Story 3

- [ ] T031 [US3] Create Docker network configuration for service isolation in docker-compose.dev.yml
- [ ] T032 [US3] Configure volume mounts for code synchronization in docker-compose.dev.yml
- [ ] T033 [US3] Create development environment cleanup script in scripts/cleanup.sh
- [ ] T034 [US3] [P] Create container isolation validation in tests/docker/isolation.test.ts
- [ ] T035 [US3] [P] Create file synchronization tests in tests/docker/sync.test.ts
- [ ] T036 [US3] Create multi-project development guide in docs/multi-project-dev.md
- [ ] T037 [US3] Create container resource monitoring in scripts/resource-monitor.sh
- [ ] T038 [US3] Add hot reload configuration for frontend in Docker
- [ ] T039 [US3] Add hot reload configuration for backend in Docker
- [ ] T040 [US3] Create development environment diagnostics script in scripts/diagnose.sh

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, documentation, and optimization

- [ ] T041 Update project README with new port information and quick start guide
- [ ] T042 [P] Create comprehensive port configuration documentation in docs/ports.md
- [ ] T043 Create troubleshooting guide for port conflicts in docs/troubleshooting.md
- [ ] T044 [P] Add port configuration validation to CI/CD pipeline
- [ ] T045 Create migration guide for existing developers in docs/migration-guide.md
- [ ] T046 [P] Create performance optimization guide in docs/performance.md
- [ ] T047 Create team onboarding checklist in docs/onboarding.md
- [ ] T048 Add port configuration to project contribution guidelines
- [ ] T049 Create automated port conflict detection in pre-commit hooks
- [ ] T050 Final integration testing and validation

---

## Dependencies & Execution Order

### User Story Dependencies
- **US1 (Port Conflict Resolution)**: No dependencies - can start immediately after Phase 2
- **US2 (Unified Environment)**: Depends on US1 completion (needs port configurations)
- **US3 (Environment Isolation)**: Depends on US2 completion (needs Docker setup)

### Critical Path
1. Phase 1 (Setup) → Phase 2 (Foundational) → **US1** → **US2** → **US3** → Phase 6 (Polish)

### Parallel Execution Opportunities

**Within Phase 1** (T002, T003 can run in parallel):
```bash
# Parallel execution
T002: Create environment variable templates [P]
T003: Create Docker configuration templates [P]
```

**Within Phase 2** (T005, T006 can run in parallel):
```bash
# Parallel execution
T005: Create port configuration validation [P]
T006: Create environment variable validation schema [P]
```

**Within US1** (T009, T010 can run in parallel):
```bash
# Parallel execution
T009: Update frontend Vite configuration [P]
T010: Update backend NestJS configuration [P]
```

**Within US2** (T022, T023 can run in parallel):
```bash
# Parallel execution
T022: Configure Redis service with port 9178 [P]
T023: Configure PostgreSQL service with port 9198 [P]
```

**Within US3** (T034, T035 can run in parallel):
```bash
# Parallel execution
T034: Create container isolation validation [P]
T035: Create file synchronization tests [P]
```

**Within Phase 6** (T042, T044 can run in parallel):
```bash
# Parallel execution
T042: Create port configuration documentation [P]
T044: Add port configuration validation to CI/CD [P]
```

## Implementation Strategy

### MVP Scope (User Story 1 Only)
For fastest delivery, implement only User Story 1:
- Complete Phase 1 + Phase 2
- Implement T009-T018 (port configuration changes)
- **Result**: Port conflicts resolved, services use new ports
- **Effort**: ~40% of total work

### Incremental Delivery Strategy
1. **Sprint 1**: Phase 1 + Phase 2 + US1 (MVP delivery)
2. **Sprint 2**: US2 (Docker environment setup)
3. **Sprint 3**: US3 + Phase 6 (Polish and documentation)

### Risk Mitigation
- **Port conflicts**: Implement T004 (port conflict detection) early
- **Docker complexity**: Start with basic US1 before adding containerization
- **Environment consistency**: US2 provides standardized setup for team

## Validation Checklist

### Per User Story Validation
- [ ] **US1**: Can start frontend on 9158 and backend on 9168 simultaneously
- [ ] **US2**: Can run `pnpm run dev:setup` and all services start correctly
- [ ] **US3**: Can develop entirely within Docker containers without local dependencies

### End-to-End Validation
- [ ] All services use new port scheme (9158-9198)
- [ ] No port conflicts between services
- [ ] Hot reload works in containerized environment
- [ ] New team members can set up environment using quickstart guide
- [ ] Existing developers can migrate without data loss

## Total Tasks: 50
- **Setup Phase**: 3 tasks
- **Foundational Phase**: 5 tasks
- **User Story 1**: 10 tasks (MVP)
- **User Story 2**: 12 tasks
- **User Story 3**: 10 tasks
- **Polish Phase**: 10 tasks

**Parallel Opportunities**: 23 tasks (46% of total work can be parallelized)