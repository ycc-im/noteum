#!/bin/bash

# Noteum Services 开发环境启动脚本
#
# 使用方法:
# ./start-dev.sh [all|core|tools]
#
# 参数说明:
# all   - 启动所有服务 (默认)
# core  - 只启动核心服务 (app, postgres, redis)
# tools - 启动核心服务 + 管理工具 (pgadmin, redis-commander)

set -e

PROJECT_NAME="noteum-services-dev"
SERVICES=${1:-"all"}

echo "🚀 启动 Noteum Services 开发环境..."
echo "📦 项目名称: $PROJECT_NAME"
echo "🔧 启动模式: $SERVICES"
echo ""

case $SERVICES in
  "core")
    echo "📋 启动核心服务..."
    docker-compose -p $PROJECT_NAME up -d postgres redis app
    ;;
  "tools")
    echo "📋 启动核心服务 + 管理工具..."
    docker-compose -p $PROJECT_NAME --profile tools up -d
    ;;
  "all"|*)
    echo "📋 启动所有服务..."
    docker-compose -p $PROJECT_NAME --profile tools up -d
    ;;
esac

echo ""
echo "⏳ 等待服务启动..."
sleep 8

echo ""
echo "🔍 检查服务状态..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep $PROJECT_NAME

echo ""
echo "📝 服务访问地址:"
echo "🌐 应用 API:        http://localhost:3000"
echo "📚 API 文档:        http://localhost:3000/docs"
echo "🐘 pgAdmin:         http://localhost:8080"
echo "🔴 Redis Commander: http://localhost:8081"
echo ""
echo "🔑 登录信息:"
echo "📧 pgAdmin:         admin@noteum.dev / admin"
echo "👤 测试账户:        admin@noteum.dev / admin123456"
echo ""
echo "✅ 开发环境启动完成！"