#!/bin/bash

# Tauri 应用清理和重置脚本
# 清理构建缓存、日志文件、进程等

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 Tauri 应用清理工具${NC}"
echo ""

# 显示帮助信息
show_help() {
    echo -e "${BLUE}📖 Tauri 清理工具${NC}"
    echo ""
    echo -e "${CYAN}用法:${NC}"
    echo "  $0 [command]"
    echo ""
    echo -e "${CYAN}命令:${NC}"
    echo "  all          清理所有内容 (默认)"
    echo "  processes    停止 Tauri 相关进程"
    echo "  build        清理构建缓存"
    echo "  logs         清理日志文件"
    echo "  deps         重置依赖"
    echo "  temp         清理临时文件"
    echo "  reset        完全重置 Tauri 环境"
    echo "  status       显示清理状态"
    echo "  help         显示帮助"
    echo ""
    echo -e "${CYAN}示例:${NC}"
    echo "  $0                    # 清理所有内容"
    echo "  $0 processes          # 仅停止进程"
    echo "  $0 build              # 仅清理构建缓存"
    echo "  $0 reset              # 完全重置"
}

# 停止 Tauri 相关进程
stop_processes() {
    echo -e "${YELLOW}🛑 停止 Tauri 相关进程...${NC}"

    local stopped_processes=0

    # 停止 Tauri 开发进程
    local tauri_processes=$(pgrep -f "tauri.*dev" 2>/dev/null || true)
    if [ -n "$tauri_processes" ]; then
        echo -e "  ${YELLOW}🔄 停止 Tauri 开发进程...${NC}"
        echo "$tauri_processes" | xargs kill -TERM 2>/dev/null || true
        sleep 2

        # 强制停止仍在运行的进程
        local remaining=$(pgrep -f "tauri.*dev" 2>/dev/null || true)
        if [ -n "$remaining" ]; then
            echo "$remaining" | xargs kill -KILL 2>/dev/null || true
        fi

        stopped_processes=$(echo "$tauri_processes" | wc -l)
        echo -e "  ${GREEN}✅ 已停止 $stopped_processes 个 Tauri 进程${NC}"
    else
        echo -e "  ${BLUE}ℹ️  没有运行中的 Tauri 进程${NC}"
    fi

    # 停止相关 Node.js 进程
    local node_processes=$(pgrep -f "node.*tauri\|tauri.*node" 2>/dev/null || true)
    if [ -n "$node_processes" ]; then
        echo -e "  ${YELLOW}🔄 停止相关 Node.js 进程...${NC}"
        echo "$node_processes" | xargs kill -TERM 2>/dev/null || true
        sleep 1
        echo "$node_processes" | xargs kill -KILL 2>/dev/null || true
        echo -e "  ${GREEN}✅ 已停止相关 Node.js 进程${NC}"
    fi

    echo ""
}

