# Noteum - AI-Powered Note-Taking Application

Noteum is a modern, AI-powered note-taking application featuring a workflow-based interface and local-first storage. Built with React, Tauri, and IndexedDB for optimal performance and offline capabilities.

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm
- Rust (for Tauri desktop builds)

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

**Web Application:**
```bash
pnpm dev
```
Access the web client at `http://localhost:3000`.

**Desktop Application:**
```bash
pnpm dev:tauri
```

## Project Structure

This project uses a simplified single-application architecture:

```
noteum/
├── src/                    # Application source code
│   ├── components/         # React components
│   ├── services/           # Business logic and storage
│   │   ├── storage/        # IndexedDB storage services
│   │   ├── types/          # TypeScript type definitions
│   │   └── auth/           # Authentication services
│   ├── pages/              # Application pages
│   ├── contexts/           # React context providers
│   ├── routes/             # TanStack Router routes
│   ├── hooks/              # Custom React hooks
│   └── utils/              # Utility functions
├── src-tauri/              # Tauri desktop configuration
└── dist/                   # Build output
```

### Key Features

- **Local-First Storage**: Uses IndexedDB for fast, offline-capable data storage
- **Cross-Platform**: Web and desktop (via Tauri) applications
- **AI-Powered Workflows**: ReactFlow-based visual note organization
- **Type-Safe**: Full TypeScript support throughout
- **Modern Stack**: React 19, Vite, TailwindCSS, Dexie

## Available Scripts

### Development Commands
- `pnpm dev`: Starts the web application in development mode
- `pnpm dev:tauri`: Starts the desktop application in development mode

### Build Commands
- `pnpm build`: Builds the web application for production
- `pnpm build:tauri`: Builds the desktop application for production

### Quality Assurance
- `pnpm lint`: Checks code formatting with ESLint
- `pnpm format`: Fixes code formatting with Prettier
- `pnpm typecheck`: Runs TypeScript type checking
- `pnpm test`: Runs test suites with Vitest

### Storybook
- `pnpm storybook`: Starts Storybook for component development
- `pnpm build-storybook`: Builds Storybook for deployment
