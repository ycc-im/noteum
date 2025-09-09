# 🐳 Docker Compose 开发环境完整指南

## 🎯 总览

这个项目提供了完整的 Docker Compose 开发环境配置，支持：
- ✅ PostgreSQL + pgvector 数据库
- ✅ NestJS 服务器（支持热重载）
- ✅ pgAdmin 数据库管理界面
- ✅ 完整的开发和生产环境配置

## 🚀 快速开始

### 1. 使用简化配置（推荐开始）
```bash
# 启动核心服务（数据库 + 服务器）
docker-compose -f docker-compose.quick-start.yml up -d

# 查看服务状态
docker-compose -f docker-compose.quick-start.yml ps

# 查看日志
docker-compose -f docker-compose.quick-start.yml logs -f server
```

### 2. 使用完整配置
```bash
# 启动所有服务
docker-compose up -d postgres server

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f server
```

## 📊 服务访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| PostgreSQL | `localhost:5432` | 数据库连接 |
| NestJS Server | `localhost:3001` | HTTP API |
| NestJS gRPC | `localhost:5001` | gRPC 服务 |
| pgAdmin | `http://localhost:8080` | 数据库管理界面 |

### pgAdmin 登录信息
- 邮箱: `admin@noteum.dev`
- 密码: `admin123`

### 数据库连接信息
- 主机: `postgres` (容器内) / `localhost` (主机)
- 端口: `5432`
- 数据库: `noteum`
- 用户名: `noteum_user`
- 密码: `noteum_password`

## 🛠️ 开发功能

### ✅ 已完全实现
1. **PostgreSQL + pgvector**
   - 数据持久化
   - 健康检查
   - 初始化脚本支持

2. **NestJS 服务器**
   - 热重载开发
   - TypeScript 编译
   - 源码卷挂载
   - 权限问题已解决

3. **数据库管理**
   - pgAdmin Web 界面
   - 预配置连接

4. **网络和安全**
   - 专用网络隔离
   - 非 root 用户运行
   - 安全端口映射

### ⚠️ 需要注意的问题
1. **Web 服务**
   - 构建成功但运行时依赖问题
   - 需要进一步调试 `@tanstack/react-start` 配置

## 📁 配置文件说明

| 文件 | 用途 |
|------|------|
| `docker-compose.yml` | 主配置文件 |
| `docker-compose.override.yml` | 开发环境覆盖 |
| `docker-compose.prod.yml` | 生产环境配置 |
| `docker-compose.quick-start.yml` | 简化启动配置 |
| `docker-compose.README.md` | 详细使用文档 |

## 🔧 常用命令

### 服务管理
```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 查看实时日志
docker-compose logs -f

# 查看服务状态
docker-compose ps
```

### 开发调试
```bash
# 进入服务器容器
docker-compose exec server sh

# 查看服务器日志
docker-compose logs -f server

# 重启单个服务
docker-compose restart server

# 查看数据库日志
docker-compose logs -f postgres
```

### 清理和重置
```bash
# 停止并删除所有容器
docker-compose down

# 删除数据卷（谨慎使用）
docker-compose down -v

# 清理未使用的镜像
docker image prune
```

## 🎯 开发工作流

### 1. 日常开发
```bash
# 启动开发环境
docker-compose -f docker-compose.quick-start.yml up -d

# 查看服务器日志确认启动
docker-compose -f docker-compose.quick-start.yml logs -f server

# 开发完成后停止
docker-compose -f docker-compose.quick-start.yml down
```

### 2. 数据库操作
- 访问 http://localhost:8080 打开 pgAdmin
- 使用上述连接信息连接数据库
- 进行数据库设计和查询

### 3. 热重载测试
- 修改 `packages/server/src` 下的文件
- NestJS 会自动检测变化并重启
- 查看日志确认重启成功

## 🏗️ 架构特点

### 多阶段构建
- **Development**: 开发阶段，支持热重载
- **Builder**: 构建阶段，编译应用
- **Production**: 生产阶段，最小化镜像

### 卷挂载策略
- 源码实时同步
- 配置文件热更新
- Node modules 隔离避免冲突

### 网络设计
- 专用桥接网络 `noteum-network`
- 容器间通过服务名通信
- 安全的端口暴露策略

## 🚨 故障排除

### 常见问题

1. **权限错误**
   ```bash
   # 如果遇到权限问题，重新构建服务器镜像
   docker-compose build --no-cache server
   ```

2. **端口冲突**
   ```bash
   # 检查端口占用
   lsof -i :3001
   lsof -i :5432
   lsof -i :8080
   ```

3. **数据库连接失败**
   ```bash
   # 检查数据库健康状态
   docker-compose logs postgres
   docker-compose ps
   ```

4. **服务无法启动**
   ```bash
   # 查看详细错误日志
   docker-compose logs service-name
   
   # 强制重新创建容器
   docker-compose up -d --force-recreate
   ```

### 健康检查
所有服务都配置了健康检查，可以通过以下方式查看：
```bash
docker-compose ps
# 查看 STATUS 列的 "healthy" 状态
```

## 📈 性能优化

### 开发环境
- 禁用健康检查加快启动
- 使用卷挂载实现热重载
- 优化 Docker 层缓存

### 生产环境
- 多阶段构建减小镜像大小
- 资源限制和预留
- 自动重启策略

## 🎉 成功指标

当看到以下输出时，说明环境配置成功：

```bash
$ docker-compose -f docker-compose.quick-start.yml ps

NAME              STATUS
noteum-postgres   Up (healthy)
noteum-pgadmin    Up
noteum-server     Up
```

```bash
$ docker-compose -f docker-compose.quick-start.yml logs server | tail -5

noteum-server  | [Nest] 1  - 12/08/2024, 10:15:30 PM   LOG [NestApplication] Nest application successfully started +2ms
```

## 📞 支持

如果遇到问题：
1. 查看本文档的故障排除部分
2. 检查 `docker-compose.README.md` 详细文档
3. 查看服务日志获取详细错误信息

---

🎯 **当前状态**: 核心功能完全可用，适合日常开发使用！