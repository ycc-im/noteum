# 🐳 Docker Compose 开发环境

## 快速启动

```bash
# 启动核心开发环境（推荐）
docker-compose -f docker-compose.quick-start.yml up -d

# 查看服务状态
docker-compose -f docker-compose.quick-start.yml ps

# 查看日志
docker-compose -f docker-compose.quick-start.yml logs -f server
```

## 访问地址

- **PostgreSQL**: `localhost:5432` (用户: noteum_user, 密码: noteum_password)
- **NestJS Server**: `http://localhost:3001` (HTTP API)
- **gRPC Server**: `localhost:5001`
- **pgAdmin**: `http://localhost:8080` (邮箱: admin@noteum.dev, 密码: admin123)

## 可用配置

- `docker-compose.yml` - 完整生产配置
- `docker-compose.override.yml` - 开发环境覆盖
- `docker-compose.quick-start.yml` - 简化启动配置（仅核心服务）

## 功能状态

✅ **完全可用**:

- PostgreSQL + pgvector 数据库
- NestJS 服务器热重载开发
- pgAdmin 数据库管理界面

⚠️ **已知问题**:

- Web 服务有运行时依赖问题，但不影响后端开发
- 服务器可能显示 TypeScript 类型错误（代码库问题，非 Docker 问题）

停止服务：

```bash
docker-compose -f docker-compose.quick-start.yml down
```
