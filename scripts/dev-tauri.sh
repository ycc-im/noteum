#!/bin/bash

# Noteum Tauri 开发启动脚本
# 假设后端服务和 Web 客户端已经在运行，仅启动 Tauri 桌面应用

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
TAURI_PORT=${TAURI_PORT:-1437}

# 日志文件目录
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

echo -e "${BLUE}🚀 启动 Tauri 桌面应用...${NC}"
echo -e "${YELLOW}📋 配置信息:${NC}"
echo "  🔧 Services 端口: $SERVICES_PORT"
echo "  🌐 Web Client 端口: $CLIENT_PORT"
echo "  🖥️  Tauri 应用端口: $TAURI_PORT"
echo "  📝 日志目录: $LOG_DIR"
echo ""

# 检查前置服务状态
check_prerequisites() {
    echo -e "${YELLOW}🔍 检查前置服务状态...${NC}"

    # 检查 Services 是否运行
    if lsof -Pi :$SERVICES_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Services 正在运行 (端口 $SERVICES_PORT)${NC}"
    else
        echo -e "  ${RED}❌ Services 未运行 (端口 $SERVICES_PORT)${NC}"
        echo -e "  ${YELLOW}💡 请先运行 'pnpm dev:workspace' 或 'pnpm dev:services'${NC}"
        return 1
    fi

    # 检查 Web Client 是否运行
    if lsof -Pi :$CLIENT_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Web Client 正在运行 (端口 $CLIENT_PORT)${NC}"
    else
        echo -e "  ${RED}❌ Web Client 未运行 (端口 $CLIENT_PORT)${NC}"
        echo -e "  ${YELLOW}💡 请先运行 'pnpm dev:workspace' 或 'pnpm dev:client'${NC}"
        return 1
    fi

    # 检查 Web Client HTTP 响应
    if curl -s --max-time 5 http://localhost:$CLIENT_PORT >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Web Client HTTP 响应正常${NC}"
    else
        echo -e "  ${YELLOW}⚠️  Web Client HTTP 响应异常，但继续尝试${NC}"
    fi

    echo ""
    return 0
}

# 检查 Tauri 环境
check_tauri_environment() {
    echo -e "${YELLOW}🔍 检查 Tauri 开发环境...${NC}"

    # 检查 Rust 环境
    if command -v rustc &> /dev/null; then
        RUST_VERSION=$(rustc --version | cut -d' ' -f2)
        echo -e "  ${GREEN}✅ Rust: $RUST_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Rust 未安装${NC}"
        echo -e "    请访问 https://rustup.rs/ 安装 Rust"
        exit 1
    fi

    # 检查 Tauri 项目配置
    if [ -f "apps/client/src-tauri/Cargo.toml" ]; then
        echo -e "  ${GREEN}✅ Tauri 项目配置存在${NC}"
    else
        echo -e "  ${RED}❌ Tauri 项目配置缺失${NC}"
        echo -e "    请确保 apps/client/src-tauri/Cargo.toml 存在"
        exit 1
    fi

    echo ""
}

# 启动 Tauri 应用
start_tauri_app() {
    echo -e "${BLUE}🖥️  启动 Tauri Desktop Application...${NC}"
    cd apps/client

    # 确保 Tauri 依赖已安装
    if [ ! -d "src-tauri/target" ]; then
        echo -e "${YELLOW}📦 首次运行，正在构建 Tauri 依赖...${NC}"
        cargo build --manifest-path src-tauri/Cargo.toml
    fi

    # 检查是否有其他 Tauri 进程在运行
    if pgrep -f "tauri.*dev" >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  检测到其他 Tauri 开发进程正在运行${NC}"
        echo -e "  ${YELLOW}💡 将尝试停止现有进程${NC}"
        pkill -f "tauri.*dev" || true
        sleep 2
    fi

    # 启动 Tauri 应用并记录日志
    echo -e "${BLUE}🚀 启动 Tauri 开发模式...${NC}"
    pnpm tauri:dev > "../../$LOG_DIR/tauri.log" 2>&1 &
    TAURI_PID=$!

    # 等待 Tauri 应用启动
    sleep 3

    # 检查 Tauri 进程是否成功启动
    if ps -p $TAURI_PID > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Tauri Application 已启动 (PID: $TAURI_PID)${NC}"
        echo "   🖥️  桌面应用正在启动中..."
        echo "   📝 查看日志: tail -f $LOG_DIR/tauri.log"
    else
        echo -e "${RED}❌ Tauri Application 启动失败${NC}"
        echo -e "  ${YELLOW}📋 查看错误日志:${NC}"
        cat "../../$LOG_DIR/tauri.log"
        exit 1
    fi

    cd ../..
}

# 主执行流程
main() {
    # 检查前置条件
    if ! check_prerequisites; then
        exit 1
    fi

    # 检查 Tauri 环境
    check_tauri_environment

    # 启动 Tauri 应用
    start_tauri_app

    echo ""
    echo -e "${GREEN}🎉 Tauri 桌面应用启动完成！${NC}"
    echo ""
    echo -e "${YELLOW}🌐 服务状态：${NC}"
    echo "  📊 Services API: http://localhost:$SERVICES_PORT"
    echo "  🌐 Web Client Dev: http://localhost:$CLIENT_PORT"
    echo "  🖥️  Tauri 应用: 桌面应用已启动"
    echo ""
    echo -e "${YELLOW}📊 Tauri 管理命令：${NC}"
    echo "  📝 查看 Tauri 日志: tail -f $LOG_DIR/tauri.log"
    echo "  🧪 运行 Tauri 测试: pnpm test:tauri"
    echo "  🏥 Tauri 健康检查: ./scripts/tauri-health.sh"
    echo "  🛑 停止 Tauri: pkill -f 'tauri.*dev'"
    echo ""
    echo -e "${BLUE}💡 提示:${NC}"
    echo "  - 桌面应用将在单独的窗口中打开"
    echo "  - 使用 Ctrl+C 可以停止此脚本，但桌面应用会继续运行"
    echo "  - 使用 'pkill -f tauri.*dev' 来停止 Tauri 应用"

    # 保存 PID 到文件
    echo "$TAURI_PID" > "$LOG_DIR/tauri.pid"

    # 等待用户中断
    trap 'echo -e "\n${YELLOW}📋 监控脚本已停止，Tauri 应用继续运行${NC}"; echo -e "${YELLOW}💡 使用 '\''pkill -f tauri.*dev'\'' 来停止 Tauri 应用${NC}"; exit 0' INT

    # 监控 Tauri 进程状态
    while true; do
        if ! ps -p $TAURI_PID > /dev/null 2>&1; then
            echo -e "${RED}❌ Tauri 应用已停止${NC}"
            exit 1
        fi
        sleep 5
    done
}

# 处理命令行参数
case "${1:-}" in
    --check-only)
        check_prerequisites
        check_tauri_environment
        echo -e "${GREEN}✅ 所有检查通过，可以启动 Tauri 应用${NC}"
        exit 0
        ;;
    --help)
        echo "用法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  --check-only   仅检查前置条件，不启动应用"
        echo "  --help         显示此帮助信息"
        echo ""
        echo "说明:"
        echo "  此脚本假设后端服务和 Web 客户端已经在运行"
        echo "  如果需要启动完整环境，请使用 'pnpm dev:workspace'"
        exit 0
        ;;
    "")
        main
        ;;
    *)
        echo -e "${RED}❌ 未知选项: $1${NC}"
        echo "使用 --help 查看可用选项"
        exit 1
        ;;
esac