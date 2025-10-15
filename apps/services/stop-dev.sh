#!/bin/bash

# Noteum Services 开发环境停止脚本
#
# 使用方法:
# ./stop-dev.sh [all|core|tools]
#
# 参数说明:
# all   - 停止所有服务 (默认)
# core  - 只停止核心服务 (app, postgres, redis)
# tools - 停止管理工具 (pgadmin, redis-commander)

set -e

PROJECT_NAME="noteum-services-dev"
SERVICES=${1:-"all"}

echo "🛑 停止 Noteum Services 开发环境..."
echo "📦 项目名称: $PROJECT_NAME"
echo "🔧 停止模式: $SERVICES"
echo ""

case $SERVICES in
  "core")
    echo "📋 停止核心服务..."
    docker-compose -p $PROJECT_NAME stop app postgres redis
    ;;
  "tools")
    echo "📋 停止管理工具..."
    docker-compose -p $PROJECT_NAME --profile tools stop pgadmin redis-commander
    ;;
  "all"|*)
    echo "📋 停止所有服务..."
    docker-compose -p $PROJECT_NAME --profile tools down
    ;;
esac

echo ""
echo "✅ 开发环境已停止！"