# 清理构建缓存
clean_build_cache() {
    echo -e "${YELLOW}🏗️  清理构建缓存...${NC}"

    cd apps/client

    # 清理 Tauri 构建目录
    if [ -d "src-tauri/target" ]; then
        local target_size=$(du -sh src-tauri/target 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "  ${YELLOW}🗑️  清理 Tauri 构建目录 ($target_size)${NC}"
        rm -rf src-tauri/target
        echo -e "  ${GREEN}✅ 已清理 src-tauri/target${NC}"
    else
        echo -e "  ${BLUE}ℹ️  Tauri 构建目录不存在${NC}"
    fi

    # 清理前端构建目录
    if [ -d "dist" ]; then
        local dist_size=$(du -sh dist 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "  ${YELLOW}🗑️  清理前端构建目录 ($dist_size)${NC}"
        rm -rf dist
        echo -e "  ${GREEN}✅ 已清理 dist${NC}"
    else
        echo -e "  ${BLUE}ℹ️  前端构建目录不存在${NC}"
    fi

    # 清理 Vite 缓存
    if [ -d "node_modules/.vite" ]; then
        echo -e "  ${YELLOW}🗑️  清理 Vite 缓存${NC}"
        rm -rf node_modules/.vite
        echo -e "  ${GREEN}✅ 已清理 Vite 缓存${NC}"
    fi

    cd ../..
    echo ""
}

# 清理日志文件
clean_logs() {
    echo -e "${YELLOW}📝 清理日志文件...${NC}"

    local log_files=(
        "logs/tauri.log"
        "logs/tauri-build.log"
        "logs/tauri-test-unit.log"
        "logs/tauri-test-integration.log"
        "logs/tauri-test-e2e.log"
    )

    local removed_files=0
    local total_size=0

    for log_file in "${log_files[@]}"; do
        if [ -f "$log_file" ]; then
            local size=$(du -k "$log_file" 2>/dev/null | cut -f1 || echo "0")
            rm "$log_file"
            echo -e "  ${GREEN}✅ 已删除: $log_file (${size}KB)${NC}"
            ((removed_files++))
            ((total_size += size))
        fi
    done

    # 清理其他 Tauri 相关日志
    if ls logs/tauri*.log 1> /dev/null 2>&1; then
        local other_logs=$(ls logs/tauri*.log 2>/dev/null)
        for log in $other_logs; do
            local size=$(du -k "$log" 2>/dev/null | cut -f1 || echo "0")
            rm "$log"
            echo -e "  ${GREEN}✅ 已删除: $log (${size}KB)${NC}"
            ((removed_files++))
            ((total_size += size))
        done
    fi

    if [ "$removed_files" -gt 0 ]; then
        echo -e "  ${GREEN}🎉 已清理 $removed_files 个日志文件，释放 ${total_size}KB${NC}"
    else
        echo -e "  ${BLUE}ℹ️  没有找到日志文件${NC}"
    fi

    echo ""
}

# 重置依赖
reset_dependencies() {
    echo -e "${YELLOW}📦 重置依赖...${NC}"

    cd apps/client

    # 询问是否删除 node_modules
    if [ -d "node_modules" ]; then
        local node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "  ${YELLOW}⚠️  发现 node_modules 目录 ($node_modules_size)${NC}"
        echo -e "  ${CYAN}💡 提示: 删除后需要重新运行 'pnpm install'${NC}"

        read -p "  是否删除 node_modules? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo -e "  ${YELLOW}🗑️  删除 node_modules...${NC}"
            rm -rf node_modules
            echo -e "  ${GREEN}✅ 已删除 node_modules${NC}"
        else
            echo -e "  ${BLUE}ℹ️  保留 node_modules${NC}"
        fi
    fi

    # 清理 Cargo 缓存 (可选)
    echo -e "  ${YELLOW}🔍 检查 Cargo 缓存...${NC}"
    if [ -d "src-tauri/target" ]; then
        read -p "  是否清理 Cargo 构建缓存? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cargo clean --manifest-path src-tauri/Cargo.toml
            echo -e "  ${GREEN}✅ 已清理 Cargo 缓存${NC}"
        fi
    fi

    cd ../..
    echo ""
}

# 清理临时文件
clean_temp_files() {
    echo -e "${YELLOW}🗂️  清理临时文件...${NC}"

    local temp_patterns=(
        "*.tmp"
        "*.temp"
        ".DS_Store"
        "Thumbs.db"
        "*.swp"
        "*.swo"
        "*~"
        ".#*"
        "#*#"
    )

    local removed_files=0

    cd apps/client

    for pattern in "${temp_patterns[@]}"; do
        local found_files=$(find . -name "$pattern" -type f 2>/dev/null || true)
        if [ -n "$found_files" ]; then
            echo "$found_files" | while read -r file; do
                rm "$file"
                echo -e "  ${GREEN}✅ 已删除临时文件: $file${NC}"
                ((removed_files++))
            done
        fi
    done

    # 清理编辑器备份文件
    find . -name "*.bak" -type f -delete 2>/dev/null || true

    cd ../..

    if [ "$removed_files" -gt 0 ]; then
        echo -e "  ${GREEN}🎉 已清理 $removed_files 个临时文件${NC}"
    else
        echo -e "  ${BLUE}ℹ️  没有找到临时文件${NC}"
    fi

    echo ""
}

# 完全重置 Tauri 环境
full_reset() {
    echo -e "${PURPLE}🔄 完全重置 Tauri 环境...${NC}"
    echo -e "${RED}⚠️  警告: 这将删除所有 Tauri 相关数据${NC}"
    echo ""

    read -p "确定要继续吗? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}❌ 操作已取消${NC}"
        exit 0
    fi

    echo ""

    # 执行所有清理操作
    stop_processes
    clean_build_cache
    clean_logs
    clean_temp_files

    # 询问是否重置依赖
    echo -e "${YELLOW}📦 是否重置所有依赖?${NC}"
    read -p "这将删除 node_modules 和重新初始化 Tauri 项目 [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        reset_dependencies
    fi

    echo -e "${GREEN}🎉 Tauri 环境重置完成！${NC}"
    echo -e "${CYAN}💡 下一步:${NC}"
    echo "  1. 重新安装依赖: cd apps/client && pnpm install"
    echo "  2. 启动开发环境: pnpm dev:tauri"
    echo ""
}

# 显示清理状态
show_status() {
    echo -e "${BLUE}📊 当前状态:${NC}"
    echo ""

    # 检查进程
    echo -e "${YELLOW}🔄 进程状态:${NC}"
    local tauri_processes=$(pgrep -f "tauri.*dev" 2>/dev/null || true)
    if [ -n "$tauri_processes" ]; then
        local count=$(echo "$tauri_processes" | wc -l)
        echo -e "  ${RED}❌ 运行中的 Tauri 进程: $count${NC}"
    else
        echo -e "  ${GREEN}✅ 没有运行中的 Tauri 进程${NC}"
    fi

    # 检查构建缓存
    echo -e "${YELLOW}🏗️  构建缓存:${NC}"
    if [ -d "apps/client/src-tauri/target" ]; then
        local size=$(du -sh apps/client/src-tauri/target 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "  ${YELLOW}⚠️  Tauri 构建目录存在 ($size)${NC}"
    else
        echo -e "  ${GREEN}✅ 没有构建缓存${NC}"
    fi

    if [ -d "apps/client/dist" ]; then
        local size=$(du -sh apps/client/dist 2>/dev/null | cut -f1 || echo "unknown")
        echo -e "  ${YELLOW}⚠️  前端构建目录存在 ($size)${NC}"
    else
        echo -e "  ${GREEN}✅ 没有前端构建文件${NC}"
    fi

    # 检查日志文件
    echo -e "${YELLOW}📝 日志文件:${NC}"
    local log_count=$(find logs -name "tauri*.log" 2>/dev/null | wc -l)
    if [ "$log_count" -gt 0 ]; then
        echo -e "  ${YELLOW}⚠️  存在 $log_count 个日志文件${NC}"
    else
        echo -e "  ${GREEN}✅ 没有日志文件${NC}"
    fi

    echo ""
}

# 主执行流程
main() {
    local command="${1:-all}"

    case "$command" in
        "help"|"--help"|"-h")
            show_help
            ;;
        "status")
            show_status
            ;;
        "processes")
            stop_processes
            echo -e "${GREEN}✅ 进程清理完成${NC}"
            ;;
        "build")
            clean_build_cache
            echo -e "${GREEN}✅ 构建缓存清理完成${NC}"
            ;;
        "logs")
            clean_logs
            echo -e "${GREEN}✅ 日志文件清理完成${NC}"
            ;;
        "deps")
            reset_dependencies
            echo -e "${GREEN}✅ 依赖重置完成${NC}"
            ;;
        "temp")
            clean_temp_files
            echo -e "${GREEN}✅ 临时文件清理完成${NC}"
            ;;
        "reset")
            full_reset
            ;;
        "all")
            echo -e "${PURPLE}🧹 全面清理...${NC}"
            echo ""
            stop_processes
            clean_build_cache
            clean_logs
            clean_temp_files
            echo -e "${GREEN}🎉 全面清理完成！${NC}"
            ;;
        *)
            echo -e "${RED}❌ 未知命令: $command${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"