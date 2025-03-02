# Noteum

## Overview

Noteum is a monorepo project built with Bun, designed to provide a robust and scalable solution for modern web applications.

## Project Structure

- **Packages**:
  - `utils`: Shared utility functions
  - `core`: Core business logic
  - `ui`: Reusable UI components
  - `server`: Backend services
  - `web`: Frontend application

## Prerequisites

- Node.js: `>=22.0.0`
- Bun: `>=1.0.0`

## Getting Started

### Installation

```bash
bun install
```

### Running the Project

```bash
# Build all packages
bun run build

# Run specific package
bun run <package-name>
```

### Testing

```bash
# Run tests for all packages
bun test

# Run tests with coverage
bun test --coverage
```

## Development Workflow

### Commit Message Convention

We follow Conventional Commits for version control and changelog generation.

#### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process changes
- `perf`: Performance improvements
- `ci`: CI configuration changes
- `revert`: Revert previous commits

#### Commit Scopes

- `core`
- `ui`
- `server`
- `utils`
- `web`

#### Versioning

We use Semantic Versioning (SemVer):

1. **Major Version** (`x.0.0`):
   - Breaking changes
   - Incompatible API modifications
   - Uses `!` marker in commit message

2. **Minor Version** (`0.x.0`):
   - New features
   - Backward-compatible additions
   - Uses `feat` type commits

3. **Patch Version** (`0.0.x`):
   - Bug fixes
   - Performance optimizations
   - Code refactoring
   - Uses `fix`, `docs`, `perf` type commits

### Pull Request Guidelines

- Use English for PR titles, descriptions, and comments
- Follow the PR template
- Include description, changes, testing details
- Add appropriate labels

## Code Quality

- TypeScript: Strict mode
- Linting: ESLint and Prettier
- Commit message validation
- 80% test coverage required

## Docker Support

```bash
# Build services
docker-compose build

# Start development environment
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`feat/scope/description`)
3. Commit changes following conventional commit rules
4. Push and create a pull request

## License

[Add your license information here]

## Contact

[Add contact information or support channels]
