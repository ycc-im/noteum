#!/bin/bash

# Noteum 开发环境启动脚本
# 项目: noteum-dev (开发环境)

set -e

echo "🚀 启动 Noteum 开发环境..."
echo "项目组: noteum-dev"
echo "配置文件: docker-compose.dev.yml"
echo ""

# 检查Docker是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查docker-compose文件是否存在
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ 找不到 docker-compose.dev.yml 文件"
    exit 1
fi

echo "📦 启动所有服务..."
docker-compose -f docker-compose.dev.yml -p noteum-dev up -d

echo ""
echo "✅ 开发环境启动完成！"
echo ""
echo "🌐 服务访问地址："
echo "  📊 PostgreSQL: localhost:9198"
echo "  🗄️  Redis: localhost:9178"
echo "  🛠️  PgAdmin: http://localhost:9188"
echo "    - 用户名: admin@noteum.dev"
echo "    - 密码: admin123"
echo "  🔧 Backend API: http://localhost:9168"
echo "  📱 Frontend: http://localhost:9158"
echo ""
echo "📊 查看服务状态："
docker-compose -f docker-compose.dev.yml -p noteum-dev ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "📝 查看日志："
echo "  docker-compose -f docker-compose.dev.yml -p noteum-dev logs -f"
echo ""
echo "🛑 停止开发环境："
echo "  ./scripts/dev-stop.sh"
echo "  或: docker-compose -f docker-compose.dev.yml -p noteum-dev down"