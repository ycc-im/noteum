#!/bin/bash

# Tauri 应用测试脚本
# 运行 Tauri 桌面应用的单元测试和集成测试

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志文件目录
LOG_DIR="./logs"
mkdir -p "$LOG_DIR"

echo -e "${BLUE}🧪 运行 Tauri 应用测试...${NC}"

# 解析命令行参数
TEST_TYPE=""
VERBOSE=false
WATCH=false
COVERAGE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --unit)
            TEST_TYPE="unit"
            shift
            ;;
        --integration)
            TEST_TYPE="integration"
            shift
            ;;
        --all)
            TEST_TYPE="all"
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --help)
            echo "用法: $0 [选项]"
            echo ""
            echo "选项:"
            echo "  --unit         运行单元测试"
            echo "  --integration  运行集成测试"
            echo "  --all          运行所有测试（默认）"
            echo "  --watch        监听模式运行测试"
            echo "  --verbose      详细输出"
            echo "  --coverage     生成覆盖率报告"
            echo "  --help         显示此帮助信息"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ 未知选项: $1${NC}"
            echo "使用 --help 查看可用选项"
            exit 1
            ;;
    esac
done

# 如果没有指定测试类型，默认运行所有测试
if [ -z "$TEST_TYPE" ]; then
    TEST_TYPE="all"
fi

# 检查 Rust 和 Cargo 是否安装
echo -e "${YELLOW}🔍 检查 Rust 环境...${NC}"
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Cargo 未找到，请安装 Rust${NC}"
    echo "   访问 https://rustup.rs/ 安装 Rust"
    exit 1
fi

echo -e "${GREEN}✅ Rust 环境检查通过${NC}"
echo ""

# 进入客户端目录
cd apps/client

# 检查 Tauri 项目是否初始化
if [ ! -f "src-tauri/Cargo.toml" ]; then
    echo -e "${RED}❌ Tauri 项目未初始化${NC}"
    echo "   请先运行 'pnpm tauri init' 或确保 src-tauri 目录存在"
    exit 1
fi

# 构建测试命令
CARGO_ARGS=""

if [ "$VERBOSE" = true ]; then
    CARGO_ARGS="$CARGO_ARGS --verbose"
fi

if [ "$WATCH" = true ]; then
    CARGO_ARGS="$CARGO_ARGS -- --watch"
fi

if [ "$COVERAGE" = true ]; then
    # 检查是否安装了 cargo-llvm-cov
    if ! cargo llvm-cov --version &> /dev/null; then
        echo -e "${YELLOW}⚠️  cargo-llvm-cov 未安装，正在安装...${NC}"
        cargo install cargo-llvm-cov
    fi
    CARGO_ARGS="$CARGO_ARGS --coverage --html"
fi

# 运行测试
run_tests() {
    local test_type=$1
    local test_name=$2
    local test_command=$3

    echo -e "${BLUE}🧪 运行 $test_name...${NC}"

    local start_time=$(date +%s)

    if eval "$test_command > \"../../$LOG_DIR/tauri-test-$test_type.log\" 2>&1"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        echo -e "${GREEN}✅ $test_name 通过 (${duration}s)${NC}"

        if [ "$VERBOSE" = true ]; then
            echo -e "${YELLOW}📋 测试详情:${NC}"
            tail -n 10 "../../$LOG_DIR/tauri-test-$test_type.log"
        fi
        return 0
    else
        echo -e "${RED}❌ $test_name 失败${NC}"
        echo -e "${YELLOW}📋 错误详情:${NC}"
        cat "../../$LOG_DIR/tauri-test-$test_type.log"
        return 1
    fi
}

# 根据测试类型运行测试
echo -e "${YELLOW}🚀 开始 Tauri 测试...${NC}"
echo ""

TESTS_PASSED=true

case $TEST_TYPE in
    "unit")
        run_tests "unit" "单元测试" "cargo test --manifest-path src-tauri/Cargo.toml --lib $CARGO_ARGS"
        ;;
    "integration")
        run_tests "integration" "集成测试" "cargo test --manifest-path src-tauri/Cargo.toml --test '*' $CARGO_ARGS"
        ;;
    "all")
        # 运行单元测试
        if ! run_tests "unit" "单元测试" "cargo test --manifest-path src-tauri/Cargo.toml --lib $CARGO_ARGS"; then
            TESTS_PASSED=false
        fi

        echo ""

        # 运行集成测试
        if ! run_tests "integration" "集成测试" "cargo test --manifest-path src-tauri/Cargo.toml --test '*' $CARGO_ARGS"; then
            TESTS_PASSED=false
        fi
        ;;
esac

cd ../..

echo ""
echo -e "${BLUE}📊 测试结果总结:${NC}"
echo "  📁 测试日志: $LOG_DIR/tauri-test-*.log"

if [ "$TESTS_PASSED" = true ]; then
    echo -e "${GREEN}🎉 所有 Tauri 测试通过！${NC}"

    if [ "$COVERAGE" = true ]; then
        echo -e "${YELLOW}📈 覆盖率报告已生成${NC}"
        echo "   查看覆盖率报告: open target/llvm-cov/html/index.html"
    fi

    exit 0
else
    echo -e "${RED}❌ 部分 Tauri 测试失败${NC}"
    echo "   查看详细日志: cat $LOG_DIR/tauri-test-*.log"
    exit 1
fi