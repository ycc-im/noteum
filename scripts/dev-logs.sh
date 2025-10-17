#!/bin/bash

# Noteum 开发日志查看脚本
# 使用 tmux 分屏同时查看 services 和 client 日志

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志文件目录
LOG_DIR="./logs"
SERVICES_LOG="$LOG_DIR/services.log"
CLIENT_LOG="$LOG_DIR/client.log"

echo -e "${BLUE}📝 Noteum 开发日志查看器${NC}"

# 检查 tmux 是否安装
if ! command -v tmux &> /dev/null; then
    echo -e "${RED}❌ tmux 未安装${NC}"
    echo -e "${YELLOW}💡 请先安装 tmux：${NC}"
    echo "  macOS: brew install tmux"
    echo "  Ubuntu/Debian: sudo apt-get install tmux"
    echo "  CentOS/RHEL: sudo yum install tmux"
    exit 1
fi

# 检查日志文件是否存在
check_log_file() {
    local log_file=$1
    local service_name=$2

    if [ ! -f "$log_file" ]; then
        echo -e "${RED}❌ $service_name 日志文件不存在: $log_file${NC}"
        echo -e "${YELLOW}💡 请先启动开发服务: pnpm dev:workspace${NC}"
        return 1
    fi

    if [ ! -s "$log_file" ]; then
        echo -e "${YELLOW}⚠️  $service_name 日志文件为空: $log_file${NC}"
        echo -e "${YELLOW}💡 服务可能尚未开始输出日志${NC}"
    fi

    return 0
}

# 检查日志文件
echo -e "${YELLOW}🔍 检查日志文件...${NC}"
LOGS_OK=true

if ! check_log_file "$SERVICES_LOG" "Services"; then
    LOGS_OK=false
fi

if ! check_log_file "$CLIENT_LOG" "Client"; then
    LOGS_OK=false
fi

if [ "$LOGS_OK" = false ]; then
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 日志文件检查通过${NC}"

# 检查是否已经在 tmux session 中
if [ -n "$TMUX" ]; then
    echo -e "${YELLOW}⚠️  检测到已在 tmux session 中${NC}"
    echo -e "${YELLOW}💡 建议在 tmux 外部运行此脚本以创建新的日志查看 session${NC}"
    echo -e "${BLUE}🔄 是否继续？(y/N): ${NC}"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}❌ 已取消${NC}"
        exit 0
    fi
fi

# 创建新的 tmux session
SESSION_NAME="noteum-logs"

# 检查 session 是否已存在
if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  tmux session '$SESSION_NAME' 已存在${NC}"
    echo -e "${YELLOW}💡 是否关闭现有 session 并创建新的？(y/N): ${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        tmux kill-session -t "$SESSION_NAME"
        echo -e "${GREEN}✅ 已关闭现有 session${NC}"
    else
        echo -e "${YELLOW}💡 连接到现有 session...${NC}"
        tmux attach-session -t "$SESSION_NAME"
        exit 0
    fi
fi

echo -e "${BLUE}🚀 创建 tmux session: $SESSION_NAME${NC}"

# 创建新的 tmux session
tmux new-session -d -s "$SESSION_NAME"

# 创建水平分屏
tmux split-window -h -t "$SESSION_NAME"

# 在左侧面板显示 services 日志
tmux send-keys -t "$SESSION_NAME:0.0" "echo -e '${BLUE}🔧 Services 日志${NC}'" Enter
tmux send-keys -t "$SESSION_NAME:0.0" "tail -f '$SERVICES_LOG'" Enter

# 在右侧面板显示 client 日志
tmux send-keys -t "$SESSION_NAME:0.1" "echo -e '${BLUE}🌐 Client 日志${NC}'" Enter
tmux send-keys -t "$SESSION_NAME:0.1" "tail -f '$CLIENT_LOG'" Enter

# 设置面板标题
tmux select-pane -t "$SESSION_NAME:0.0" -T "Services"
tmux select-pane -t "$SESSION_NAME:0.1" -T "Client"

# 同步滚动（可选）
# tmux setw -t "$SESSION_NAME" synchronize-panes on

echo -e "${GREEN}✅ tmux session 已创建${NC}"
echo ""
echo -e "${YELLOW}📋 使用说明：${NC}"
echo "  🖱️  使用鼠标或方向键在面板间切换"
echo "  🔍 Ctrl+B 然后按方向键切换面板"
echo "  📜 Ctrl+B 然后按 [ 进入滚动模式"
echo "  🚪 Ctrl+B 然后按 d 退出 session (服务继续运行)"
echo "  🛑 Ctrl+B 然后按 & 退出整个 session"
echo ""
echo -e "${BLUE}🚀 正在连接到 tmux session...${NC}"

# 连接到 tmux session
tmux attach-session -t "$SESSION_NAME"