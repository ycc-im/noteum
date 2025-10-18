# 开发说明 - IndexedDB 集成

## 📁 文件分类

### 🟢 核心生产文件 (必须保留)

以下文件是 IndexedDB 集成的核心组件，不应该被删除：

- **`src/lib/database/types.ts`** - 数据库类型定义
- **`src/lib/database/index.ts`** - 数据库连接管理
- **`src/lib/database/auth-service.ts`** - 认证服务
- **`src/lib/database/migration.ts`** - 数据迁移服务
- **`src/components/app-init.tsx`** - 应用初始化组件
- **`src/components/auth-guard.tsx`** - 认证守卫组件 (已更新)
- **`src/stores/auth-store.ts`** - 认证状态管理 (已更新)
- **`src/routes/login.tsx`** - 登录页面 (已更新)
- **`src/App.tsx`** - 应用根组件 (已更新)
- **`package.json`** - 添加了 Dexie.js 依赖

### 🟡 开发测试文件 (可选择保留)

以下文件用于开发和测试，可以在生产构建时排除：

- **`src/test/utils/database-test.ts`** - 开发测试工具
  - 包含 IndexedDB 功能的完整测试套件
  - 在浏览器控制台提供 `testIndexedDB()` 函数
  - 仅在开发模式下导入 (通过 `import.meta.env.DEV` 检查)

## 🧪 测试工具使用

### 在开发环境中测试

1. 打开浏览器开发者工具控制台
2. 运行 `testIndexedDB()` 来测试完整的 IndexedDB 功能
3. 检查控制台输出的测试结果

### 测试内容包括：

- IndexedDB 支持检测
- 数据库连接测试
- 认证数据存储和检索
- Token 过期处理
- 数据库大小监控
- 数据清理功能

## 🚀 生产部署

### 可以安全排除的文件：

- 整个 `src/test/` 目录
- `src/test/utils/database-test.ts`

### 排除方法：

1. **构建时排除**: 测试文件只在 `import.meta.env.DEV` 时导入
2. **Git 排除**: 可以添加 `src/test/` 到 `.gitignore` (如果不需要版本控制)

### 验证生产构建：

```bash
# 构建应用
pnpm build

# 检查是否包含测试代码
grep -r "testIndexedDB" dist/
# 应该没有输出
```

## 📋 迁移状态

应用启动时会自动：

1. 检测 localStorage 中的现有认证数据
2. 验证数据完整性
3. 迁移到 IndexedDB
4. 清理 localStorage
5. 在控制台记录迁移状态

## 🔧 故障排除

### 如果遇到问题：

1. 打开浏览器控制台查看错误信息
2. 运行 `testIndexedDB()` 进行诊断
3. 检查 IndexedDB 支持情况
4. 验证迁移状态

### 手动重置：

```javascript
// 在浏览器控制台运行
localStorage.clear()
indexedDB.deleteDatabase('noteum_database')
location.reload()
```
