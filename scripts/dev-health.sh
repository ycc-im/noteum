#!/bin/bash

# Noteum 开发环境健康检查脚本
# 检查所有开发服务的状态

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
POSTGRES_PORT=9198
REDIS_PORT=9178
PGADMIN_PORT=9188
REDIS_COMMANDER_PORT=9189

# 日志文件目录
LOG_DIR="./logs"

echo -e "${BLUE}🏥 Noteum 开发环境健康检查${NC}"
echo -e "${BLUE}===================================${NC}"
echo ""

# 检查端口是否在监听
check_port() {
    local port=$1
    local service=$2
    local url=$3

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${GREEN}✅ $service (端口 $port)${NC}"
        if [ -n "$url" ]; then
            echo "   🌐 $url"
        fi
        return 0
    else
        echo -e "${RED}❌ $service (端口 $port) - 未运行${NC}"
        return 1
    fi
}

# 检查服务进程
check_process() {
    local service=$1
    local pid_file="$LOG_DIR/$service.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $service 进程运行中 (PID: $pid)${NC}"
            return 0
        else
            echo -e "${RED}❌ $service 进程已停止 (PID 文件存在但进程不存在)${NC}"
            rm -f "$pid_file"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  $service 进程未启动 (无 PID 文件)${NC}"
        return 1
    fi
}

# 检查 Docker 容器
check_docker_container() {
    local container=$1
    local service=$2

    if docker-compose -f docker-compose.dev.yml -p noteum-dev ps $container | grep -q "Up"; then
        echo -e "${GREEN}✅ $service Docker 容器运行中${NC}"
        return 0
    else
        echo -e "${RED}❌ $service Docker 容器未运行${NC}"
        return 1
    fi
}

# 测试 HTTP 响应
test_http_response() {
    local url=$1
    local service=$2
    local timeout=${3:-5}

    if curl -s --max-time $timeout "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service HTTP 响应正常${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $service HTTP 响应异常${NC}"
        return 1
    fi
}

echo -e "${YELLOW}🔍 检查应用服务...${NC}"
echo ""

# 检查 Services API
if check_port $SERVICES_PORT "Services API" "http://localhost:$SERVICES_PORT"; then
    test_http_response "http://localhost:$SERVICES_PORT/health" "Services API"
fi

echo ""

# 检查 Client Frontend
if check_port $CLIENT_PORT "Client Frontend" "http://localhost:$CLIENT_PORT"; then
    test_http_response "http://localhost:$CLIENT_PORT" "Client Frontend"
fi

echo ""
echo -e "${YELLOW}🔍 检查进程状态...${NC}"
echo ""

# 检查进程
check_process "services"
check_process "client"

echo ""
echo -e "${YELLOW}🔍 检查 Docker 基础设施...${NC}"
echo ""

# 检查 Docker 服务
check_docker_container "postgres" "PostgreSQL"
check_port $POSTGRES_PORT "PostgreSQL"

check_docker_container "redis" "Redis"
check_port $REDIS_PORT "Redis"

check_docker_container "pgadmin" "PgAdmin"
check_port $PGADMIN_PORT "PgAdmin" "http://localhost:$PGADMIN_PORT"

check_docker_container "redis-commander" "Redis Commander"
check_port $REDIS_COMMANDER_PORT "Redis Commander" "http://localhost:$REDIS_COMMANDER_PORT"

echo ""
echo -e "${YELLOW}📊 系统资源使用情况...${NC}"
echo ""

# 检查磁盘空间
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 80 ]; then
    echo -e "${GREEN}✅ 磁盘空间: ${DISK_USAGE}% 使用${NC}"
elif [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "${YELLOW}⚠️  磁盘空间: ${DISK_USAGE}% 使用${NC}"
else
    echo -e "${RED}❌ 磁盘空间: ${DISK_USAGE}% 使用 (空间不足)${NC}"
fi

# 检查内存使用
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.1f", $3/$2 * 100.0)}')
echo -e "${GREEN}📊 内存使用: ${MEMORY_USAGE}%${NC}"

echo ""
echo -e "${YELLOW}📝 日志文件状态...${NC}"
echo ""

# 检查日志文件
if [ -d "$LOG_DIR" ]; then
    for log_file in "$LOG_DIR"/*.log; do
        if [ -f "$log_file" ]; then
            local file_size=$(du -h "$log_file" | cut -f1)
            local file_name=$(basename "$log_file")
            echo -e "${GREEN}📋 $file_name: $file_size${NC}"
        fi
    done
else
    echo -e "${YELLOW}⚠️  日志目录不存在: $LOG_DIR${NC}"
fi

echo ""
echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}🏥 健康检查完成${NC}"
echo ""

# 提供快速操作建议
echo -e "${YELLOW}💡 快速操作建议：${NC}"
echo ""

# 检查服务是否需要启动
if ! check_process "services" > /dev/null 2>&1; then
    echo "  🔧 启动 Services: pnpm dev:services"
fi

if ! check_process "client" > /dev/null 2>&1; then
    echo "  🌐 启动 Client: pnpm dev:client"
fi

if ! check_docker_container "postgres" > /dev/null 2>&1; then
    echo "  🐳 启动 Docker 环境: pnpm docker:start"
fi

echo ""
echo -e "${YELLOW}🔧 管理命令：${NC}"
echo "  🚀 启动所有服务: pnpm dev:workspace"
echo "  🛑 停止所有服务: pnpm dev:stop"
echo "  🔄 重启所有服务: pnpm dev:restart"
echo "  📋 查看实时日志: tail -f $LOG_DIR/services.log"
echo "  📋 查看实时日志: tail -f $LOG_DIR/client.log"