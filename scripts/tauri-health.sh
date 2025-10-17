#!/bin/bash

# Tauri 应用健康检查脚本
# 检查 Tauri 开发环境和运行状态

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

echo -e "${BLUE}🏥 Tauri 应用健康检查${NC}"
echo ""

# 检查函数
check_service() {
    local name=$1
    local port=$2
    local url=$3

    echo -e "${YELLOW}🔍 检查 $name...${NC}"

    # 检查端口占用
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ 端口 $port 已占用 (服务正在运行)${NC}"

        # 如果提供了 URL，进行 HTTP 检查
        if [ -n "$url" ]; then
            if curl -s --max-time 5 "$url" >/dev/null 2>&1; then
                echo -e "  ${GREEN}✅ HTTP 响应正常${NC}"
            else
                echo -e "  ${YELLOW}⚠️  HTTP 响应异常${NC}"
            fi
        fi
    else
        echo -e "  ${RED}❌ 端口 $port 未占用 (服务未运行)${NC}"
    fi

    echo ""
}

# 检查系统依赖
check_dependencies() {
    echo -e "${YELLOW}🔍 检查系统依赖...${NC}"

    # 检查 Rust
    if command -v rustc &> /dev/null; then
        RUST_VERSION=$(rustc --version | cut -d' ' -f2)
        echo -e "  ${GREEN}✅ Rust: $RUST_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Rust 未安装${NC}"
        echo -e "    请访问 https://rustup.rs/ 安装 Rust"
    fi

    # 检查 Cargo
    if command -v cargo &> /dev/null; then
        CARGO_VERSION=$(cargo --version | cut -d' ' -f2)
        echo -e "  ${GREEN}✅ Cargo: $CARGO_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Cargo 未安装${NC}"
    fi

    # 检查 Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "  ${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Node.js 未安装${NC}"
    fi

    # 检查 pnpm
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version)
        echo -e "  ${GREEN}✅ pnpm: $PNPM_VERSION${NC}"
    else
        echo -e "  ${RED}❌ pnpm 未安装${NC}"
    fi

    # 检查 Tauri CLI
    if command -v pnpm tauri --version &> /dev/null; then
        TAURI_VERSION=$(cd apps/client && pnpm tauri --version 2>/dev/null | head -1)
        echo -e "  ${GREEN}✅ Tauri CLI: $TAURI_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Tauri CLI 未安装${NC}"
        echo -e "    请运行: pnpm add @tauri-apps/cli --save-dev"
    fi

    echo ""
}

# 检查 Tauri 项目结构
check_project_structure() {
    echo -e "${YELLOW}🔍 检查 Tauri 项目结构...${NC}"

    # 检查关键文件
    local files=(
        "apps/client/src-tauri/Cargo.toml:Tauri 项目配置"
        "apps/client/src-tauri/tauri.conf.json:Tauri 应用配置"
        "apps/client/src-tauri/src/main.rs:Tauri 主程序"
        "apps/client/src-tauri/build.rs:构建脚本"
    )

    for file_info in "${files[@]}"; do
        local file=$(echo "$file_info" | cut -d':' -f1)
        local description=$(echo "$file_info" | cut -d':' -f2)

        if [ -f "$file" ]; then
            echo -e "  ${GREEN}✅ $description${NC}"
        else
            echo -e "  ${RED}❌ $description (缺失: $file)${NC}"
        fi
    done

    echo ""
}

# 检查进程状态
check_processes() {
    echo -e "${YELLOW}🔍 检查相关进程...${NC}"

    # 检查 Node.js 进程
    local node_processes=$(pgrep -f "node" | wc -l)
    if [ "$node_processes" -gt 0 ]; then
        echo -e "  ${GREEN}✅ Node.js 进程: $node_processes${NC}"
    else
        echo -e "  ${RED}❌ 没有运行中的 Node.js 进程${NC}"
    fi

    # 检查 Rust/Tauri 进程
    local rust_processes=$(pgrep -f "tauri\|noteum" | wc -l)
    if [ "$rust_processes" -gt 0 ]; then
        echo -e "  ${GREEN}✅ Rust/Tauri 进程: $rust_processes${NC}"
    else
        echo -e "  ${YELLOW}⚠️  没有运行中的 Rust/Tauri 进程${NC}"
    fi

    echo ""
}

