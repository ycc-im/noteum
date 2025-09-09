---
issue: 94
title: Tauri configuration error: allowlist.fs.readTextFile property not allowed
analyzed: 2025-09-09T03:35:37Z
estimated_hours: 4
parallelization_factor: 2.5
---

# Parallel Work Analysis: Issue #94

## Overview

Tauri build is failing due to configuration error using outdated v1 `allowlist` system. The `readTextFile` property under `allowlist.fs` doesn't exist in Tauri v2, which uses a new permissions system. **Decision: Migrate to Tauri v2** for better security, multi-window support, and future compatibility.

## Parallel Streams

### Stream A: Tauri v2 Configuration & Setup

**Scope**: Set up Tauri v2 project with modern permissions system replacing deprecated allowlist
**Files**:

- `packages/tauri/src-tauri/tauri.conf.json` (v2 schema)
- `packages/tauri/src-tauri/Cargo.toml` (Tauri v2 dependencies)
- `packages/tauri/src-tauri/src/main.rs` (v2 API)
- `packages/tauri/src-tauri/capabilities/` (permissions config)
  **Agent Type**: desktop-specialist
  **Can Start**: immediately
  **Estimated Hours**: 3
  **Dependencies**: none

### Stream B: GitHub Actions CI/CD Configuration

**Scope**: Create or update GitHub Actions workflow for Tauri desktop builds
**Files**:

- `.github/workflows/desktop.yml` (to be created)
- `.github/workflows/ci.yml` (may need updates)
  **Agent Type**: devops-specialist
  **Can Start**: immediately  
  **Estimated Hours**: 1.5
  **Dependencies**: none

### Stream C: Tauri Package Implementation

**Scope**: Complete Tauri package setup with proper build scripts and dependencies
**Files**:

- `packages/tauri/package.json` (update build/dev scripts)
- `packages/tauri/src/` (frontend code)
- Integration with shared package
  **Agent Type**: fullstack-specialist
  **Can Start**: after Stream A completes basic configuration
  **Estimated Hours**: 3
  **Dependencies**: Stream A

## Coordination Points

### Shared Files

- `packages/tauri/package.json` - Streams A & C (coordinate dependency and script updates)
- Project root level CI configuration - Stream B may need to coordinate with existing workflows

### Sequential Requirements

1. Basic Tauri configuration must be established before package implementation
2. CI workflow should be designed after understanding the build requirements from Stream A
3. Package implementation depends on proper configuration structure

## Conflict Risk Assessment

- **Low Risk**: Different streams work on different directories and file types
- **Medium Risk**: Some coordination needed for package.json and CI workflow naming
- **High Risk**: None identified - clear separation of concerns

## Parallelization Strategy

**Recommended Approach**: hybrid

Launch Streams A & B simultaneously since they work on completely independent areas (configuration research vs CI setup). Start Stream C when Stream A has established the basic configuration structure.

## Expected Timeline

With parallel execution:

- Wall time: 3 hours (limited by Stream C)
- Total work: 7.5 hours
- Efficiency gain: 60%

Without parallel execution:

- Wall time: 7.5 hours

## Notes

- **Key Decision**: Migrating to Tauri v2 instead of fixing v1 allowlist issues
- Tauri v2 eliminates the `allowlist` system entirely, replacing it with `permissions` + `capabilities`
- This migration provides better security, multi-window support, and future compatibility
- Stream A should prioritize Tauri v2 setup with basic permissions configuration
- CI workflow (Stream B) needs Rust toolchain and platform-specific dependencies for v2
- Integration with existing monorepo structure needs careful attention in Stream C

## Migration Benefits

- ✅ Solves the original `allowlist.fs.readTextFile` error permanently
- ✅ Modern permission system with fine-grained control
- ✅ Better multi-window and remote URL support
- ✅ Future-proof architecture (v1 support ending)
