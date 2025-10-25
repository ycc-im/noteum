#!/bin/bash

echo "🚀 启动消息中间件可视化测试控制台"
echo "================================"

# 检查服务是否运行
echo "🔍 检查服务状态..."

# 检查 Redis 是否运行
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis 服务未运行，正在启动..."
    docker-compose -f docker-compose.dev.yml up -d redis redis-commander
    sleep 5
else
    echo "✅ Redis 服务正在运行"
fi

# 启动后端服务
echo "🔧 启动后端服务..."
cd "$(dirname "$0")/.."
pnpm dev:services &
SERVICES_PID=$!

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 启动前端应用
echo "🌐 启动前端应用..."
pnpm dev:client &
CLIENT_PID=$!

# 等待前端启动
echo "⏳ 等待前端启动..."
sleep 15

# 检查端口
echo ""
echo "📋 服务信息:"
echo "🔧 后端服务: http://localhost:9168"
echo "🌐 前端应用: http://localhost:9158"
echo "📚 API 文档: http://localhost:9168/docs"
echo "🎯 测试控制台: http://localhost:9158/messaging-test"
echo ""

# 打开浏览器
if command -v open > /dev/null; then
    echo "🌍 正在打开浏览器..."
    sleep 2
    open "http://localhost:9158/messaging-test"
elif command -v xdg-open > /dev/null; then
    echo "🌍 正在打开浏览器..."
    sleep 2
    xdg-open "http://localhost:9158/messaging-test"
fi

echo ""
echo "✅ 所有服务已启动！"
echo "💡 按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $SERVICES_PID $CLIENT_PID 2>/dev/null; exit" INT
wait