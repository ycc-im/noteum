#!/bin/bash

# Noteum 开发环境停止脚本
# 停止所有开发服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志文件目录
LOG_DIR="./logs"

echo -e "${BLUE}🛑 停止 Noteum 开发环境...${NC}"
echo ""

# 停止进程函数
stop_process() {
    local service=$1
    local pid_file="$LOG_DIR/$service.pid"

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo -e "${YELLOW}🛑 停止 $service (PID: $pid)...${NC}"

            # 先发送 SIGTERM 信号
            kill -TERM $pid 2>/dev/null || true

            # 等待进程优雅退出
            local count=0
            while ps -p $pid > /dev/null 2>&1 && [ $count -lt 10 ]; do
                sleep 1
                count=$((count + 1))
                echo -n "."
            done
            echo ""

            # 如果进程仍在运行，强制终止
            if ps -p $pid > /dev/null 2>&1; then
                echo -e "${RED}⚠️  强制终止 $service...${NC}"
                kill -KILL $pid 2>/dev/null || true
                sleep 1
            fi

            echo -e "${GREEN}✅ $service 已停止${NC}"
        else
            echo -e "${YELLOW}⚠️  $service 进程已停止 (PID 文件存在但进程不存在)${NC}"
        fi

        # 删除 PID 文件
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠️  $service 未运行 (无 PID 文件)${NC}"
    fi
}

# 检查并停止通过端口运行的进程
stop_port_process() {
    local port=$1
    local service=$2

    local pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
        echo -e "${YELLOW}🛑 停止 $service (端口 $port, PID: $pid)...${NC}"

        # 先尝试优雅停止
        kill -TERM $pid 2>/dev/null || true

        # 等待进程退出
        local count=0
        while lsof -ti:$port >/dev/null 2>&1 && [ $count -lt 5 ]; do
            sleep 1
            count=$((count + 1))
            echo -n "."
        done
        echo ""

        # 如果仍在运行，强制终止
        if lsof -ti:$port >/dev/null 2>&1; then
            echo -e "${RED}⚠️  强制终止 $service...${NC}"
            kill -KILL $pid 2>/dev/null || true
        fi

        echo -e "${GREEN}✅ $service 已停止${NC}"
    else
        echo -e "${YELLOW}⚠️  $service 未在端口 $port 运行${NC}"
    fi
}

echo -e "${YELLOW}🔍 停止应用服务...${NC}"
echo ""

# 停止 services 和 client 进程
stop_process "services"
stop_process "client"

echo ""
echo -e "${YELLOW}🔍 检查并停止端口进程...${NC}"
echo ""

# 检查并停止特定端口的进程（备用清理）
stop_port_process 9168 "Services (端口 9168)"
stop_port_process 9158 "Client (端口 9158)"

echo ""
echo -e "${YELLOW}🧹 清理相关资源...${NC}"
echo ""

# 清理可能存在的 node 进程
echo -e "${BLUE}🔍 检查相关 Node.js 进程...${NC}"
NODE_PROCESSES=$(ps aux | grep -E "(node|pnpm|npm)" | grep -E "(vite|nest|start)" | grep -v grep || true)
if [ -n "$NODE_PROCESSES" ]; then
    echo -e "${YELLOW}发现相关的 Node.js 进程:${NC}"
    echo "$NODE_PROCESSES"
    echo ""
    read -p "是否停止这些进程? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$NODE_PROCESSES" | awk '{print $2}' | xargs -r kill -TERM 2>/dev/null || true
        sleep 2
        echo "$NODE_PROCESSES" | awk '{print $2}' | xargs -r kill -KILL 2>/dev/null || true
        echo -e "${GREEN}✅ 相关 Node.js 进程已停止${NC}"
    fi
else
    echo -e "${GREEN}✅ 未发现相关的 Node.js 进程${NC}"
fi

echo ""

# 清理临时文件
echo -e "${BLUE}🗑️  清理临时文件...${NC}"

# 清理可能的临时日志文件（保留最近7天）
if [ -d "$LOG_DIR" ]; then
    find "$LOG_DIR" -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
    echo -e "${GREEN}✅ 旧日志文件已清理${NC}"
else
    mkdir -p "$LOG_DIR"
    echo -e "${GREEN}✅ 日志目录已创建${NC}"
fi

# 清理可能的编译缓存
echo -e "${BLUE}🗑️  清理编译缓存...${NC}"

# 清理 apps 目录下的 .vite 和 dist 目录
for app_dir in apps/*/; do
    if [ -d "$app_dir" ]; then
        # 清理 Vite 缓存
        if [ -d "$app_dir/node_modules/.vite" ]; then
            rm -rf "$app_dir/node_modules/.vite" 2>/dev/null || true
            echo -e "${GREEN}✅ 清理 ${app_dir} Vite 缓存${NC}"
        fi

        # 清理构建输出
        if [ -d "$app_dir/dist" ]; then
            rm -rf "$app_dir/dist" 2>/dev/null || true
            echo -e "${GREEN}✅ 清理 ${app_dir} 构建输出${NC}"
        fi
    fi
done

echo ""
echo -e "${GREEN}🎉 开发环境已停止！${NC}"
echo ""

echo -e "${YELLOW}📊 后续操作建议：${NC}"
echo ""
echo -e "${BLUE}💡 如果要重新启动开发环境：${NC}"
echo "  🚀 启动所有服务: pnpm dev:workspace"
echo "  🔧 仅启动后端: pnpm dev:services"
echo "  🌐 仅启动前端: pnpm dev:client"
echo ""
echo -e "${BLUE}💡 如果要完全清理环境：${NC}"
echo "  🐳 停止 Docker 容器: pnpm docker:stop"
echo "  🗑️  清理所有依赖: pnpm clean"
echo "  📦 重新安装依赖: pnpm install"
echo ""
echo -e "${BLUE}💡 查看服务状态：${NC}"
echo "  🏥 健康检查: pnpm dev:health"

# 等待用户确认
echo ""
read -p "按 Enter 键继续..."