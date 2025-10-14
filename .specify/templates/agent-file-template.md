# Noteum Development Guidelines

Auto-generated from all feature plans. Last updated: [DATE]

## Constitution Compliance
This project follows strict development principles as defined in `.specify/memory/constitution.md`:
- **Test-Driven Development**: Tests MUST be written before implementation
- **Code Style**: Prettier with 2-space indentation, no semicolons, single quotes
- **TypeScript-First**: Strict type checking, no implicit any types
- **Monorepo Structure**: apps/ for applications, packages/ for shared libraries

## Active Technologies
[EXTRACTED FROM ALL PLAN.MD FILES]

## Project Structure
```
noteum/
├── apps/           # Executable applications
├── packages/       # Shared libraries
├── .specify/       # Project specifications and plans
└── docs/          # Documentation
```

## Commands
[ONLY COMMANDS FOR ACTIVE TECHNOLOGIES]

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
[LAST 3 FEATURES AND WHAT THEY ADDED]

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->