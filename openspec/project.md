# Project Context

## Purpose
Noteum is a collaborative note-taking application built for real-time document editing and knowledge management. The platform enables users to create, organize, and collaborate on notes and notebooks with seamless real-time synchronization, powered by YJS CRDT technology.

## Tech Stack

### Frontend (Client)
- **Framework**: React 18.2+ with TypeScript 5.0+
- **Build Tool**: Vite 4.5+ for fast development and building
- **State Management**: Zustand for local state, YJS for collaborative state
- **Routing**: TanStack Router (React Router v6)
- **Styling**: Tailwind CSS 3.3+ with CVA for component variants
- **Desktop**: Tauri framework for cross-platform desktop applications
- **Real-time Collaboration**: YJS 13.6+ with y-websocket and Hocuspocus provider
- **Testing**: Vitest with React Testing Library and jsdom

### Backend (Services)
- **Framework**: NestJS 10.x LTS with TypeScript 5.0+
- **API**: tRPC 10.x for type-safe API communication
- **Database**: PostgreSQL 15+ with pgvector extension for vector search
- **ORM**: Prisma 5.0+ for database operations and migrations
- **Caching**: Redis 4.6+ for session management and caching
- **Real-time**: Socket.io 4.8+ for WebSocket connections
- **Authentication**: JWT tokens with Passport.js
- **File Storage**: Multer with Sharp for image processing
- **Testing**: Jest with NestJS testing utilities

### Infrastructure
- **Package Manager**: pnpm 8.15.0 with workspace support
- **Monorepo**: pnpm workspaces with apps/ and packages/ structure
- **Development**: Docker Compose for local development environment
- **Code Quality**: ESLint, Prettier, TypeScript strict mode
- **Version Control**: Git with Changesets for version management

## Project Conventions

### Code Style
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Disabled (no semicolons)
- **Quotes**: Single quotes for strings
- **Trailing Commas**: ES5 compatible trailing commas
- **File Naming**: kebab-case for files, PascalCase for components
- **TypeScript**: Strict mode enabled, no implicit any
- **ESLint**: Strict mode enforced, zero warnings policy

### Architecture Patterns
- **Monorepo Structure**: Clear separation between apps/ (executables) and packages/ (shared libraries)
- **Modular Design**: Independent modules with clear boundaries
- **Dependency Injection**: NestJS DI pattern throughout services
- **Component Architecture**: Functional React components with hooks
- **State Management**: Zustand stores + YJS providers for collaboration
- **API Design**: tRPC procedures for end-to-end type safety

### Testing Strategy
- **Test-Driven Development**: Tests MUST be written before implementation (TDD)
- **TDD Process**: MUST follow Red-Green-Refactor cycle
  - Red: Write failing tests first
  - Green: Write minimal code to make tests pass
  - Refactor: Improve code while maintaining test coverage
- **Unit Tests**: 100% coverage requirement for new code
- **Integration Tests**: Cross-package interactions tested
- **Component Tests**: React components with React Testing Library
- **Collaboration Tests**: YJS scenarios with simulated concurrent users
- **Test Framework**: Vitest for frontend, Jest for backend
- **Test Organization**: `.spec.ts` or `.test.ts` suffix for test files
- **Exempt File Types**: The following files are exempt from TDD requirements:
  - Configuration files (.env, .config.js, tsconfig.json)
  - Constant definitions and enums
  - Build scripts and deployment scripts
  - Documentation files (.md, .txt)
  - Type definition files (.d.ts) that only contain types
  - Static asset files

### Git Workflow
- **Branching**: Feature branches required, format `[###-task-description]`
- **Main Branch Protection**: If currently on main branch, MUST create new feature branch before making any changes
- **No Main Development**: All work on feature branches, no direct main commits
- **Branch Creation**: All feature branches MUST be based on latest main branch
- **Pull Requests**: Required for all changes with code review
- **Commit Messages**: Conventional commits with Changesets for versioning
- **Quality Gates**: All automated checks must pass before merging

### Development Process Validation
- **Pre-commit Validation**: All commits must pass:
  - All tests pass
  - Code linting checks pass
  - TypeScript compilation without errors
  - Branch is not main branch
- **Code Review Requirements**: Pull requests must verify:
  - Adherence to TDD practices
  - Branch management compliance
  - Test coverage requirements
  - Code quality standards
- **Exception Handling**: Workflow exceptions require:
  - Documentation in commit messages
  - Team lead approval
  - Alternative quality assurance measures

## Domain Context

### Core Concepts
- **Notebooks**: Hierarchical organization containers for notes
- **Notes**: Individual documents with rich text editing capabilities
- **Real-time Collaboration**: Multiple users editing simultaneously via YJS CRDT
- **Users**: Authentication system with JWT-based sessions
- **Persistence**: Automatic saving with document versioning

### Business Rules
- Users can create multiple notebooks with nested organization
- Notes support rich text formatting and real-time collaboration
- All changes are automatically synchronized and persisted
- User authentication required for accessing private content
- Vector search enabled for intelligent content discovery

## Important Constraints

### Technical Constraints
- **Node.js 18+**: Minimum runtime requirement
- **TypeScript Strict**: No implicit any types allowed
- **Test Coverage**: 100% coverage mandatory for new code
- **Docker Required**: Development environment standardized via Docker
- **Port Standardization**: Specific port ranges for different services (9158 for frontend, 9168 for backend API)

### Performance Requirements
- **Real-time Sync**: Sub-100ms collaboration latency
- **Document Loading**: Sub-500ms initial load time
- **Search Response**: Sub-200ms vector search queries
- **Concurrent Users**: Support for 100+ simultaneous users per document

### Security Requirements
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control for notebooks
- **Data Validation**: Zod schemas for all API inputs
- **Rate Limiting**: API throttling to prevent abuse
- **HTTPS Required**: All production communications encrypted

## External Dependencies

### Development Infrastructure
- **PostgreSQL 15+**: Primary database with pgvector extension
- **Redis 4.6+**: Session storage and application caching
- **Docker & Docker Compose**: Local development environment
- **pgAdmin**: Database administration interface (port 9188)
- **Redis Commander**: Redis management interface (port 9189)

### Third-party Services
- **OpenAI API**: AI-powered features and content analysis
- **Hocuspocus**: YJS WebSocket provider for real-time collaboration
- **Cloud Storage**: Configurable for file uploads (AWS S3, etc.)

### Standardized Ports
- **Frontend**: 9158 (web), varies for Tauri desktop apps
- **Backend API**: 9168 (NestJS + tRPC)
- **Database**: 9198 (PostgreSQL)
- **Cache**: 9178 (Redis)
- **Admin Interfaces**: 9188 (pgAdmin), 9189 (Redis Commander)
