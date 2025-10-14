# Makefile for Noteum Development and Deployment

.PHONY: help dev prod build clean test logs db-migrate db-seed backup restore

# 默认目标
help:
	@echo "Noteum 开发和部署命令:"
	@echo ""
	@echo "开发环境:"
	@echo "  dev         - 启动开发环境"
	@echo "  dev-stop    - 停止开发环境"
	@echo "  dev-logs    - 查看开发环境日志"
	@echo ""
	@echo "生产环境:"
	@echo "  prod        - 启动生产环境"
	@echo "  prod-stop   - 停止生产环境"
	@echo "  prod-logs   - 查看生产环境日志"
	@echo ""
	@echo "构建和测试:"
	@echo "  build       - 构建所有服务"
	@echo "  test        - 运行测试"
	@echo "  lint        - 代码检查"
	@echo "  clean       - 清理 Docker 资源"
	@echo ""
	@echo "数据库操作:"
	@echo "  db-migrate  - 运行数据库迁移"
	@echo "  db-seed     - 填充测试数据"
	@echo "  db-reset    - 重置数据库"
	@echo ""
	@echo "备份和恢复:"
	@echo "  backup      - 备份数据库"
	@echo "  restore     - 恢复数据库"

# 开发环境命令
dev:
	@echo "🚀 启动开发环境..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "✅ 开发环境已启动"
	@echo "📝 NestJS 服务: http://localhost:3000"
	@echo "🎨 客户端应用: http://localhost:5173"
	@echo "🗄️  数据库管理: http://localhost:8080"
	@echo "🔴 Redis 管理: http://localhost:8081"

dev-stop:
	@echo "🛑 停止开发环境..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ 开发环境已停止"

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# 生产环境命令
prod:
	@echo "🚀 启动生产环境..."
	cp .env.production .env
	docker-compose -f docker-compose.prod.yml up -d
	@echo "✅ 生产环境已启动"
	@echo "📊 监控面板: http://localhost:3001 (Grafana)"
	@echo "📈 指标监控: http://localhost:9090 (Prometheus)"

prod-stop:
	@echo "🛑 停止生产环境..."
	docker-compose -f docker-compose.prod.yml down
	@echo "✅ 生产环境已停止"

prod-logs:
	docker-compose -f docker-compose.prod.yml logs -f

# 构建和测试
build:
	@echo "🔨 构建所有服务..."
	docker-compose -f docker-compose.prod.yml build
	@echo "✅ 构建完成"

test:
	@echo "🧪 运行测试..."
	docker-compose -f docker-compose.dev.yml exec nestjs-service pnpm test

lint:
	@echo "🔍 代码检查..."
	docker-compose -f docker-compose.dev.yml exec nestjs-service pnpm lint

clean:
	@echo "🧹 清理 Docker 资源..."
	docker-compose -f docker-compose.dev.yml down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f
	@echo "✅ 清理完成"

# 数据库操作
db-migrate:
	@echo "📊 运行数据库迁移..."
	docker-compose -f docker-compose.dev.yml exec nestjs-service pnpm migration:run

db-seed:
	@echo "🌱 填充测试数据..."
	docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d noteum_dev -f /docker-entrypoint-initdb.d/init-db.sql

db-reset:
	@echo "🔄 重置数据库..."
	docker-compose -f docker-compose.dev.yml down postgres
	docker volume rm noteum_postgres_data_dev || true
	docker-compose -f docker-compose.dev.yml up -d postgres
	@sleep 5
	$(MAKE) db-seed

# 备份和恢复
backup:
	@echo "💾 备份数据库..."
	mkdir -p backups
	docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U ${DATABASE_USER} ${DATABASE_NAME} > backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ 备份完成"

restore:
	@echo "🔄 恢复数据库..."
	@read -p "请输入备份文件路径: " backup_file; \
	docker-compose -f docker-compose.prod.yml exec -T postgres psql -U ${DATABASE_USER} ${DATABASE_NAME} < $$backup_file
	@echo "✅ 恢复完成"

# 开发者工具
shell:
	@echo "🐚 进入 NestJS 服务容器..."
	docker-compose -f docker-compose.dev.yml exec nestjs-service sh

db-shell:
	@echo "🗄️  进入数据库容器..."
	docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d noteum_dev

# 初始化项目
init:
	@echo "🎯 初始化项目..."
	cp .env.example .env
	docker-compose -f docker-compose.dev.yml up -d postgres redis
	@sleep 10
	$(MAKE) db-seed
	@echo "✅ 项目初始化完成"