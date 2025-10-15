# 数据库迁移指南

本文档描述了如何使用 Prisma 管理数据库迁移和种子数据。

## 概述

项目使用 Prisma 作为 ORM，提供类型安全的数据库访问、自动迁移生成和数据库管理功能。

## 文件结构

```
apps/services/
├── prisma/
│   ├── schema.prisma           # 数据库架构定义
│   ├── migrations/             # 迁移文件目录
│   └── migrations.config.ts    # 迁移配置文件
├── scripts/
│   └── migration-cli.ts        # 迁移 CLI 工具
└── src/modules/database/
    ├── migration.service.ts    # 迁移服务
    ├── seeding.service.ts      # 种子数据服务
    ├── health.service.ts       # 健康检查服务
    └── migration.controller.ts # 迁移控制器
```

## 快速开始

### 环境设置

1. 确保数据库连接配置正确
2. 安装依赖：`pnpm install`
3. 生成 Prisma 客户端：`pnpm prisma:generate`

### 初始设置

```bash
# 完整数据库设置
pnpm db:setup

# 或者分步执行
pnpm db:validate    # 验证架构
pnpm prisma:migrate # 创建并应用迁移
pnpm db:seed        # 运行种子数据
```

## 常用命令

### 开发环境

```bash
# 创建新迁移
pnpm prisma:migrate
pnpm prisma:migrate --name add_user_profiles

# 推送架构更改（快速开发）
pnpm prisma:push

# 重置数据库
pnpm db:reset

# 刷新数据库（重置 + 种子）
pnpm db:refresh

# 查看迁移状态
pnpm db:status

# 运行种子数据
pnpm db:seed

# 打开 Prisma Studio
pnpm prisma:studio
```

### 生产环境

```bash
# 应用迁移（安全）
pnpm migration:deploy
# 或者使用 CLI
node scripts/migration-cli.ts deploy

# 生成客户端
pnpm prisma:generate

# 验证架构
pnpm db:validate
```

### 使用 CLI 工具

```bash
# 使用自定义 CLI 工具
node scripts/migration-cli.ts setup
node scripts/migration-cli.ts migrate add_new_feature
node scripts/migration-cli.ts status
node scripts/migration-cli.ts health
```

## 迁移工作流

### 1. 修改架构

编辑 `prisma/schema.prisma` 文件：

```prisma
model User {
  id        String   @id @default(ulid())
  email     String   @unique
  // 新增字段
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 2. 创建迁移

```bash
# 创建命名迁移
pnpm prisma:migrate --name add_user_avatar

# 或使用 CLI
node scripts/migration-cli.ts migrate add_user_avatar
```

### 3. 检查迁移

生成的迁移文件位于 `prisma/migrations/` 目录：

```sql
-- Migration: 20231201120000_add_user_avatar
-- Generated at: 2023-12-01 12:00:00

ALTER TABLE "User" ADD COLUMN "avatar" TEXT;
```

### 4. 应用迁移

开发环境中迁移会自动应用。生产环境中使用：

```bash
pnpm migration:deploy
```

## 种子数据

### 种子数据文件

种子数据服务位于 `src/modules/database/seeding.service.ts`。

### 默认用户

系统会自动创建以下默认用户：

- **管理员**: admin@noteum.dev / admin123456
- **测试用户**: user1@noteum.dev / password123
- **测试用户**: user2@noteum.dev / password123
- **访客用户**: guest@noteum.dev / password123

### 运行种子数据

```bash
# 完整种子数据
pnpm db:seed

# 检查种子数据状态
pnpm seed:check

# 刷新种子数据
pnpm db:refresh
```

## 环境配置

### 开发环境

```bash
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/noteum"
```

### 生产环境

```bash
NODE_ENV=production
DATABASE_URL="postgresql://user:password@host:5432/noteum"
```

### 测试环境

```bash
NODE_ENV=test
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/noteum_test"
```

## 健康检查

### API 端点

```bash
# 基本健康检查
GET /database/health

# 详细状态
GET /database/status

# 数据库信息
GET /database/info
```

### CLI 命令

```bash
# 健康检查
pnpm db:health

# 数据库信息
node scripts/migration-cli.ts info
```

## 最佳实践

### 1. 迁移命名

使用描述性的迁移名称：

```bash
# 好的命名
pnpm prisma:migrate --name add_user_profile_table
pnpm prisma:migrate --name add_email_verification_field

# 避免的命名
pnpm prisma:migrate --name migration_1
pnpm prisma:migrate --name temp
```

### 2. 数据验证

在应用迁移前先验证：

```bash
pnpm db:validate
pnpm prisma:generate
```

### 3. 生产部署

生产环境部署流程：

1. 备份数据库
2. 验证迁移文件
3. 在预发布环境测试
4. 应用迁移到生产环境
5. 验证部署结果

```bash
# 生产部署命令
pnpm db:validate
node scripts/migration-cli.ts deploy
pnpm db:health
```

### 4. 团队协作

- 定期同步迁移文件
- 使用有意义的迁移消息
- 在 PR 中包含迁移更改
- 测试迁移的向前和向后兼容性

## 故障排除

### 常见问题

1. **迁移失败**
   ```bash
   # 检查迁移状态
   pnpm db:status

   # 重置开发环境
   pnpm db:reset
   ```

2. **数据库连接失败**
   ```bash
   # 检查连接
   pnpm db:health

   # 验证配置
   echo $DATABASE_URL
   ```

3. **Prisma 客户端生成失败**
   ```bash
   # 重新生成客户端
   pnpm prisma:generate --force
   ```

4. **种子数据失败**
   ```bash
   # 检查种子数据状态
   node scripts/migration-cli.ts seed-check

   # 重新运行种子
   pnpm db:refresh
   ```

### 调试技巧

1. **启用详细日志**
   ```bash
   DEBUG="prisma:*" pnpm prisma:migrate
   ```

2. **查看迁移 SQL**
   检查 `prisma/migrations/` 目录中的 SQL 文件

3. **使用 Prisma Studio**
   ```bash
   pnpm prisma:studio
   ```

## 高级用法

### 自定义迁移脚本

对于复杂的数据迁移，可以手动编写 SQL：

```sql
-- prisma/migrations/20231201120000_custom_migration/migration.sql

-- 添加新列
ALTER TABLE "User" ADD COLUMN "settings" JSONB;

-- 迁移现有数据
UPDATE "User" SET "settings" = '{"theme": "light", "language": "en"}' WHERE "settings" IS NULL;
```

### 环境特定种子

在 `seeding.service.ts` 中根据环境创建不同的种子数据：

```typescript
if (process.env.NODE_ENV === 'development') {
  await this.createDevelopmentData();
} else if (process.env.NODE_ENV === 'test') {
  await this.createTestData();
}
```

## 更多资源

- [Prisma 文档](https://www.prisma.io/docs/)
- [Prisma 迁移指南](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [数据库架构设计](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [种子数据指南](https://www.prisma.io/docs/guides/database/seed-database)