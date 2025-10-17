#!/bin/bash

# Tauri 应用构建和打包脚本
# 支持 Debug、Release 和多平台构建

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志文件目录
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

# 构建配置
BUILD_MODE=${1:-"debug"}
PLATFORM=${2:-"current"}
TARGET_DIR="src-tauri/target"

echo -e "${BLUE}🏗️  Tauri 应用构建工具${NC}"
echo -e "${YELLOW}📋 构建配置:${NC}"
echo "  🎯 构建模式: $BUILD_MODE"
echo "  🖥️  目标平台: $PLATFORM"
echo "  📁 日志目录: $LOG_DIR"
echo ""

# 显示帮助信息
show_help() {
    echo -e "${BLUE}📖 Tauri 构建工具${NC}"
    echo ""
    echo -e "${CYAN}用法:${NC}"
    echo "  $0 [mode] [platform]"
    echo ""
    echo -e "${CYAN}构建模式:${NC}"
    echo "  debug    调试构建 (默认)"
    echo "  release  生产构建"
    echo ""
    echo -e "${CYAN}目标平台:${NC}"
    echo "  current  当前平台 (默认)"
    echo "  all      支持的所有平台"
    echo "  macos    macOS"
    echo "  windows  Windows"
    echo "  linux    Linux"
    echo ""
    echo -e "${CYAN}示例:${NC}"
    echo "  $0                        # 调试构建当前平台"
    echo "  $0 release                # 生产构建当前平台"
    echo "  $0 release macos          # 生产构建 macOS"
    echo "  $0 debug all              # 调试构建所有平台"
    echo ""
    echo -e "${CYAN}其他命令:${NC}"
    echo "  $0 clean                  # 清理构建缓存"
    echo "  $0 list-targets           # 列出支持的目标平台"
    echo "  $0 help                   # 显示帮助"
}

# 检查构建环境
check_build_environment() {
    echo -e "${YELLOW}🔍 检查构建环境...${NC}"

    # 检查 Rust 环境
    if command -v rustc &> /dev/null; then
        RUST_VERSION=$(rustc --version)
        echo -e "  ${GREEN}✅ Rust: $RUST_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Rust 未安装${NC}"
        exit 1
    fi

    # 检查 Cargo
    if command -v cargo &> /dev/null; then
        CARGO_VERSION=$(cargo --version)
        echo -e "  ${GREEN}✅ Cargo: $CARGO_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Cargo 未安装${NC}"
        exit 1
    fi

    # 检查 Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "  ${GREEN}✅ Node.js: $NODE_VERSION${NC}"
    else
        echo -e "  ${RED}❌ Node.js 未安装${NC}"
        exit 1
    fi

    # 检查项目结构
    if [ ! -f "apps/client/src-tauri/Cargo.toml" ]; then
        echo -e "  ${RED}❌ Tauri 项目配置不存在${NC}"
        exit 1
    else
        echo -e "  ${GREEN}✅ Tauri 项目配置存在${NC}"
    fi

    echo ""
}

# 检查构建依赖
check_build_dependencies() {
    echo -e "${YELLOW}🔍 检查构建依赖...${NC}"

    cd apps/client

    # 检查前端依赖是否已安装
    if [ ! -d "node_modules" ]; then
        echo -e "  ${YELLOW}📦 安装前端依赖...${NC}"
        pnpm install
    fi

    # 检查 Rust 依赖是否已构建
    if [ ! -d "src-tauri/target" ]; then
        echo -e "  ${YELLOW}📦 构建 Rust 依赖...${NC}"
        cargo check --manifest-path src-tauri/Cargo.toml
    fi

    cd ../..
    echo -e "  ${GREEN}✅ 构建依赖检查完成${NC}"
    echo ""
}

# 构建前端
build_frontend() {
    echo -e "${BLUE}🌐 构建前端应用...${NC}"
    cd apps/client

    local build_cmd="pnpm build"

    if [ "$BUILD_MODE" = "debug" ]; then
        # 调试模式下，构建前端但不优化
        build_cmd="pnpm build --mode development"
    fi

    echo -e "  ${YELLOW}🔨 执行: $build_cmd${NC}"

    if $build_cmd > "../../$LOG_DIR/frontend-build.log" 2>&1; then
        echo -e "  ${GREEN}✅ 前端构建成功${NC}"
    else
        echo -e "  ${RED}❌ 前端构建失败${NC}"
        echo -e "  ${YELLOW}📋 错误详情:${NC}"
        cat "../../$LOG_DIR/frontend-build.log"
        exit 1
    fi

    cd ../..
    echo ""
}

