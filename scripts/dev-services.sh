#!/bin/bash

# Noteum Services 开发启动脚本
# 单独启动 apps/services

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 端口配置
SERVICES_PORT=9168

# 日志文件目录
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

echo -e "${BLUE}🔧 启动 Noteum Services...${NC}"
echo -e "${YELLOW}📋 配置信息:${NC}"
echo "  🔧 Services 端口: $SERVICES_PORT"
echo "  📝 日志目录: $LOG_DIR"
echo ""

# 检查端口冲突
if lsof -Pi :$SERVICES_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${RED}❌ 端口 $SERVICES_PORT 已被占用${NC}"
    echo -e "${YELLOW}💡 请停止占用该端口的服务或使用其他端口${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 端口 $SERVICES_PORT 可用${NC}"
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

# 启动 Services
echo -e "${BLUE}🔧 启动 Services (NestJS)...${NC}"
cd apps/services

# 检查是否需要数据库迁移
if [ ! -d "node_modules/.prisma" ] || [ ! -f "node_modules/@prisma/client/index.js" ]; then
    echo -e "${YELLOW}📦 生成 Prisma Client...${NC}"
    pnpm prisma:generate
fi

# 检查数据库连接
echo -e "${YELLOW}🔍 检查数据库连接...${NC}"
if pnpm db:health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 数据库连接正常${NC}"
else
    echo -e "${YELLOW}⚠️  数据库连接异常，尝试重新连接...${NC}"
    pnpm db:setup
fi

# 启动服务并记录日志
echo -e "${BLUE}🚀 启动 Services 服务...${NC}"
pnpm start:dev > "../../$LOG_DIR/services.log" 2>&1 &
SERVICES_PID=$!

echo -e "${GREEN}✅ Services 已启动 (PID: $SERVICES_PID)${NC}"
echo "   📊 API 地址: http://localhost:$SERVICES_PORT"

cd ../..

# 保存 PID
echo "$SERVICES_PID" > "$LOG_DIR/services.pid"

echo ""
echo -e "${GREEN}🎉 Services 启动完成！${NC}"
echo ""
echo -e "${YELLOW}🌐 服务访问地址：${NC}"
echo "  📊 Services API: http://localhost:$SERVICES_PORT"
echo ""
echo -e "${YELLOW}📊 管理命令：${NC}"
echo "  📋 查看服务状态: pnpm dev:health"
echo "  📝 查看日志: tail -f $LOG_DIR/services.log"
echo "  🛑 停止服务: pnpm dev:stop"
echo "  🌐 启动客户端: pnpm dev:client"
echo ""
echo -e "${BLUE}💡 提示: 使用 Ctrl+C 可以停止脚本，但服务会继续在后台运行${NC}"