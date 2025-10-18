# Implementation Plan: Client Frontend Framework

**Branch**: `002-client-framework` | **Date**: 2025-10-15 | **Spec**: [./spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-client-framework/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

基于新版章程要求构建 Vite + React + YJS + Tauri 前端应用框架，集成实时协作功能、桌面应用封装和与现有 services 的连接。重点关注前端框架搭建、YJS 协作逻辑、Tauri 桌面应用配置、TanStack Router 路由管理和 shadcn/ui 组件库集成，为未来的协作功能开发做好准备。

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.0+ (React 18.x)
**Primary Dependencies**: Vite, React 18, YJS, Tauri, TanStack Router, shadcn/ui, React Testing Library
**Storage**: YJS document storage + existing services integration
**Testing**: Vitest, React Testing Library, YJS collaboration tests
**Target Platform**: Web browsers + Desktop (Windows, macOS, Linux) via Tauri
**Project Type**: web (Frontend application with desktop packaging)
**Performance Goals**: <50ms UI interactions, real-time collaboration sync
**Constraints**: Cross-platform desktop compatibility, YJS CRDT data structures, dual storage architecture
**Scale/Scope**: Collaborative web application with desktop client capabilities

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### GATE 1: Test-Driven Development (NON-NEGOTIABLE)

✅ **PASS**: Plan includes Vitest + React Testing Library with component and collaboration tests. Will follow TDD principles during implementation.

### GATE 2: Code Style Standards

✅ **PASS**: TypeScript with Prettier/ESLint configuration inherited from root monorepo.

### GATE 3: Monorepo Principles

✅ **PASS**: Implementation fits within existing monorepo structure (apps/client), respects workspace boundaries and shares packages with services.

### GATE 4: Independent User Stories

✅ **PASS**: Feature can be broken into independently testable user stories (P1:基础框架, P2:YJS协作, P3:Tauri桌面封装, P4:UI组件库).

### GATE 5: TypeScript-First Development

✅ **PASS**: Full TypeScript implementation with strict typing, using React component typing, TanStack Router typing and YJS type definitions.

### GATE 6: Frontend Framework Standards (Vite + React + YJS)

✅ **PASS**: Implementation uses required Vite + React + YJS stack with functional components, proper TypeScript typing and established YJS provider patterns.

### GATE 7: Tauri Desktop Application Support

✅ **PASS**: Plan includes Tauri packaging for desktop deployment while maintaining web compatibility and proper IPC patterns.

## Project Structure

### Documentation (this feature)

```
specs/002-client-framework/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   └── api-contract.md  # API contract definition
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
│   ├── App.tsx          # Root component with providers
│   ├── components/
│   │   ├── ui/          # shadcn/ui components (initially)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── index.ts
│   │   ├── collaboration/  # YJS-enabled components
│   │   │   ├── collaborative-editor.tsx
│   │   │   ├── user-presence.tsx
│   │   │   └── conflict-resolution.tsx
│   │   └── layout/      # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── main-content.tsx
│   ├── providers/       # React providers
│   │   ├── yjs-provider.tsx
│   │   ├── auth-provider.tsx
│   │   ├── theme-provider.tsx
│   │   └── router-provider.tsx
│   ├── hooks/           # Custom hooks
│   │   ├── use-y-text.ts
│   │   ├── use-presence.ts
│   │   ├── use-collaboration.ts
│   │   └── use-auth.ts
│   ├── services/        # API integration
│   │   ├── api.ts
│   │   ├── auth-service.ts
│   │   ├── notes-service.ts
│   │   └── collaboration-service.ts
│   ├── stores/          # State management (Zustand)
│   │   ├── app-store.ts
│   │   ├── auth-store.ts
│   │   ├── notes-store.ts
│   │   └── yjs-store.ts
│   ├── routes/          # TanStack Router routes
│   │   ├── index.tsx
│   │   ├── dashboard.tsx
│   │   ├── notebooks.tsx
│   │   ├── notes.tsx
│   │   └── collaboration.tsx
│   ├── types/           # TypeScript definitions
│   │   ├── note.ts
│   │   ├── notebook.ts
│   │   ├── user.ts
│   │   ├── collaboration.ts
│   │   └── api.ts
│   ├── utils/           # Utility functions
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   └── styles/          # Global styles
│       ├── globals.css
│       └── components.css
├── public/              # Static assets
│   ├── favicon.ico
│   └── index.html
├── src-tauri/           # Tauri Rust backend (minimal)
│   ├── src/
│   │   └── main.rs      # Tauri application entry point
│   ├── Cargo.toml
│   └── tauri.conf.json  # Tauri configuration
├── tests/               # Test files
│   ├── unit/            # Component tests
│   ├── integration/     # Collaboration tests
│   └── e2e/             # End-to-end tests
├── vite.config.ts       # Vite configuration
├── vitest.config.ts     # Vitest configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── components.json      # shadcn/ui configuration
├── package.json
└── README.md

# Future packages when needed:
packages/
├── ui/                  # Shared shadcn/ui components (when multiple apps need it)
└── utils/               # Shared utilities (if needed)
```

**Structure Decision**: Monorepo frontend application with Vite + React + YJS + Tauri stack. The structure supports both web deployment and desktop packaging through Tauri, sharing the same React codebase. YJS providers and components are kept within the client project for simplicity, with potential to extract to shared packages when multiple applications need them. TanStack Router provides type-safe routing, while shadcn/ui offers modern, accessible components.

## Complexity Tracking

_Fill ONLY if Constitution Check has violations that must be justified_

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
