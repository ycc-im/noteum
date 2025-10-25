#!/bin/bash

echo "🚀 打开消息中间件测试控制台"
echo "================================"

CLIENT_URL="http://localhost:9158/messaging-test"

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$CLIENT_URL"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open > /dev/null; then
        xdg-open "$CLIENT_URL"
    elif command -v gnome-open > /dev/null; then
        gnome-open "$CLIENT_URL"
    else
        echo "请手动在浏览器中打开: $CLIENT_URL"
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "$CLIENT_URL"
else
    echo "请手动在浏览器中打开: $CLIENT_URL"
fi

echo "✅ 测试控制台已打开!"
echo ""
echo "📋 访问信息:"
echo "🌐 测试控制台: $CLIENT_URL"
echo "🔧 后端API: http://localhost:9168/api/v1"
echo "📚 API文档: http://localhost:9168/docs"
echo ""
echo "💡 如果页面无法访问，请确保服务已启动:"
echo "   pnpm dev:services  # 启动后端"
echo "   pnpm dev:client   # 启动前端"