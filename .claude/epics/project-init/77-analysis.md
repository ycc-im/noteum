# Issue #77: Set up monorepo structure with pnpm workspaces

## Parallel Work Streams

### Stream A: Root Configuration

- **Description**: Configure the root `package.json` for pnpm workspaces and create the `pnpm-workspace.yaml` file. This sets up the foundation for the monorepo.
- **Files**:
  - `package.json` (root)
  - `pnpm-workspace.yaml`
- **Agent**: `general-purpose`

### Stream B: Directory and Package Scaffolding

- **Description**: Create the directory structure for all packages (`shared`, `web`, `tauri`, `server`) and initialize a basic `package.json` file in each.
- **Files**:
  - `packages/`
  - `packages/shared/package.json`
  - `packages/web/package.json`
  - `packages/tauri/package.json`
  - `packages/server/package.json`
- **Agent**: `general-purpose`

### Stream C: Shared Package Setup

- **Description**: Set up the `shared` package with initial utilities, types, and configurations that will be used across other packages.
- **Files**:
  - `packages/shared/src/`
  - `packages/shared/tsconfig.json`
- **Agent**: `general-purpose`

### Stream D: Documentation Update

- **Description**: Create or update the project's main `README.md` to document the new pnpm-based monorepo structure, including setup instructions and development commands.
- **Files**:
  - `README.md`
- **Agent**: `general-purpose`