# 构建 Tauri 应用
build_tauri() {
    local target=$1
    echo -e "${BLUE}🖥️  构建 Tauri 应用...${NC}"
    cd apps/client

    local build_args=""
    local tauri_cmd="pnpm tauri:build"

    if [ "$BUILD_MODE" = "debug" ]; then
        tauri_cmd="pnpm tauri:build-debug"
        build_args="--debug"
    fi

    if [ -n "$target" ] && [ "$target" != "current" ]; then
        build_args="$build_args --target $target"
    fi

    echo -e "  ${YELLOW}🔨 执行: $tauri_cmd $build_args${NC}"

    # 实际构建命令
    local cargo_cmd="cargo tauri build"
    if [ "$BUILD_MODE" = "debug" ]; then
        cargo_cmd="cargo tauri build --debug"
    fi

    if [ -n "$target" ] && [ "$target" != "current" ]; then
        cargo_cmd="$cargo_cmd --target $target"
    fi

    if eval "$cargo_cmd > \"../../$LOG_DIR/tauri-build.log\" 2>&1"; then
        echo -e "  ${GREEN}✅ Tauri 构建成功${NC}"
    else
        echo -e "  ${RED}❌ Tauri 构建失败${NC}"
        echo -e "  ${YELLOW}📋 错误详情:${NC}"
        tail -n 50 "../../$LOG_DIR/tauri-build.log"
        exit 1
    fi

    cd ../..
    echo ""
}

# 获取构建产物信息
get_build_artifacts() {
    echo -e "${YELLOW}📦 构建产物:${NC}"

    local base_dir="apps/client/src-tauri/target"
    local artifact_dir="$base_dir"

    if [ "$BUILD_MODE" = "release" ]; then
        artifact_dir="$artifact_dir/release"
    else
        artifact_dir="$artifact_dir/debug"
    fi

    # 查找构建产物
    local found_artifacts=false

    # 查找 .app bundles (macOS)
    if [ -d "$artifact_dir/bundle" ]; then
        find "$artifact_dir/bundle" -name "*.app" -type d 2>/dev/null | while read -r app; do
            local size=$(du -sh "$app" | cut -f1)
            echo -e "  ${GREEN}📱 macOS App Bundle: $(basename "$app") ($size)${NC}"
            echo -e "    📍 路径: $app"
            found_artifacts=true
        done
    fi

    # 查找 .exe (Windows)
    find "$artifact_dir" -name "*.exe" -type f 2>/dev/null | while read -r exe; do
        local size=$(du -sh "$exe" | cut -f1)
        echo -e "  ${GREEN}📱 Windows Executable: $(basename "$exe") ($size)${NC}"
        echo -e "    📍 路径: $exe"
        found_artifacts=true
    done

    # 查找二进制文件 (Linux)
    find "$artifact_dir" -type f -executable ! -name "*.so*" ! -name "*.dylib*" 2>/dev/null | head -5 | while read -r bin; do
        local size=$(du -sh "$bin" | cut -f1)
        echo -e "  ${GREEN}📱 Linux Binary: $(basename "$bin") ($size)${NC}"
        echo -e "    📍 路径: $bin"
        found_artifacts=true
    done

    if [ "$found_artifacts" = false ]; then
        echo -e "  ${YELLOW}⚠️  未找到构建产物${NC}"
        echo -e "    📁 查看目录: $artifact_dir"
    fi

    echo ""
}

