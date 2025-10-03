# Repository Guidelines

## Project Structure & Module Organization
Noteum is a pnpm workspace monorepo. Application code lives inside `packages/`: `packages/server` (NestJS API), `packages/web` (React + Vite client), `packages/ui` (shared React components and Storybook), `packages/shared` (cross-cutting TypeScript models and gRPC assets), and `packages/tauri` (desktop shell). Database bootstrap files sit under `database/`, and reference material lives in `docs/`. Environment defaults stay in `.env.example`.

## Build, Test, and Development Commands
Run `pnpm install` once to hydrate the workspace. Start every service in watch mode with `pnpm dev`; target a single package via `pnpm --filter web dev` or `pnpm --filter @noteum/server dev`. Build artifacts with `pnpm build`, or limit to the desktop bundle using `pnpm build:desktop`. Quality gates are `pnpm lint`, `pnpm typecheck`, and `pnpm test`, with package-specific variants (e.g., `pnpm --filter @noteum/server test:cov`, `pnpm --filter @noteum/ui test`) when you need focused feedback.

## Coding Style & Naming Conventions
TypeScript is the default across the repo; keep modules ESM. Prettier and ESLint enforce formatting—run `pnpm lint:fix` before committing to normalize spacing, semicolons, and imports. Follow idiomatic naming: React components in PascalCase (`UserMenu`), hooks in camelCase prefixed with `use`, and shared utilities exported via `packages/shared/src`. Keep filesystem names kebab-case (e.g., `packages/web/src/lib/note-api.ts`).

## Testing Guidelines
The server and shared packages rely on Jest (`*.spec.ts` and `__tests__/*.test.ts`). Frontend and UI packages use Vitest with Testing Library; colocate specs beside components and favour descriptive filenames such as `DashboardHeader.test.tsx`. Exercise new API endpoints via e2e suites under `packages/server/test`, and keep reusable fixtures in `packages/shared/src/examples`.

## Commit & Pull Request Guidelines
Commits typically call out the driving issue (`Issue #103: …`) or use conventional verbs (`feat: …`, `fix: …`). Keep messages imperative and scoped to a single concern. For pull requests, supply a succinct summary, link the GitHub issue, list affected packages, and note manual or automated test results. UI-facing changes should include screenshots or screen capture links. Before requesting review, ensure `pnpm lint`, `pnpm typecheck`, and relevant tests pass locally.

## Environment & Configuration Tips
Copy `.env.example` to `.env.development` for local secrets, and avoid committing real credentials. Tauri and server services expect Logto configuration—coordinate with the team for shared values. When adding environment keys, document them in `docs/` and supply safe defaults in the example file.
