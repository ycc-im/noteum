# Implementation Plan: Apps/Services 项目框架

**Branch**: `001-apps-services` | **Date**: 2025-10-15 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-apps-services/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

基于新版章程要求构建 Vite + React + YJS + Tauri 前端应用框架，集成实时协作功能、桌面应用封装和与现有 services 的连接。重点关注前端框架搭建、YJS 协作逻辑和 Tauri 桌面应用配置，为未来的协作功能开发做好准备。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0+ (React 18.x)
**Primary Dependencies**: Vite, React 18, YJS, Tauri, React Testing Library
**Storage**: YJS document storage + existing services integration
**Testing**: Vitest, React Testing Library, YJS collaboration tests
**Target Platform**: Web browsers + Desktop (Windows, macOS, Linux) via Tauri
**Project Type**: web (Frontend application with desktop packaging)
**Performance Goals**: <50ms UI interactions, real-time collaboration sync
**Constraints**: Cross-platform desktop compatibility, YJS CRDT data structures
**Scale/Scope**: Collaborative web application with desktop client capabilities

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### GATE 1: Test-Driven Development (NON-NEGOTIABLE)
✅ **PASS**: Plan includes Vitest + React Testing Library with component and collaboration tests. Will follow TDD principles during implementation.

### GATE 2: Code Style Standards
✅ **PASS**: TypeScript with Prettier/ESLint configuration inherited from root monorepo.

### GATE 3: Monorepo Principles
✅ **PASS**: Implementation fits within existing monorepo structure (apps/client), respects workspace boundaries and shares packages with services.

### GATE 4: Independent User Stories
✅ **PASS**: Feature can be broken into independently testable user stories (P1:基础框架, P2:YJS协作, P3:Tauri桌面封装).

### GATE 5: TypeScript-First Development
✅ **PASS**: Full TypeScript implementation with strict typing, using React component typing and YJS type definitions.

### GATE 6: Frontend Framework Standards (Vite + React + YJS)
✅ **PASS**: Implementation uses required Vite + React + YJS stack with functional components and proper TypeScript typing.

### GATE 7: Tauri Desktop Application Support
✅ **PASS**: Plan includes Tauri packaging for desktop deployment while maintaining web compatibility.

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
apps/client/
├── src/
│   ├── main.tsx         # React application entry point
│   ├── App.tsx          # Root component with YJS provider
│   ├── components/      # React components
│   │   ├── ui/          # Basic UI components
│   │   ├── collaboration/ # YJS-enabled components
│   │   └── layout/      # Layout components
│   ├── providers/       # YJS providers and state management
│   ├── hooks/           # Custom React hooks (including YJS)
│   ├── services/        # API integration with existing services
│   ├── types/           # TypeScript definitions
│   └── utils/           # Utility functions
├── public/              # Static assets
├── src-tauri/           # Tauri Rust backend (minimal)
│   ├── src/
│   │   └── main.rs      # Tauri application entry point
│   ├── Cargo.toml
│   └── tauri.conf.json  # Tauri configuration
├── tests/
│   ├── unit/            # Component tests
│   ├── integration/     # Collaboration tests
│   └── e2e/             # End-to-end tests
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── package.json
└── tailwind.config.js   # Styling configuration
```

**Structure Decision**: Monorepo frontend application with Vite + React + YJS + Tauri stack. The structure supports both web deployment and desktop packaging through Tauri, sharing the same React codebase. YJS providers and components are kept within the client project for simplicity, with potential to extract to shared packages when multiple applications need them.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
