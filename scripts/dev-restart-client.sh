#!/bin/bash

# Noteum 开发环境客户端重启脚本
# 仅重启前端应用 (React + Vite)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 重启 Noteum 前端应用...${NC}"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# PID 文件路径
CLIENT_PID_FILE="$PROJECT_ROOT/.pids/client.pid"

# 停止现有客户端
if [ -f "$CLIENT_PID_FILE" ]; then
    echo -e "${YELLOW}🛑 停止现有 client 应用...${NC}"

    CLIENT_PID=$(cat "$CLIENT_PID_FILE")
    if ps -p $CLIENT_PID > /dev/null 2>&1; then
        kill -TERM $CLIENT_PID
        echo -e "${GREEN}✅ Client 进程已停止 (PID: $CLIENT_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Client 进程不存在，清理 PID 文件${NC}"
    fi

    rm -f "$CLIENT_PID_FILE"
    sleep 2
else
    echo -e "${YELLOW}⚠️  未找到 client PID 文件，可能应用未运行${NC}"
fi

echo ""
echo -e "${YELLOW}🚀 重新启动 client 应用...${NC}"
echo ""

# 启动 client
cd "$PROJECT_ROOT/apps/client"
pnpm dev > "$PROJECT_ROOT/.logs/client.log" 2>&1 &
CLIENT_PID=$!

# 保存 PID
echo $CLIENT_PID > "$CLIENT_PID_FILE"

echo -e "${GREEN}✅ Client 应用已启动 (PID: $CLIENT_PID)${NC}"
echo -e "${BLUE}📋 日志文件: $PROJECT_ROOT/.logs/client.log${NC}"
echo ""

# 等待应用启动
echo -e "${YELLOW}⏳ 等待应用启动...${NC}"
sleep 8

# 检查应用状态
echo -e "${YELLOW}🔍 检查应用状态...${NC}"
if curl -s http://localhost:9158 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Client Frontend (端口 9158) - 运行正常${NC}"
else
    echo -e "${RED}❌ Client Frontend (端口 9158) - 启动失败${NC}"
    echo -e "${YELLOW}💡 请检查日志: tail -f $PROJECT_ROOT/.logs/client.log${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 前端应用重启完成！${NC}"