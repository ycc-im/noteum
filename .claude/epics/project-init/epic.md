---
name: project-init
status: backlog
created: 2025-09-03T21:33:20Z
progress: 0%
prd: .claude/prds/project-init.md
github: https://github.com/ycc-im/noteum/issues/76
---

# Epic: project-init

## Overview
This epic focuses on initializing the Noteum project with a monorepo architecture that supports a React Flow-based workflow note interface, NestJS backend with gRPC communication, and deployment via Docker Compose. The implementation will leverage TanStack for the frontend and include Tauri for desktop client generation.

## Architecture Decisions
- **Monorepo Structure**: Using npm workspaces or yarn workspaces to manage shared code between web and Tauri clients
- **Frontend Framework**: TanStack Start for full-stack TypeScript application with SSR capabilities
- **Backend Framework**: NestJS with gRPC for type-safe API communication
- **Database**: PostgreSQL with vector extensions for AI capabilities
- **Authentication**: Logto integration for secure user management
- **Deployment**: Docker Compose for local development and production deployment
- **Desktop Client**: Tauri for cross-platform desktop application generation

## Technical Approach
### Frontend Components
- Shared UI components library for web and Tauri clients
- React Flow implementation for workflow-based note editing
- TanStack Router for client-side routing
- TanStack Query for server state management
- Basic pages: Login, Dashboard, Note Editor

### Backend Services
- NestJS gRPC server with proto definitions
- PostgreSQL database integration with TypeORM or Prisma
- Logto authentication service integration
- Basic API endpoints for user management and notes
- Vector database integration for AI features

### Infrastructure
- Docker Compose configuration for local development
- PostgreSQL service with pgvector extension
- Web service container
- Server service container
- Tauri build pipeline for GitHub Releases

## Implementation Strategy
- Phase 1: Monorepo structure and shared configurations
- Phase 2: Frontend implementation with basic pages
- Phase 3: Backend API with gRPC and database integration
- Phase 4: Authentication integration with Logto
- Phase 5: Docker Compose deployment setup
- Phase 6: Tauri desktop client generation

## Task Breakdown Preview
- [ ] Monorepo Structure: Set up npm workspaces with shared packages
- [ ] Frontend Foundation: Implement TanStack Start with shared components
- [ ] Backend Foundation: Create NestJS gRPC server with basic endpoints
- [ ] Database Integration: Set up PostgreSQL with vector extensions
- [ ] Authentication: Integrate Logto authentication service
- [ ] Deployment: Create Docker Compose configuration
- [ ] Desktop Client: Implement Tauri build pipeline

## Dependencies
- React Flow library
- TanStack Start and related packages
- NestJS framework and gRPC libraries
- PostgreSQL with pgvector extension
- Logto authentication service
- Tauri framework
- Docker and Docker Compose

## Success Criteria (Technical)
- Monorepo structure properly configured with shared code
- Web application running with React Flow interface
- Tauri desktop client building successfully
- NestJS backend serving gRPC endpoints
- PostgreSQL database with vector extensions running
- Docker Compose deployment working locally
- Tauri build pipeline generating multi-platform releases

## Estimated Effort
- Overall timeline: 2-3 weeks for initial implementation
- Resource requirements: 1-2 developers familiar with the tech stack
- Critical path: Monorepo setup → Frontend → Backend → Deployment integration

## Tasks Created
- [ ] #77 - Set up monorepo structure with npm workspaces (parallel: true)
- [ ] #78 - Implement TanStack Start with shared components (parallel: true)
- [ ] #79 - Create NestJS gRPC server with basic endpoints (parallel: true)
- [ ] #80 - Set up PostgreSQL with vector extensions (parallel: true)
- [ ] #81 - Integrate Logto authentication service (parallel: true)
- [ ] #82 - Create Docker Compose configuration (parallel: true)
- [ ] #83 - Implement Tauri build pipeline (parallel: true)

Total tasks:        7
Parallel tasks:        7
Sequential tasks: 0
