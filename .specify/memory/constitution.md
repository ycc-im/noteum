<!-- Sync Impact Report -->
<!-- Version change: 1.1.0 → 1.2.0 -->
<!-- Modified principles: VI (Frontend Framework Standards) -->
<!-- Added sections: Tauri Desktop Application Support -->
<!-- Removed sections: None -->
<!-- Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md -->
<!-- Follow-up TODOs: None -->

# Noteum Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
TDD is mandatory for all feature development. Tests MUST be written before any implementation code. The Red-Green-Refactor cycle is strictly enforced: write failing tests, get user approval, then implement minimal code to make tests pass. No production code may be written without corresponding tests that define its behavior.

### II. Code Style Standards
All code MUST follow the established Prettier configuration with 2-space indentation, no semicolons, single quotes, and trailing commas in ES5-compatible environments. Code MUST pass ESLint checks before any commit. Style violations are blocking issues that must be resolved immediately.

### III. Monorepo Principles
The project follows a monorepo structure with clear separation between applications (apps/) and shared libraries (packages/). All packages MUST be independently testable and buildable. Cross-package dependencies MUST be explicitly declared and versioned. No circular dependencies are allowed between packages.

### IV. Independent User Stories
Every feature MUST be broken down into independently testable and deliverable user stories. Each user story should provide complete value when implemented in isolation. Stories are prioritized (P1, P2, P3) and can be developed in parallel after foundational infrastructure is complete.

### V. TypeScript-First Development
All code MUST be written in TypeScript with strict type checking enabled. Implicit any types are prohibited. All interfaces and types must be explicitly defined. Code must pass TypeScript compilation without any type errors before merging.

### VI. Frontend Framework Standards (Vite + React + YJS)
Frontend development MUST use the Vite + React + YJS technology stack for all collaborative and real-time applications. Vite provides the build tooling and development server, React serves as the UI framework with component-based architecture, and YJS enables real-time collaboration features with CRDT data structures. All React components MUST be written as functional components with hooks, use proper TypeScript typing for props and state, and follow established patterns for YJS provider integration and real-time data synchronization.

### VII. Tauri Desktop Application Support
Desktop applications MUST use Tauri framework to package the Vite + React + YJS frontend as native desktop applications. Tauri provides secure, lightweight packaging while maintaining the same frontend codebase. The frontend client communicates directly with backend services through existing APIs, with Tauri handling desktop-specific features like window management, system tray, and native integrations. All applications MUST maintain cross-platform compatibility (Windows, macOS, Linux) and follow Tauri security and packaging best practices.

## Development Workflow

### Code Review Process
All pull requests require at least one code review. Reviews MUST verify:
- Compliance with constitution principles
- Test coverage and quality
- TypeScript type safety
- Code style adherence
- Documentation completeness

### Quality Gates
Code must pass all automated checks before merging:
- ESLint validation
- TypeScript compilation
- Unit tests (100% coverage for new code)
- Integration tests (where applicable)
- Build verification

## Technical Standards

### Monorepo Structure
The project uses pnpm workspaces with the following conventions:
- `apps/` contains executable applications (Vite + React apps, Tauri desktop apps)
- `packages/` contains reusable libraries and shared YJS providers
- Each package has its own package.json with explicit dependencies
- Shared dependencies are managed at the root level
- Build artifacts are excluded from version control
- Frontend applications use Vite configuration with React and TypeScript plugins
- Tauri applications share the same frontend codebase with web applications
- YJS providers and collaboration logic are encapsulated in shared packages

### Testing Requirements
- Unit tests are mandatory for all new code
- Integration tests for cross-package interactions
- Contract tests for external APIs
- React component tests using React Testing Library
- YJS collaboration tests with simulated concurrent users
- Tauri desktop application integration tests
- Tests MUST be written before implementation (TDD)
- All tests must pass before code can be merged

## Governance

This constitution supersedes all other development practices and guidelines. Amendments require:
1. Documentation of proposed changes with rationale
2. Team approval through pull request review
3. Version update following semantic versioning
4. Migration plan for existing code
5. Communication to all team members

All pull requests and code reviews must verify compliance with constitution principles. Any complexity or deviation from these principles must be explicitly justified and approved. Violations of test-driven development and code style standards are immediate blocking issues.

**Version**: 1.2.0 | **Ratified**: 2025-01-15 | **Last Amended**: 2025-10-15