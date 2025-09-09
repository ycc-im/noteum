---
name: project-init
description: 初始化Noteum项目基础架构，包含monorepo结构、AI笔记应用核心功能和部署方案
status: backlog
created: 2025-09-03T21:21:39Z
---

# PRD: project-init

## Executive Summary

Noteum是一个以AI为驱动的个人笔记应用，采用monorepo架构，支持Web端和Tauri桌面客户端。该项目将使用React Flow构建工作流式的笔记界面，后端采用NestJS和gRPC通信，支持Docker容器化部署，并集成Logto身份验证系统。

## Problem Statement

当前市场上缺乏一个真正融合AI能力、支持工作流式笔记编辑、并且可以同时部署为Web应用和桌面应用的开源笔记工具。开发者需要一个完整的项目初始化框架，能够快速搭建起支持这些特性的技术栈，并提供标准化的开发和部署流程。

## User Stories

### Primary User Personas

1. **开发者/技术爱好者** - 希望快速搭建一个具备现代前端技术栈的笔记应用
2. **个人用户** - 需要一个强大的AI辅助笔记工具来管理个人知识
3. **团队用户** - 需要一个可自部署的知识管理解决方案

### User Journeys

1. 开发者下载项目模板，通过初始化命令快速搭建开发环境
2. 用户通过Web或桌面客户端访问笔记应用，使用AI功能辅助记录和整理信息
3. 管理员通过Docker Compose一键部署完整服务

### Pain Points

- 缺乏整合了现代技术栈的笔记应用模板
- Web和桌面端需要分别开发维护
- AI集成复杂，难以快速实现
- 部署流程复杂，缺乏标准化方案

## Requirements

### Functional Requirements

1. **Monorepo结构**
   - 支持共享代码库
   - 包含Web、Tauri客户端、服务端API模块
   - 支持独立开发和统一构建

2. **前端功能**
   - 基于React Flow的工作流式笔记界面
   - 使用TanStack全家桶（Router, Query, Table等）
   - 支持Web和Tauri双端部署
   - 实现基础页面（登录、主页、笔记编辑页）

3. **后端功能**
   - NestJS实现的gRPC服务端
   - PostgreSQL数据库集成（含向量插件）
   - Logto身份验证集成
   - 基础API接口

4. **部署方案**
   - Docker Compose一键部署方案
   - 包含Web、Server、PostgreSQL服务
   - 支持Tauri多平台客户端构建和发布

5. **AI集成**
   - 为后续AI功能预留接口
   - 支持向量数据库存储

### Non-Functional Requirements

1. **性能**
   - Web应用首屏加载时间不超过3秒
   - 笔记保存响应时间不超过500ms

2. **安全性**
   - 用户数据加密存储
   - API访问控制
   - 身份验证安全

3. **可扩展性**
   - 模块化设计，便于功能扩展
   - 支持微服务架构演进

4. **可维护性**
   - 清晰的代码结构和文档
   - 标准化开发流程

## Success Criteria

1. 成功初始化monorepo项目结构
2. 实现基础的Web和Tauri双端应用
3. 完成gRPC通信框架搭建
4. 实现Docker Compose部署方案
5. 通过Tauri实现多平台客户端构建和GitHub Release发布

## Constraints & Assumptions

### 技术约束

- 必须使用指定的技术栈（React Flow, TanStack, gRPC, NestJS, PostgreSQL）
- 需要支持Apache 2.0开源许可证
- 需要兼容主流操作系统（Windows, macOS, Linux）

### 时间约束

- 项目初始化应在合理时间内完成
- 需要为后续功能开发预留时间

### 资源约束

- 开发资源有限，需要最大化代码复用
- 需要考虑部署成本

## Out of Scope

1. 具体的AI功能实现（将在后续PRD中定义）
2. 复杂的UI/UX设计（初期只实现基础界面）
3. 多用户协作功能
4. 移动端应用开发
5. 第三方服务集成（除Logto外）

## Dependencies

### 外部依赖

- React Flow库
- TanStack全家桶
- gRPC工具链
- Tauri框架
- PostgreSQL数据库
- Logto身份验证服务
- Docker和Docker Compose

### 内部依赖

- 团队对相关技术栈的熟悉程度
- 设计资源支持
- 测试环境准备
