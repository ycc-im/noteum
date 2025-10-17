#!/bin/bash

# Noteum 开发环境服务重启脚本
# 仅重启后端服务 (NestJS + Prisma)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 重启 Noteum 后端服务...${NC}"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# PID 文件路径
SERVICES_PID_FILE="$PROJECT_ROOT/.pids/services.pid"

# 停止现有服务
if [ -f "$SERVICES_PID_FILE" ]; then
    echo -e "${YELLOW}🛑 停止现有 services 服务...${NC}"

    SERVICES_PID=$(cat "$SERVICES_PID_FILE")
    if ps -p $SERVICES_PID > /dev/null 2>&1; then
        kill -TERM $SERVICES_PID
        echo -e "${GREEN}✅ Services 进程已停止 (PID: $SERVICES_PID)${NC}"
    else
        echo -e "${YELLOW}⚠️  Services 进程不存在，清理 PID 文件${NC}"
    fi

    rm -f "$SERVICES_PID_FILE"
    sleep 2
else
    echo -e "${YELLOW}⚠️  未找到 services PID 文件，可能服务未运行${NC}"
fi

echo ""
echo -e "${YELLOW}🚀 重新启动 services 服务...${NC}"
echo ""

# 启动 services
cd "$PROJECT_ROOT/apps/services"
pnpm start:dev > "$PROJECT_ROOT/.logs/services.log" 2>&1 &
SERVICES_PID=$!

# 保存 PID
echo $SERVICES_PID > "$SERVICES_PID_FILE"

echo -e "${GREEN}✅ Services 服务已启动 (PID: $SERVICES_PID)${NC}"
echo -e "${BLUE}📋 日志文件: $PROJECT_ROOT/.logs/services.log${NC}"
echo ""

# 等待服务启动
echo -e "${YELLOW}⏳ 等待服务启动...${NC}"
sleep 5

# 检查服务状态
echo -e "${YELLOW}🔍 检查服务状态...${NC}"
if curl -s http://localhost:9168/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Services API (端口 9168) - 运行正常${NC}"
else
    echo -e "${RED}❌ Services API (端口 9168) - 启动失败${NC}"
    echo -e "${YELLOW}💡 请检查日志: tail -f $PROJECT_ROOT/.logs/services.log${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 后端服务重启完成！${NC}"