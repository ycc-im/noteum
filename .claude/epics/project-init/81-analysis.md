---
issue: 81
title: "Integrate Logto authentication service"
analysis_date: 2025-09-06T02:30:00Z
total_streams: 6
estimated_hours: 10-14
---

# Issue #81 工作流分析: Integrate Logto authentication service

## 概述

集成 Logto 认证服务，实现完整的前后端用户认证系统。包括 SDK 集成、认证流程实现、API 保护等。

## 并行工作流设计

### Stream 1: 共享认证基础 [优先级: 最高]
- **代理类型**: `code-analyzer`
- **估时**: 2-3 小时
- **状态**: 可立即开始
- **依赖**: 无

#### 工作范围
- **文件**: `packages/shared/auth/**/*`
- **任务**:
  - 创建用户类型定义 (`types/user.ts`)
  - 创建认证状态枚举 (`types/auth-state.ts`)
  - 定义错误类型 (`types/auth-error.ts`)
  - 创建通用常量 (`constants/auth.ts`)
  - 创建通用工具函数 (`utils/auth.ts`)

#### 产出
- 完整的类型定义系统
- 前后端共享的认证接口
- 错误处理机制

### Stream 2: 前端 Logto 集成 [优先级: 高]
- **代理类型**: `parallel-worker`
- **估时**: 4-5 小时
- **状态**: 等待 Stream 1 完成基础类型
- **依赖**: Stream 1 (共享类型)

#### 工作范围
- **文件**: `packages/web/src/auth/**/*`, `packages/web/src/components/auth/**/*`
- **任务**:
  - 安装 `@logto/react` 依赖
  - 创建 Logto Provider 配置 (`auth/logto-provider.tsx`)
  - 实现认证 Hooks (`auth/hooks/`)
  - 创建登录页面 (`pages/login.tsx`)
  - 创建回调页面 (`pages/callback.tsx`)
  - 创建认证保护组件 (`components/auth/`)
  - 更新路由配置

#### 产出
- 完整的前端认证流程
- 登录/登出功能
- 用户状态管理
- 路由保护

### Stream 3: 后端 Logto 集成 [优先级: 高]
- **代理类型**: `parallel-worker`
- **估时**: 4-5 小时
- **状态**: 等待 Stream 1 完成基础类型
- **依赖**: Stream 1 (共享类型)

#### 工作范围
- **文件**: `packages/server/src/auth/**/*`, `packages/server/src/guards/**/*`
- **任务**:
  - 安装 `@logto/node` 和相关依赖
  - 创建 Logto 配置模块 (`auth/logto.config.ts`)
  - 实现 JWT 验证中间件 (`auth/jwt.middleware.ts`)
  - 创建认证守卫 (`guards/auth.guard.ts`)
  - 实现用户信息获取服务 (`auth/user.service.ts`)
  - 创建认证装饰器 (`decorators/auth.decorator.ts`)

#### 产出
- JWT 令牌验证系统
- 用户信息获取机制
- 认证中间件和守卫
- NestJS 认证模块

### Stream 4: API 端点保护 [优先级: 中]
- **代理类型**: `parallel-worker`
- **估时**: 2-3 小时
- **状态**: 等待 Stream 3 完成认证基础
- **依赖**: Stream 3 (后端认证系统)

#### 工作范围
- **文件**: `packages/server/src/controllers/**/*`, `packages/server/src/modules/**/*`
- **任务**:
  - 识别需要保护的 API 端点
  - 应用认证守卫到控制器
  - 实现用户上下文注入
  - 创建权限检查机制
  - 更新 API 文档

#### 产出
- 受保护的 API 端点
- 用户权限验证
- 安全的数据访问

### Stream 5: 配置管理 [优先级: 中]
- **代理类型**: `code-analyzer`
- **估时**: 1-2 小时
- **状态**: 可与其他流并行开始
- **依赖**: 无

#### 工作范围
- **文件**: 环境配置文件、配置验证
- **任务**:
  - 完善环境变量配置
  - 创建配置验证模块
  - 设置不同环境的配置
  - 创建配置文档
  - 实现配置错误处理

#### 产出
- 完整的环境配置系统
- 配置验证机制
- 多环境支持

### Stream 6: 测试和质量保证 [优先级: 中]
- **代理类型**: `test-runner`
- **估时**: 2-3 小时
- **状态**: 等待主要功能完成
- **依赖**: Stream 2, Stream 3, Stream 4

#### 工作范围
- **文件**: `packages/*/test/**/*`, `packages/*/**/*.test.ts`
- **任务**:
  - 编写前端认证组件测试
  - 编写后端认证服务测试
  - 创建集成测试
  - 编写 API 保护测试
  - 执行完整测试套件
  - 修复测试失败

#### 产出
- 完整的测试覆盖
- 质量保证验证
- 回归测试防护

## 执行时序

### 阶段 1: 基础准备 (立即开始)
- Stream 1: 共享认证基础 ✓
- Stream 5: 配置管理 ✓

### 阶段 2: 核心集成 (基础完成后)
- Stream 2: 前端 Logto 集成
- Stream 3: 后端 Logto 集成

### 阶段 3: API 保护 (认证完成后)
- Stream 4: API 端点保护

### 阶段 4: 质量保证 (功能完成后)
- Stream 6: 测试和质量保证

## 协调要求

### 文件级协调
- Stream 1 完成基础类型后，Stream 2 和 3 可以开始
- Stream 2 和 3 可以完全并行执行（不同文件）
- Stream 4 需要等待 Stream 3 的认证守卫完成

### 依赖管理
- Package.json 更新需要在安装依赖前协调
- 环境配置可能需要在多个流间共享

### 提交策略
- 每个 Stream 独立提交
- 使用格式: `Issue #81: [Stream X] {具体更改描述}`
- 频繁小提交，便于其他流集成

## 风险识别

### 高风险
1. **NestJS Logto 集成复杂性** - 可能需要自定义实现
2. **前后端状态同步** - 令牌刷新和过期处理

### 中风险
1. **CORS 配置** - 开发环境跨域问题
2. **环境配置** - 多环境配置管理

### 缓解策略
- 优先实现 POC 验证可行性
- 预留额外时间处理集成问题
- 及时在进度文件中记录阻塞点

## 成功标准

### 功能验证
- [ ] 用户可以在前端成功登录
- [ ] 后端 API 正确验证访问令牌
- [ ] 受保护的端点拒绝未授权访问
- [ ] 用户信息在前后端正确传递

### 技术验证
- [ ] 所有测试通过
- [ ] TypeScript 类型检查通过
- [ ] 代码 lint 检查通过
- [ ] 无安全漏洞

### 文档验证
- [ ] Logto 配置文档完整
- [ ] API 文档更新
- [ ] 环境配置说明清晰