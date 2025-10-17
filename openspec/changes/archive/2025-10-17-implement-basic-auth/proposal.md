## Why
用户需要通过用户名和密码进行身份验证才能访问 Noteum 应用的功能。目前系统虽然有认证基础设施，但缺少完整的登录流程实现。

## What Changes
- 在 services 端实现基于 tRPC 的登录 API
- 在 client 端创建 `/login` 页面和登录表单
- 创建测试用户账号 (choufeng / 123123)
- 在 client 端实现 JWT token 存储到 IndexedDB
- 更新现有的 auth-store 以连接真实的 tRPC API
- 添加登录状态持久化和自动 token 刷新

## Impact
- Affected specs: 无现有规范，将创建新的 authentication 规范
- Affected code:
  - apps/services/src/modules/auth/ (扩展现有认证服务)
  - apps/services/src/modules/trpc/ (添加登录路由)
  - apps/client/src/pages/login/ (新建登录页面)
  - apps/client/src/stores/auth-store.ts (更新认证存储)
  - apps/services/src/modules/database/seeding.service.ts (添加测试用户)