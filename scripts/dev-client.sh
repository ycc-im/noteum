#!/bin/bash

# Noteum Client 开发启动脚本
# 单独启动 apps/client

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 端口配置
CLIENT_PORT=9158
SERVICES_PORT=9168

# 日志文件目录
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

echo -e "${BLUE}🌐 启动 Noteum Client...${NC}"
echo -e "${YELLOW}📋 配置信息:${NC}"
echo "  🌐 Client 端口: $CLIENT_PORT"
echo "  🔧 Services 端口: $SERVICES_PORT"
echo "  📝 日志目录: $LOG_DIR"
echo ""

# 检查端口冲突
if lsof -Pi :$CLIENT_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ 端口 $CLIENT_PORT 已被占用${NC}"
    echo -e "${YELLOW}💡 请停止占用该端口的服务或使用其他端口${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 端口 $CLIENT_PORT 可用${NC}"

# 检查 Services 是否运行
echo -e "${YELLOW}🔍 检查 Services 连接...${NC}"
if curl -s --max-time 3 "http://localhost:$SERVICES_PORT/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Services API 可访问${NC}"
else
    echo -e "${YELLOW}⚠️  Services API 不可访问，建议先启动 Services: pnpm dev:services${NC}"
    echo -e "${YELLOW}    继续启动 Client 可能会遇到连接问题${NC}"
    echo ""
    read -p "是否继续启动 Client? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}💡 请先运行: pnpm dev:services${NC}"
        exit 0
    fi
fi

echo ""

# 启动 Client
echo -e "${BLUE}🌐 启动 Client (React + Vite)...${NC}"
cd apps/client

# 启动客户端并记录日志
echo -e "${BLUE}🚀 启动 Client 服务...${NC}"
pnpm dev > "../../$LOG_DIR/client.log" 2>&1 &
CLIENT_PID=$!

echo -e "${GREEN}✅ Client 已启动 (PID: $CLIENT_PID)${NC}"
echo "   🌐 前端地址: http://localhost:$CLIENT_PORT"

cd ../..

# 保存 PID
echo "$CLIENT_PID" > "$LOG_DIR/client.pid"

echo ""
echo -e "${GREEN}🎉 Client 启动完成！${NC}"
echo ""
echo -e "${YELLOW}🌐 服务访问地址：${NC}"
echo "  🌐 Client Frontend: http://localhost:$CLIENT_PORT"
echo "  📊 Services API: http://localhost:$SERVICES_PORT"
echo ""
echo -e "${YELLOW}📊 管理命令：${NC}"
echo "  📋 查看服务状态: pnpm dev:health"
echo "  📝 查看日志: tail -f $LOG_DIR/client.log"
echo "  🛑 停止服务: pnpm dev:stop"
echo "  🔧 启动后端: pnpm dev:services"
echo ""
echo -e "${BLUE}💡 提示: 使用 Ctrl+C 可以停止脚本，但服务会继续在后台运行${NC}"