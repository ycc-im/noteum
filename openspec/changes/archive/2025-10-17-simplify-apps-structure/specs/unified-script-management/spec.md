# 统一脚本管理规格

## ADDED Requirements

### Requirement: 根目录脚本统一管理

所有开发、构建、测试相关的操作 SHALL 通过根目录 package.json 的脚本来执行。开发者 SHALL NOT 直接使用 apps/ 目录下的脚本进行日常开发工作。

#### Scenario: 开发者启动完整开发环境

- Given 开发者想要启动完整的开发环境（前端 + 后端 + 数据库）
- When 开发者在项目根目录执行 `pnpm dev:workspace`
- Then 所有服务应该正确启动，无需进入 apps/ 子目录

#### Scenario: 开发者只需要启动后端服务

- Given 开发者只需要启动后端服务进行 API 开发
- When 开发者在项目根目录执行 `pnpm dev:services`
- Then 后端服务应该正确启动，包括数据库连接

#### Scenario: 开发者只需要启动前端应用

- Given 开发者只需要启动前端应用进行 UI 开发
- When 开发者在项目根目录执行 `pnpm dev:client`
- Then 前端应用应该正确启动，能够连接到后端服务

#### Scenario: 开发者需要重启后端服务

- Given 开发过程中后端服务出现错误需要重启
- When 开发者在项目根目录执行 `pnpm dev:restart-services`
- Then 只有后端服务被重启，前端服务保持运行状态

#### Scenario: 开发者需要重启前端应用

- Given 开发过程中前端应用出现错误需要重启
- When 开发者在项目根目录执行 `pnpm dev:restart-client`
- Then 只有前端应用被重启，后端服务保持运行状态

### Requirement: Apps 目录配置简化

apps/ 目录下的 package.json SHALL 只包含必要的依赖信息和特殊构建脚本。所有可以通过根目录脚本替代的配置 SHALL 被移除。

#### Scenario: Apps 目录 package.json 清理

- Given apps/client/package.json 和 apps/services/package.json
- When 执行配置清理
- Then 移除所有可以通过根目录脚本替代的 scripts 配置
- And 保留依赖信息和特殊构建脚本（如 Tauri 相关）

### Requirement: 文档更新

所有项目文档 SHALL 更新以反映新的脚本使用方式。文档 SHALL NOT 再引用 apps/ 目录下的独立脚本作为主要使用方式。

#### Scenario: 开发者查看开发指南

- Given 开发者查看项目文档
- When 寻找如何启动开发环境
- Then 文档应该指导使用根目录的脚本命令
- And 不再提及 apps/ 目录下的独立脚本

## MODIFIED Requirements

### Requirement: 开发工作流一致性

现有的开发工作流 SHALL 保持一致的体验。所有现有功能 SHALL 通过根目录脚本提供等效的替代方案。

#### Scenario: 现有开发者使用新的脚本体系

- Given 开发者习惯于使用 apps/ 目录下的脚本
- When 迁移到根目录脚本
- Then 所有功能都应该有对应的根目录脚本
- And 行为应该保持一致

#### Scenario: CI/CD 流程适配

- Given 现有的 CI/CD 流程
- When 脚本配置变更
- Then CI/CD 流程应该继续正常工作
- And 构建和部署流程不受影响
