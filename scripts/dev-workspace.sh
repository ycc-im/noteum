#!/bin/bash

# Noteum 开发工作区启动脚本
# 并发启动 apps/services 和 apps/client

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 端口配置
SERVICES_PORT=9168
CLIENT_PORT=9158

# 日志文件目录
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

echo -e "${BLUE}🚀 启动 Noteum 开发工作区...${NC}"
echo -e "${YELLOW}📋 配置信息:${NC}"
echo "  🔧 Services 端口: $SERVICES_PORT"
echo "  🌐 Client 端口: $CLIENT_PORT"
echo "  📝 日志目录: $LOG_DIR"
echo ""

# 检查端口冲突
check_port() {
    local port=$1
    local service=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${RED}❌ 端口 $port 已被占用 ($service)${NC}"
        echo -e "${YELLOW}💡 请停止占用该端口的服务或使用其他端口${NC}"
        return 1
    else
        echo -e "${GREEN}✅ 端口 $port 可用 ($service)${NC}"
        return 0
    fi
}

# 检查所有端口
echo -e "${YELLOW}🔍 检查端口可用性...${NC}"
PORTS_OK=true

if ! check_port $SERVICES_PORT "Services"; then
    PORTS_OK=false
fi

if ! check_port $CLIENT_PORT "Client"; then
    PORTS_OK=false
fi

if [ "$PORTS_OK" = false ]; then
    echo -e "${RED}❌ 端口检查失败，请解决冲突后重试${NC}"
    exit 1
fi

echo ""

# 检查 Docker 容器是否运行
echo -e "${YELLOW}🐳 检查 Docker 开发环境...${NC}"
if ! docker-compose -f docker-compose.dev.yml -p noteum-dev ps --services --filter "status=running" | grep -q .; then
    echo -e "${YELLOW}⚠️  Docker 开发环境未运行，正在启动...${NC}"
    ./scripts/dev-start.sh
    echo -e "${GREEN}✅ Docker 开发环境已启动${NC}"
else
    echo -e "${GREEN}✅ Docker 开发环境已运行${NC}"
fi
echo ""

# 启动函数
start_services() {
    echo -e "${BLUE}🔧 启动 Services (NestJS)...${NC}"
    cd apps/services

    # 检查是否需要数据库迁移
    if [ ! -d "node_modules/.prisma" ] || [ ! -f "node_modules/@prisma/client/index.js" ]; then
        echo -e "${YELLOW}📦 生成 Prisma Client...${NC}"
        pnpm prisma:generate
    fi

    # 启动服务并记录日志
    pnpm start:dev > "../../$LOG_DIR/services.log" 2>&1 &
    SERVICES_PID=$!
    echo -e "${GREEN}✅ Services 已启动 (PID: $SERVICES_PID)${NC}"
    echo "   📊 API 地址: http://localhost:$SERVICES_PORT"

    cd ../..
}

start_client() {
    echo -e "${BLUE}🌐 启动 Client (React + Vite)...${NC}"
    cd apps/client

    # 启动客户端并记录日志
    pnpm dev > "../../$LOG_DIR/client.log" 2>&1 &
    CLIENT_PID=$!
    echo -e "${GREEN}✅ Client 已启动 (PID: $CLIENT_PID)${NC}"
    echo "   🌐 前端地址: http://localhost:$CLIENT_PORT"

    cd ../..
}

# 启动服务
echo -e "${YELLOW}🚀 启动开发服务...${NC}"

# 并发启动
start_services &
start_client &

# 等待启动完成
wait

echo ""
echo -e "${GREEN}🎉 所有服务已启动完成！${NC}"
echo ""
echo -e "${YELLOW}🌐 服务访问地址：${NC}"
echo "  📊 Services API: http://localhost:$SERVICES_PORT"
echo "  🌐 Client Frontend: http://localhost:$CLIENT_PORT"
echo ""
echo -e "${YELLOW}📊 管理命令：${NC}"
echo "  📋 查看服务状态: pnpm dev:health"
echo "  📝 查看日志 (tmux分屏): pnpm dev:log"
echo "  📝 查看日志 (单独): tail -f $LOG_DIR/services.log"
echo "  📝 查看日志 (单独): tail -f $LOG_DIR/client.log"
echo "  🛑 停止所有服务: pnpm dev:stop"
echo "  🔄 重启所有服务: pnpm dev:restart"
echo ""
echo -e "${BLUE}💡 提示: 使用 Ctrl+C 可以停止脚本，但服务会继续在后台运行${NC}"
echo -e "${BLUE}    使用 'pnpm dev:stop' 来停止所有后台服务${NC}"

# 保存 PID 到文件
echo "$SERVICES_PID" > "$LOG_DIR/services.pid"
echo "$CLIENT_PID" > "$LOG_DIR/client.pid"

# 等待用户中断
trap 'echo -e "\n${YELLOW}📋 脚本已停止，但服务继续运行${NC}"; echo -e "${YELLOW}    使用 \"pnpm dev:stop\" 来停止所有服务${NC}"; exit 0' INT

# 保持脚本运行
while true; do
    sleep 1
done