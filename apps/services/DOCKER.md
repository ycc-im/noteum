# Docker 开发环境配置

本文档描述了如何使用 Docker 配置和运行 Noteum 服务的各种环境。

## 环境概览

项目支持以下环境：

- **Development**: 开发环境，支持热重载和调试
- **Production**: 生产环境，优化构建和性能
- **Test**: 测试环境，用于运行自动化测试

## 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+

### 开发环境快速启动

```bash
# 1. 复制环境配置文件
cp .env.example .env.local

# 2. 启动开发环境
make quick-start
# 或者
./docker-scripts.sh dev-up

# 3. 访问应用
# 应用: http://localhost:3000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

## 环境详细配置

### 开发环境 (docker-compose.yml)

包含以下服务：

- **app**: NestJS 应用 (端口 3000)
- **postgres**: PostgreSQL 数据库 (端口 5432)
- **redis**: Redis 缓存 (端口 6379)
- **redis-commander**: Redis 管理工具 (端口 8081)
- **pgadmin**: PostgreSQL 管理工具 (端口 8080)

### 开发工具

启动开发工具：

```bash
make tools-up
# 或者
./docker-scripts.sh tools-up
```

- **pgAdmin**: http://localhost:8080
  - 用户名: admin@noteum.dev
  - 密码: admin
- **Redis Commander**: http://localhost:8081

### 生产环境 (docker-compose.prod.yml)

优化的生产环境配置：

- 多阶段构建，最小化镜像大小
- 非root用户运行
- 健康检查
- 资源限制
- 日志轮转

启动生产环境：

```bash
make prod-up
# 或者
./docker-scripts.sh prod-up
```

### 测试环境 (docker-compose.test.yml)

隔离的测试环境：

- 独立的数据库实例
- 内存存储，测试完成后清理
- 测试专用配置

运行测试：

```bash
make test-run
# 或者
./docker-scripts.sh test-run
```

## 常用命令

### 使用 Makefile

```bash
# 查看所有命令
make help

# 开发环境
make dev-up        # 启动
make dev-down      # 停止
make dev-logs      # 查看日志
make dev-shell     # 进入容器

# 生产环境
make prod-up       # 启动
make prod-down     # 停止
make prod-logs     # 查看日志

# 数据库操作
make db-migrate    # 运行迁移
make db-reset      # 重置数据库
make db-studio     # 打开 Prisma Studio

# 清理
make clean         # 清理容器
make clean-all     # 清理所有资源
```

### 使用脚本文件

```bash
# 开发环境
./docker-scripts.sh dev-up
./docker-scripts.sh dev-logs -f app  # 跟踪应用日志
./docker-scripts.sh dev-shell        # 进入容器

# 生产环境
./docker-scripts.sh prod-up --build
./docker-scripts.sh prod-logs

# 测试
./docker-scripts.sh test-up
./docker-scripts.sh test-run

# 工具
./docker-scripts.sh tools-up
./docker-scripts.sh status
```

## 环境变量配置

### 开发环境 (.env.local)

```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/noteum
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-jwt-secret-key
```

### 生产环境

生产环境需要设置以下环境变量：

```bash
NODE_ENV=production
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_production_jwt_secret
REDIS_PASSWORD=your_redis_password
```

## 数据库管理

### Prisma 操作

```bash
# 进入应用容器
docker-compose exec app sh

# 生成 Prisma 客户端
pnpm prisma generate

# 运行迁移
pnpm prisma migrate dev

# 重置数据库
pnpm prisma migrate reset

# 查看 Prisma Studio
pnpm prisma studio --hostname 0.0.0.0
```

### 外部连接

- **PostgreSQL**: localhost:5432
  - 用户名: postgres
  - 密码: postgres
  - 数据库: noteum

- **Redis**: localhost:6379

## 调试配置

### VS Code 调试配置

在 `.vscode/launch.json` 中添加：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug NestJS (Docker)",
      "type": "node",
      "request": "attach",
      "address": "localhost",
      "port": 9229,
      "localRoot": "${workspaceFolder}/apps/services/src",
      "remoteRoot": "/app/apps/services/src",
      "protocol": "inspector"
    }
  ]
}
```

### 启用调试模式

修改 `docker-compose.yml` 中的 app 服务：

```yaml
app:
  command: ['node', '--inspect=0.0.0.0:9229', 'apps/services/dist/main.js']
```

## 故障排除

### 常见问题

1. **端口冲突**

   ```bash
   # 检查端口使用
   lsof -i :3000
   lsof -i :5432
   # 修改 docker-compose.yml 中的端口映射
   ```

2. **权限问题**

   ```bash
   # 修复文件权限
   sudo chown -R $USER:$USER .
   ```

3. **数据库连接失败**

   ```bash
   # 检查数据库容器状态
   docker-compose ps
   docker-compose logs postgres
   ```

4. **依赖安装失败**
   ```bash
   # 重新构建镜像
   make build-no-cache
   # 或者
   docker-compose build --no-cache
   ```

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs app
docker-compose logs postgres
docker-compose logs redis

# 实时跟踪日志
docker-compose logs -f app
```

### 容器管理

```bash
# 查看容器状态
docker-compose ps

# 重启服务
docker-compose restart app

# 进入容器
docker-compose exec app sh
docker-compose exec postgres psql -U postgres -d noteum

# 停止所有服务
docker-compose down

# 停止并删除数据
docker-compose down -v
```

## 性能优化

### 开发环境优化

- 使用绑定挂载进行热重载
- 安装开发依赖用于调试
- 启用详细日志

### 生产环境优化

- 多阶段构建最小化镜像
- 使用非root用户
- 设置资源限制
- 配置健康检查
- 启用日志轮转

### 构建优化

```bash
# 构建优化的生产镜像
make build-prod

# 清理未使用的Docker资源
docker system prune -a
```

## 安全注意事项

1. **不要在生产环境使用默认密码**
2. **使用强密码作为 JWT_SECRET**
3. **定期更新基础镜像**
4. **不要在容器中存储敏感信息**
5. **使用 Docker secrets 管理敏感数据**

## 更多资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [NestJS Docker 指南](https://docs.nestjs.com/techniques/docker)
- [Prisma Docker 部署](https://www.prisma.io/docs/concepts/components/prisma-migrate/databases)
