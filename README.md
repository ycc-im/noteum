# Noteum - AI-Powered Note-Taking Application

Noteum is a modern, AI-powered note-taking application featuring a workflow-based interface. It's built as a monorepo with a NestJS backend, a web client, and a Tauri-based desktop client, all managed with pnpm workspaces.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ycc-im/noteum.git
    cd noteum
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Running in Development Mode

To start all services (web, server, etc.) in development mode, run the following command from the root of the monorepo:

```bash
pnpm dev
```

This will start all packages in parallel. You can then access the web client at `http://localhost:3000` (or the port configured for the web package).

## Project Structure

This project is a monorepo managed by pnpm workspaces. The main packages are located in the `packages/` directory:

-   `packages/web`: The React-based web client.
-   `packages/tauri`: The configuration and specific code for the Tauri desktop application.
-   `packages/server`: The NestJS-based backend server.
-   `packages/shared`: Shared code, types, and utilities used across different packages.

## Available Scripts

The following scripts can be run from the root of the monorepo:

-   `pnpm dev`: Starts all packages in development mode.
-   `pnpm build`: Builds all packages for production.
-   `pnpm lint`: Lints all code in the monorepo.
-   `pnpm lint:fix`: Lints and automatically fixes issues.
-   `pnpm typecheck`: Runs TypeScript type checking for all packages.
