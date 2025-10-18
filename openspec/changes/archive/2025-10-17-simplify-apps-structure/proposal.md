# 简化 Apps 目录结构变更提案

## 概述

移除 apps/ 目录中冗余的 package.json 脚本配置，统一使用根目录的脚本体系来管理所有服务的启动、构建和测试。

## Why

当前项目在 apps/ 目录和根目录都存在大量重复的脚本配置，这种设计导致：

1. **认知负担**：开发者需要记住多个层级的命令
2. **维护成本**：相同逻辑需要在多个地方维护
3. **复杂性**：增加了项目的整体复杂性
4. **入口点分散**：缺乏统一的操作入口

通过简化 apps/ 目录结构，我们可以：

- 提供更清晰、统一的开发体验
- 减少配置冗余和维护成本
- 提高项目的纯洁性和可维护性
- 建立更直观的项目结构

## 问题分析

1. **配置冗余**：apps/client 和 apps/services 中包含了大量与根目录脚本功能重复的 npm scripts
2. **复杂性增加**：多层级的脚本配置增加了项目的认知负担
3. **维护成本**：需要在多个地方维护相似的脚本逻辑
4. **入口点分散**：用户需要记住多个层级的命令，而非统一的根目录入口

## 解决方案

- 删除 apps/package.json 中间层配置文件
- 删除 apps/scripts/ 重复脚本目录
- 保留 apps/client/package.json 和 apps/services/package.json 中的所有有用配置和脚本
- 统一使用根目录 package.json 的脚本体系作为主要入口点
- 添加独立重启命令：`dev:restart-services` 和 `dev:restart-client`
- 更新项目文档和开发指南

## What Changes

### 删除的文件

- `apps/package.json` - 中间层配置文件
- `apps/scripts/` - 重复的脚本目录及其内容

### 保留的文件

- `apps/client/package.json` - 客户端应用配置（包含所有必要的脚本）
- `apps/services/package.json` - 服务端应用配置（包含所有必要的脚本）

### 新增的文件

- `scripts/dev-restart-services.sh` - 仅重启后端服务的脚本
- `scripts/dev-restart-client.sh` - 仅重启前端应用的脚本

### 更新的文件

- `package.json` - 添加新的重启命令
- `README.md` - 移除 apps 目录入口的说明
- `CLAUDE.md` - 更新命令说明

## 预期收益

- 简化项目结构，提高项目纯洁性
- 统一开发体验，减少认知负担
- 降低维护成本
- 更清晰的入口点设计

## 影响范围

- apps/package.json（删除）
- apps/scripts/（删除）
- apps/client/package.json（保留）
- apps/services/package.json（保留）
- 开发文档和 CLAUDE.md（更新）
