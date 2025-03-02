# bun-demo

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Development Guide

### Commit Message Convention

We use Conventional Commits to manage commit messages and version control. The commit message format is:

```
<type>(<scope>): <subject>
```

#### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation updates
- `style`: Code formatting (changes that do not affect code execution)
- `refactor`: Code refactoring (neither new features nor bug fixes)
- `test`: Adding tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements
- `ci`: Continuous integration configuration changes

#### Scope

The scope specifies the package or module affected by the change, such as:
- `core`
- `ui`
- `server`
- `utils`
- `web`

#### Versioning Rules

We follow Semantic Versioning (SemVer) rules:

1. **Major Version**：`x.0.0`
   - Breaking changes
   - Incompatible API modifications
   - Use `!` marker in commit message

2. **Minor Version**：`0.x.0`
   - New features
   - Backward-compatible functionality additions
   - Use `feat` type commits

3. **Patch Version**：`0.0.x`
   - Bug fixes
   - Performance optimizations
   - Code refactoring
   - Use `fix`, `docs`, `perf` type commits

#### Examples

- `feat(ui): add new button component`
- `fix(core): resolve memory leak`
- `docs(web): update README`
- `fix(server)!: completely change authentication method`

### Pre-Commit Checks

We use husky and commitlint to ensure commit messages conform to the standard. Each commit will automatically check:
- Code style
- Commit message format
- Code quality
