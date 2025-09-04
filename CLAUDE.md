# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code PM (Project Management) system that provides workflow tools for shipping better software using spec-driven development, GitHub issues, Git worktrees, and multiple AI agents running in parallel.

Key features:
- Spec-driven development with traceability from PRD to production
- Parallel execution with multiple agents working simultaneously
- GitHub integration using issues as the source of truth
- Context preservation across work sessions
- No "vibe coding" - every line of code traces back to a specification

## Core Architecture

```
.claude/
├── CLAUDE.md          # Always-on instructions
├── agents/            # Task-oriented agents for context preservation
├── commands/          # Command definitions
│   ├── context/       # Create, update, and prime context
│   ├── pm/            # Project management commands
│   └── testing/       # Prime and execute tests
├── context/           # Project-wide context files
├── epics/             # Local workspace for PM work (in .gitignore)
│   └── [epic-name]/   # Epic and related tasks
│       ├── epic.md    # Implementation plan
│       ├── [#].md     # Individual task files
│       └── updates/   # Work-in-progress updates
├── prds/              # PRD files
├── rules/             # Rule files for reference
└── scripts/           # Script files
```

## Key Commands

### Project Management
- `/pm:prd-new feature-name` - Create new Product Requirements Document
- `/pm:prd-parse feature-name` - Convert PRD to implementation epic
- `/pm:epic-oneshot feature-name` - Decompose and sync epic in one command
- `/pm:issue-start 1234` - Begin work on GitHub issue with parallel agents
- `/pm:issue-sync 1234` - Push progress updates to GitHub
- `/pm:next` - Show next priority task

### Context Management
- `/context:create` - Create initial project context documentation
- `/context:prime` - Load context into current conversation
- `/context:update` - Update existing context with recent changes

### Testing
- `/testing:prime` - Configure testing setup
- `/testing:run` - Execute tests with intelligent analysis

## Development Workflow

1. **Product Planning**: Create PRD with `/pm:prd-new`
2. **Implementation Planning**: Convert PRD to epic with `/pm:prd-parse`
3. **Task Decomposition**: Break epic into tasks with `/pm:epic-decompose`
4. **GitHub Sync**: Push to GitHub with `/pm:epic-sync`
5. **Execution**: Start work with `/pm:issue-start` which launches parallel agents
6. **Progress Tracking**: Sync updates with `/pm:issue-sync`

## Parallel Execution System

Issues are not atomic - they split into multiple parallel work streams:
- Agent 1: Database tables and migrations
- Agent 2: Service layer and business logic
- Agent 3: API endpoints and middleware
- Agent 4: UI components and forms
- Agent 5: Test suites and documentation

All agents run simultaneously in the same worktree, coordinated through:
- File-level parallelism (no conflicts when working on different files)
- Explicit coordination when same files are needed
- Progress tracking through stream-specific files
- Git commits for communication between agents

## Agent Coordination

Use specialized agents for heavy work:
- `code-analyzer`: Hunt bugs across multiple files
- `file-analyzer`: Read and summarize verbose files
- `test-runner`: Execute tests without polluting main context
- `parallel-worker`: Coordinate multiple parallel work streams

## Key Principles

1. **No Vibe Coding**: Every line of code must trace back to a specification
2. **Context Preservation**: Never lose project state between sessions
3. **Parallel Execution**: Ship faster with multiple agents working simultaneously
4. **GitHub Native**: Works with tools your team already uses
5. **Full Traceability**: Complete audit trail from idea to production

## Common Development Tasks

1. To start a new feature:
   ```
   /pm:prd-new your-feature-name
   /pm:prd-parse your-feature-name
   /pm:epic-oneshot your-feature-name
   /pm:issue-start 1234
   ```

2. To run tests:
   ```
   /testing:prime
   /testing:run
   ```

3. To manage context:
   ```
   /context:create
   /context:prime
   ```

4. To work on a GitHub issue:
   ```
   /pm:issue-start 1234
   /pm:issue-sync 1234
   ```

## Important Notes

- All commands are markdown files interpreted as instructions
- The `/` prefix triggers command execution
- Commands can spawn agents for heavy processing
- Worktrees provide clean git isolation for parallel work
- GitHub doesn't need to know HOW the work got done – just that it IS done