# 检查日志文件
check_logs() {
    echo -e "${YELLOW}🔍 检查日志文件...${NC}"

    local log_dir="./logs"
    if [ -d "$log_dir" ]; then
        local log_files=$(find "$log_dir" -name "*tauri*" -type f | wc -l)
        if [ "$log_files" -gt 0 ]; then
            echo -e "  ${GREEN}✅ Tauri 日志文件: $log_files${NC}"
            echo "  📁 日志目录: $log_dir"
        else
            echo -e "  ${YELLOW}⚠️  没有找到 Tauri 日志文件${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  日志目录不存在: $log_dir${NC}"
    fi

    echo ""
}

# 检查开发工具
check_dev_tools() {
    echo -e "${YELLOW}🔍 检查开发工具...${NC}"

    # 检查 Docker (如果使用)
    if command -v docker &> /dev/null; then
        if docker info >/dev/null 2>&1; then
            echo -e "  ${GREEN}✅ Docker: 运行中${NC}"
        else
            echo -e "  ${YELLOW}⚠️  Docker: 未运行${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠️  Docker: 未安装${NC}"
    fi

    # 检查 Git
    if command -v git &> /dev/null; then
        echo -e "  ${GREEN}✅ Git: 已安装${NC}"
    else
        echo -e "  ${RED}❌ Git: 未安装${NC}"
    fi

    echo ""
}

# 检查端口占用
check_port_conflicts() {
    echo -e "${YELLOW}🔍 检查端口占用...${NC}"

    local ports=(
        "$SERVICES_PORT:Services"
        "$CLIENT_PORT:Web Client"
        "$TAURI_PORT:Tauri Application"
    )

    for port_info in "${ports[@]}"; do
        local port=$(echo "$port_info" | cut -d':' -f1)
        local service=$(echo "$port_info" | cut -d':' -f2)

        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            local pid=$(lsof -Pi :$port -sTCP:LISTEN -t | head -1)
            local process=$(ps -p "$pid" -o comm= 2>/dev/null || echo "unknown")
            echo -e "  ${GREEN}✅ $service (端口 $port) - 进程: $process (PID: $pid)${NC}"
        else
            echo -e "  ${RED}❌ $service (端口 $port) - 未占用${NC}"
        fi
    done

    echo ""
}

# 生成健康报告
generate_report() {
    echo -e "${BLUE}📊 健康检查总结${NC}"
    echo "================================"

    # 统计结果
    local total_checks=0
    local passed_checks=0

    # 这里可以添加更详细的统计逻辑
    echo "检查完成时间: $(date)"
    echo "检查项目: 系统依赖、项目结构、进程状态、端口占用"
    echo ""

    echo -e "${BLUE}💡 建议:${NC}"
    echo "1. 确保所有系统依赖已正确安装"
    echo "2. 检查 Tauri 项目文件是否完整"
    echo "3. 验证开发服务是否正常运行"
    echo "4. 查看日志文件以排查问题"
    echo ""

    echo -e "${BLUE}🔧 常用命令:${NC}"
    echo "  启动 Tauri 开发: pnpm dev:tauri"
    echo "  运行 Tauri 测试: pnpm test:tauri"
    echo "  查看 Tauri 日志: tail -f logs/tauri.log"
    echo "  停止开发服务: pnpm dev:stop"
}

# 主执行流程
main() {
    echo "开始时间: $(date)"
    echo ""

    # 执行各项检查
    check_dependencies
    check_project_structure
    check_processes
    check_port_conflicts
    check_logs
    check_dev_tools

    # 生成报告
    generate_report
}

# 处理命令行参数
case "${1:-}" in
    --deps-only)
        check_dependencies
        exit 0
        ;;
    --ports-only)
        check_port_conflicts
        exit 0
        ;;
    --processes-only)
        check_processes
        exit 0
        ;;
    --help)
        echo "用法: $0 [选项]"
        echo ""
        echo "选项:"
        echo "  --deps-only       仅检查依赖"
        echo "  --ports-only      仅检查端口"
        echo "  --processes-only  仅检查进程"
        echo "  --help            显示此帮助信息"
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