# 清理构建缓存
clean_build_cache() {
    echo -e "${YELLOW}🧹 清理构建缓存...${NC}"

    cd apps/client

    # 清理前端构建
    if [ -d "dist" ]; then
        rm -rf dist
        echo -e "  ${GREEN}✅ 清理前端构建目录${NC}"
    fi

    # 清理 Tauri 构建缓存
    if [ -d "src-tauri/target" ]; then
        cargo clean --manifest-path src-tauri/Cargo.toml
        echo -e "  ${GREEN}✅ 清理 Rust 构建缓存${NC}"
    fi

    # 清理日志文件
    if ls ../../logs/tauri-build*.log 1> /dev/null 2>&1; then
        rm ../../logs/tauri-build*.log
        echo -e "  ${GREEN}✅ 清理构建日志${NC}"
    fi

    cd ../..
    echo -e "  ${GREEN}🎉 构建缓存清理完成${NC}"
    echo ""
}

# 列出支持的目标平台
list_targets() {
    echo -e "${YELLOW}🖥️  支持的目标平台:${NC}"
    echo ""

    # 获取当前系统
    local current_os=$(uname -s)
    local current_arch=$(uname -m)

    case $current_os in
        "Darwin")
            echo -e "  ${GREEN}macOS (当前系统)${NC}"
            echo "    • x86_64-apple-darwin"
            echo "    • aarch64-apple-darwin (Apple Silicon)"
            echo ""
            echo -e "  ${YELLOW}其他平台:${NC}"
            echo "    • x86_64-pc-windows-msvc (Windows x64)"
            echo "    • i686-pc-windows-msvc (Windows x86)"
            echo "    • x86_64-unknown-linux-gnu (Linux x64)"
            ;;
        "Linux")
            echo -e "  ${GREEN}Linux (当前系统)${NC}"
            echo "    • x86_64-unknown-linux-gnu"
            echo ""
            echo -e "  ${YELLOW}其他平台:${NC}"
            echo "    • x86_64-apple-darwin (macOS Intel)"
            echo "    • aarch64-apple-darwin (macOS Apple Silicon)"
            echo "    • x86_64-pc-windows-msvc (Windows x64)"
            ;;
        *)
            echo -e "  ${YELLOW}未知系统: $current_os${NC}"
            echo "  ${CYAN}使用 'rustc --print target-list' 查看所有目标${NC}"
            ;;
    esac

    echo ""
    echo -e "${CYAN}安装目标平台:${NC}"
    echo "  rustup target add <target-name>"
    echo ""
}

# 主执行流程
main() {
    case "${BUILD_MODE}" in
        "help"|"--help"|"-h")
            show_help
            exit 0
            ;;
        "clean")
            clean_build_cache
            exit 0
            ;;
        "list-targets")
            list_targets
            exit 0
            ;;
        "debug"|"release")
            # 正常构建流程
            ;;
        *)
            echo -e "${YELLOW}⚠️  未知构建模式: $BUILD_MODE${NC}"
            echo -e "  ${CYAN}使用 'debug' 或 'release'${NC}"
            BUILD_MODE="debug"
            ;;
    esac

    # 构建流程
    check_build_environment
    check_build_dependencies

    # 构建前端
    build_frontend

    # 处理多平台构建
    if [ "$PLATFORM" = "all" ]; then
        echo -e "${PURPLE}🌍 多平台构建模式${NC}"
        echo ""

        # 定义目标平台
        local targets=()
        local current_os=$(uname -s)

        case $current_os in
            "Darwin")
                targets=("x86_64-apple-darwin" "aarch64-apple-darwin")
                ;;
            "Linux")
                targets=("x86_64-unknown-linux-gnu")
                ;;
            *)
                targets=("current")
                ;;
        esac

        for target in "${targets[@]}"; do
            echo -e "${BLUE}🎯 构建目标: $target${NC}"
            build_tauri "$target"
        done
    else
        # 单平台构建
        local target="current"
        if [ "$PLATFORM" != "current" ]; then
            target="$PLATFORM"
        fi

        build_tauri "$target"
    fi

    # 显示构建结果
    get_build_artifacts

    echo -e "${GREEN}🎉 Tauri 应用构建完成！${NC}"
    echo ""
    echo -e "${YELLOW}📊 后续步骤:${NC}"
    echo "  🧪 运行测试: pnpm test:tauri"
    echo "  📝 查看构建日志: ./scripts/tauri-logs.sh show tauri-build"
    echo "  🏥 健康检查: pnpm tauri:health"
}

# 执行主流程
main "$@"