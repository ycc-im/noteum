## Why

基于现有的前端框架（Vite + React + TypeScript），我们需要完善 Tauri 桌面应用的开发和测试能力。当前 apps/client 已经配置了基础的 Tauri CLI 脚本（tauri:dev, tauri:build），但缺少统一的项目级别的 Tauri 开发命令和完整的测试支持。

## What Changes

- 在根目录添加 `pnpm dev:tauri` 命令，提供统一的 Tauri 开发环境
- 创建 Tauri 专用的开发脚本，支持服务和前端同时启动
- 实现 Tauri 应用的测试能力，包括单元测试和集成测试
- 添加 Tauri 开发环境的健康检查和状态监控
- 完善 Tauri 应用的构建和打包流程

## Impact

- Affected specs: tauri-development
- Affected code: 根目录 package.json, scripts/ 目录, apps/client 测试配置
- 开发体验：提供桌面应用开发的完整工作流程
- 测试覆盖：增加 Tauri 应用的自动化测试能力