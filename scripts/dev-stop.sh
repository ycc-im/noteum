#!/bin/bash

# Noteum 开发环境停止脚本
# 项目: noteum-dev (开发环境)

set -e

echo "🛑 停止 Noteum 开发环境..."
echo "项目组: noteum-dev"
echo "配置文件: docker-compose.dev.yml"
echo ""

# 检查docker-compose文件是否存在
if [ ! -f "docker-compose.dev.yml" ]; then
    echo "❌ 找不到 docker-compose.dev.yml 文件"
    exit 1
fi

echo "📦 停止所有服务..."
docker-compose -f docker-compose.dev.yml -p noteum-dev down

echo ""
echo "🧹 清理未使用的镜像和容器..."
docker image prune -f
docker container prune -f

echo ""
echo "✅ 开发环境已停止！"
echo ""
echo "📊 查看容器状态："
echo "  docker ps -a | grep noteum-dev"
echo ""
echo "🌐 重新启动开发环境："
echo "  ./scripts/dev-start.sh"