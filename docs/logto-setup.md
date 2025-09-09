# Logto 认证服务配置指南

本文档指导如何在 Logto 管理控制台中配置应用，以便与 Noteum 项目集成。

## Logto 服务信息

- **Logto 服务地址**: https://auth.xiajia.im
- **管理控制台**: https://auth.xiajia.im/console

## 需要创建的应用

根据项目架构，我们需要创建以下应用：

### 1. Web SPA 应用（前端认证）

#### 创建步骤：

1. 登录 Logto 管理控制台
2. 点击 "应用" → "创建应用"
3. 选择 **"Single Page Application (SPA)"**
4. 填写应用信息：
   - **应用名称**: `Noteum Web App`
   - **描述**: `Noteum 前端 Web 应用认证`

#### 配置设置：

- **允许的回调 URL**（开发环境）:
  ```
  http://localhost:3000/callback
  http://localhost:3000/auth/callback
  ```
- **允许的回调 URL**（生产环境，稍后配置）:

  ```
  https://app.xiajia.im/callback
  https://app.xiajia.im/auth/callback
  ```

- **登出重定向 URL**:

  ```
  http://localhost:3000        # 开发环境
  https://app.xiajia.im        # 生产环境
  ```

- **CORS 允许源**:
  ```
  http://localhost:3000        # 开发环境前端
  https://app.xiajia.im        # 生产环境前端
  ```

#### 记录配置信息：

创建完成后，请记录以下信息（需要在项目中配置）：

- **App ID**: `{记录实际的 App ID}`
- **App Secret**: `{记录实际的 App Secret}`

### 2. API 资源（后端 API 保护）

#### 创建步骤：

1. 在 Logto 控制台中，点击 "API 资源" → "创建 API 资源"
2. 填写资源信息：
   - **资源标识符**: `https://api.noteum.com` 或 `noteum-api`
   - **资源名称**: `Noteum API`
   - **描述**: `Noteum 后端 API 资源保护`

#### 配置作用域：

为 API 资源添加以下作用域：

- `notes:read` - 读取笔记权限
- `notes:write` - 写入笔记权限
- `notes:delete` - 删除笔记权限
- `user:profile` - 访问用户信息权限

#### 记录配置信息：

- **资源标识符**: `{记录实际的资源标识符}`

### 3. 桌面应用（预留，未来实现）

当 Tauri 桌面应用准备就绪时，需要创建：

#### 创建步骤：

1. 选择 **"Native Application"**
2. 填写应用信息：
   - **应用名称**: `Noteum Desktop`
   - **描述**: `Noteum 桌面应用认证`

#### 配置设置：

- **允许的回调 URL**:
  ```
  noteum://auth/callback       # 自定义协议
  http://localhost:8080/callback  # 备用本地回调
  ```

## 环境变量配置

配置完成后，需要在项目中设置以下环境变量：

### 前端环境变量 (packages/web/.env)：

```env
# Logto Web 应用配置
VITE_LOGTO_ENDPOINT=https://auth.xiajia.im
VITE_LOGTO_APP_ID={Web SPA 应用的 App ID}
VITE_LOGTO_REDIRECT_URI=http://localhost:3000/callback
VITE_LOGTO_POST_LOGOUT_REDIRECT_URI=http://localhost:3000
```

### 后端环境变量 (packages/server/.env)：

```env
# Logto API 资源配置
LOGTO_ENDPOINT=https://auth.xiajia.im
LOGTO_API_RESOURCE={API 资源的标识符}
LOGTO_JWKS_URI=https://auth.xiajia.im/oidc/jwks
```

## 验证配置

### 1. 测试 Web 应用认证：

1. 启动前端开发服务器：`cd packages/web && pnpm dev`
2. 访问 `http://localhost:3000`
3. 点击登录按钮，应该跳转到 Logto 登录页面
4. 登录成功后应该重定向回应用

### 2. 测试 API 保护：

1. 启动后端服务器：`cd packages/server && pnpm dev`
2. 尝试访问受保护的 API 端点
3. 应该返回 401 未授权错误（没有 token 时）
4. 使用有效的访问令牌应该能正常访问

## 生产环境配置

当部署到生产环境时，需要：

1. **更新回调 URL** - 将生产域名添加到 Logto 应用配置中
2. **更新 CORS 设置** - 添加生产环境域名到允许源列表
3. **更新环境变量** - 使用生产环境的 URL 和域名

## 常见问题

### Q: 为什么需要两个应用？

A: Web SPA 应用用于前端用户认证流程，API 资源用于后端验证访问令牌。这是标准的 OAuth 2.0 / OpenID Connect 架构。

### Q: 如何处理跨域问题？

A: 在 Logto 应用配置中正确设置 CORS 允许源，包含前端应用的域名。

### Q: 访问令牌如何传递给后端？

A: 前端获取访问令牌后，通过 HTTP Authorization 头传递给后端 API：`Authorization: Bearer {access_token}`

## 支持

如有配置问题，请查看：

- [Logto 官方文档](https://docs.logto.io/)
- [React SDK 文档](https://docs.logto.io/docs/recipes/integrate-logto/react/)
- [Node.js SDK 文档](https://docs.logto.io/docs/recipes/integrate-logto/node-js/)
