# Issue #78: Implement TanStack Start with shared components

## Parallel Work Streams

### Stream A: TanStack Start Initialization

- **Description**: Initialize the TanStack Start project within the `packages/web` directory. This includes setting up the basic file structure, routing, and build configurations provided by the framework.
- **Files**:
  - `packages/web/` (entire directory)
- **Agent**: `general-purpose`

### Stream B: Shared UI Components Library

- **Description**: Create a basic shared UI components library within the `packages/shared/components` directory. This will include simple, reusable components like buttons and inputs that can be used by both the web and Tauri clients.
- **Files**:
  - `packages/shared/components/`
- **Agent**: `general-purpose`

### Stream C: Page Scaffolding

- **Description**: Create the basic page components (Login, Dashboard, Note Editor) within the `packages/web/src/pages` directory. These will be simple placeholders initially.
- **Files**:
  - `packages/web/src/pages/`
- **Agent**: `general-purpose`

### Stream D: React Flow Integration

- **Description**: Integrate the React Flow library into a dedicated component within the `packages/web` application. This will set up the basic canvas and nodes for the workflow-based note editing interface.
- **Files**:
  - `packages/web/src/components/NoteWorkflow.tsx`
- **Agent**: `general-purpose`
