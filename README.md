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

To start all applications in development mode, run the following command from the root of the monorepo:

```bash
pnpm dev
```

This will start all applications in parallel. You can then access the web client at `http://localhost:3000`.

### Running Specific Applications

You can also start individual applications:

```bash
# Start web application only
pnpm dev:web

# Start desktop application only
pnpm dev:desktop
```

## Project Structure

This project is a monorepo managed by pnpm workspaces with the following structure:

```
noteum/
├── apps/                    # Applications
│   ├── web/                # React-based web client
│   ├── server/             # NestJS-based backend server
│   └── desktop/            # Tauri-based desktop application
├── packages/               # Shared packages
│   ├── shared/            # Shared code, types, and utilities
│   └── ui/                # UI component library
├── docs/                  # Documentation
└── database/              # Database configuration and migrations
```

### Applications (`apps/`)

- **`apps/web`**: The React-based web client built with Vite and TanStack Router
- **`apps/server`**: The NestJS-based backend server with FastAPI and tRPC support
- **`apps/desktop`**: The Tauri-based desktop application for cross-platform support

### Shared Packages (`packages/`)

- **`packages/shared`**: Shared code, types, utilities, and business logic used across applications
- **`packages/ui`**: Reusable UI component library

## Available Scripts

The following scripts can be run from the root of the monorepo:

### Development Commands
- `pnpm dev`: Starts all applications in development mode
- `pnpm dev:web`: Starts only the web application
- `pnpm dev:desktop`: Starts only the desktop application

### Build Commands
- `pnpm build`: Builds all applications for production
- `pnpm build:web`: Builds only the web application
- `pnpm build:tauri`: Builds only the desktop application
- `pnpm build:desktop:full`: Builds web then desktop application

### Quality Assurance
- `pnpm lint`: Checks code formatting with Prettier
- `pnpm lint:fix`: Fixes code formatting issues automatically
- `pnpm typecheck`: Runs TypeScript type checking for all packages
- `pnpm test`: Runs test suites for all packages
