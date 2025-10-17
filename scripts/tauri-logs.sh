#!/bin/bash

# Tauri 应用日志管理脚本
# 查看、管理和分析 Tauri 开发日志

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 日志目录
LOG_DIR="./logs"

# 日志文件列表
LOG_FILES=(
    "tauri.log:Tauri 应用日志"
    "tauri-test-unit.log:Tauri 单元测试日志"
    "tauri-test-integration.log:Tauri 集成测试日志"
    "tauri-test-e2e.log:Tauri 端到端测试日志"
)

echo -e "${BLUE}📝 Tauri 日志管理工具${NC}"
echo ""

# 检查日志目录
check_log_directory() {
    if [ ! -d "$LOG_DIR" ]; then
        mkdir -p "$LOG_DIR"
        echo -e "${YELLOW}📁 创建日志目录: $LOG_DIR${NC}"
    fi
}

# 显示日志文件状态
show_log_status() {
    echo -e "${YELLOW}📊 日志文件状态:${NC}"
    echo ""

    local found_logs=false

    for log_info in "${LOG_FILES[@]}"; do
        local file=$(echo "$log_info" | cut -d':' -f1)
        local description=$(echo "$log_info" | cut -d':' -f2)
        local full_path="$LOG_DIR/$file"

        if [ -f "$full_path" ]; then
            local size=$(du -h "$full_path" | cut -f1)
            local modified=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M" "$full_path" 2>/dev/null || stat -c "%y" "$full_path" 2>/dev/null | cut -d'.' -f1)
            echo -e "  ${GREEN}✅ $description${NC}"
            echo -e "    📁 $file (大小: $size, 修改: $modified)"
            found_logs=true
        else
            echo -e "  ${YELLOW}⚠️  $description (文件不存在)${NC}"
            echo -e "    📁 $file"
        fi
        echo ""
    done

    if [ "$found_logs" = false ]; then
        echo -e "${YELLOW}ℹ️  暂无 Tauri 日志文件${NC}"
        echo -e "  ${CYAN}💡 运行 'pnpm dev:tauri' 或 'pnpm test:tauri' 生成日志${NC}"
    fi
}

# 实时查看日志
watch_log() {
    local log_file=$1

    if [ -z "$log_file" ]; then
        echo -e "${YELLOW}📋 可用日志文件:${NC}"
        echo ""
        for log_info in "${LOG_FILES[@]}"; do
            local file=$(echo "$log_info" | cut -d':' -f1)
            local description=$(echo "$log_info" | cut -d':' -f2)
            local full_path="$LOG_DIR/$file"

            if [ -f "$full_path" ]; then
                echo -e "  ${GREEN}• $description${NC} -> $file"
            fi
        done
        echo ""
        echo -e "${CYAN}使用方法: $0 watch <log_file>${NC}"
        return 1
    fi

    local full_path="$LOG_DIR/$log_file"

    if [ ! -f "$full_path" ]; then
        echo -e "${RED}❌ 日志文件不存在: $full_path${NC}"
        return 1
    fi

    echo -e "${BLUE}👀 实时查看日志: $log_file${NC}"
    echo -e "${YELLOW}💡 使用 Ctrl+C 停止监听${NC}"
    echo ""

    tail -f "$full_path"
}

# 显示日志内容
show_log() {
    local log_file=$1
    local lines=${2:-50}

    if [ -z "$log_file" ]; then
        echo -e "${RED}❌ 请指定日志文件${NC}"
        echo -e "${CYAN}使用方法: $0 show <log_file> [lines]${NC}"
        return 1
    fi

    local full_path="$LOG_DIR/$log_file"

    if [ ! -f "$full_path" ]; then
        echo -e "${RED}❌ 日志文件不存在: $full_path${NC}"
        return 1
    fi

    echo -e "${BLUE}📖 显示日志: $log_file (最近 $lines 行)${NC}"
    echo ""

    tail -n "$lines" "$full_path"
}

# 搜索日志内容
search_log() {
    local pattern=$1
    local log_file=${2:-}

    if [ -z "$pattern" ]; then
        echo -e "${RED}❌ 请指定搜索模式${NC}"
        echo -e "${CYAN}使用方法: $0 search <pattern> [log_file]${NC}"
        return 1
    fi

    echo -e "${BLUE}🔍 搜索日志: '$pattern'${NC}"
    echo ""

    local found_matches=false

    if [ -n "$log_file" ]; then
        # 搜索指定文件
        local full_path="$LOG_DIR/$log_file"
        if [ -f "$full_path" ]; then
            echo -e "${YELLOW}📁 搜索文件: $log_file${NC}"
            grep --color=always -n -C 2 "$pattern" "$full_path" || echo -e "${YELLOW}ℹ️  未找到匹配项${NC}"
            found_matches=true
        else
            echo -e "${RED}❌ 日志文件不存在: $log_file${NC}"
        fi
    else
        # 搜索所有日志文件
        for log_info in "${LOG_FILES[@]}"; do
            local file=$(echo "$log_info" | cut -d':' -f1)
            local full_path="$LOG_DIR/$file"

            if [ -f "$full_path" ]; then
                local matches=$(grep -n "$pattern" "$full_path" | wc -l)
                if [ "$matches" -gt 0 ]; then
                    echo -e "${YELLOW}📁 $file ($matches 处匹配)${NC}"
                    grep --color=always -n -C 2 "$pattern" "$full_path"
                    echo ""
                    found_matches=true
                fi
            fi
        done
    fi

    if [ "$found_matches" = false ]; then
        echo -e "${YELLOW}ℹ️  未找到匹配项${NC}"
    fi
}

# 清理日志文件
clean_logs() {
    local days=${1:-7}

    echo -e "${YELLOW}🧹 清理 $days 天前的日志文件...${NC}"

    local removed_files=0
    local total_size_freed=0

    # 清理旧的日志文件
    while IFS= read -r -d '' file; do
        local size=$(du -k "$file" | cut -f1)
        rm "$file"
        echo -e "  ${RED}🗑️  删除: $(basename "$file") (${size}KB)${NC}"
        ((removed_files++))
        ((total_size_freed += size))
    done < <(find "$LOG_DIR" -name "tauri*.log" -type f -mtime +$days -print0 2>/dev/null)

    # 清理空的日志文件
    for log_info in "${LOG_FILES[@]}"; do
        local file=$(echo "$log_info" | cut -d':' -f1)
        local full_path="$LOG_DIR/$file"

        if [ -f "$full_path" ] && [ ! -s "$full_path" ]; then
            rm "$full_path"
            echo -e "  ${YELLOW}🗑️  删除空文件: $file${NC}"
            ((removed_files++))
        fi
    done

    echo ""
    if [ "$removed_files" -gt 0 ]; then
        echo -e "${GREEN}✅ 清理完成: 删除了 $removed_files 个文件，释放了 ${total_size_freed}KB${NC}"
    else
        echo -e "${BLUE}ℹ️  没有需要清理的文件${NC}"
    fi
}

# 分析日志错误
analyze_errors() {
    local log_file=${1:-tauri.log}
    local full_path="$LOG_DIR/$log_file"

    if [ ! -f "$full_path" ]; then
        echo -e "${RED}❌ 日志文件不存在: $full_path${NC}"
        return 1
    fi

    echo -e "${BLUE}🔍 分析日志错误: $log_file${NC}"
    echo ""

    # 统计错误类型
    echo -e "${YELLOW}📊 错误统计:${NC}"
    local error_count=$(grep -c -i "error\|exception\|failed" "$full_path" 2>/dev/null || echo "0")
    local warning_count=$(grep -c -i "warning\|warn" "$full_path" 2>/dev/null || echo "0")
    local panic_count=$(grep -c -i "panic" "$full_path" 2>/dev/null || echo "0")

    echo -e "  ${RED}❌ 错误: $error_count${NC}"
    echo -e "  ${YELLOW}⚠️  警告: $warning_count${NC}"
    echo -e "  ${PURPLE}🚨 Panic: $panic_count${NC}"
    echo ""

    # 显示最近的错误
    if [ "$error_count" -gt 0 ]; then
        echo -e "${YELLOW}📋 最近的错误:${NC}"
        grep -i -n "error\|exception\|failed" "$full_path" | tail -n 10 | while IFS= read -r line; do
            local line_num=$(echo "$line" | cut -d':' -f1)
            local content=$(echo "$line" | cut -d':' -f2-)
            echo -e "  ${RED}[$line_num]${NC} $content"
        done
        echo ""
    fi

    # 显示常见的错误模式
    echo -e "${YELLOW}🔍 常见错误模式:${NC}"

    local patterns=(
        "connection.*refused:连接被拒绝"
        "permission.*denied:权限被拒绝"
        "file.*not.*found:文件未找到"
        "timeout:超时"
        "out of memory:内存不足"
        "compilation.*error:编译错误"
    )

    for pattern_info in "${patterns[@]}"; do
        local pattern=$(echo "$pattern_info" | cut -d':' -f1)
        local description=$(echo "$pattern_info" | cut -d':' -f2)
        local count=$(grep -c -i "$pattern" "$full_path" 2>/dev/null || echo "0")

        if [ "$count" -gt 0 ]; then
            echo -e "  ${YELLOW}• $description: $count 次${NC}"
        fi
    done
}

# 显示帮助信息
show_help() {
    echo -e "${BLUE}📖 Tauri 日志管理工具${NC}"
    echo ""
    echo -e "${CYAN}用法:${NC}"
    echo "  $0 <command> [options]"
    echo ""
    echo -e "${CYAN}命令:${NC}"
    echo "  status        显示日志文件状态"
    echo "  watch [file]  实时查看日志 (默认: tauri.log)"
    echo "  show <file> [lines]  显示日志内容 (默认: 50行)"
    echo "  search <pattern> [file]  搜索日志内容"
    echo "  clean [days]  清理旧日志文件 (默认: 7天)"
    echo "  analyze [file]  分析日志错误 (默认: tauri.log)"
    echo "  help          显示帮助信息"
    echo ""
    echo -e "${CYAN}示例:${NC}"
    echo "  $0 status                    # 查看日志状态"
    echo "  $0 watch tauri.log          # 实时查看 Tauri 日志"
    echo "  $0 show tauri.log 100       # 显示最近 100 行"
    echo "  $0 search 'error'            # 搜索所有日志中的错误"
    echo "  $0 search 'panic' tauri.log  # 在 tauri.log 中搜索 panic"
    echo "  $0 clean 3                   # 清理 3 天前的日志"
    echo "  $0 analyze                   # 分析错误"
    echo ""
    echo -e "${CYAN}日志文件:${NC}"
    for log_info in "${LOG_FILES[@]}"; do
        local file=$(echo "$log_info" | cut -d':' -f1)
        local description=$(echo "$log_info" | cut -d':' -f2)
        echo "  • $file - $description"
    done
}

# 主执行流程
main() {
    check_log_directory

    case "${1:-help}" in
        "status")
            show_log_status
            ;;
        "watch")
            watch_log "${2:-tauri.log}"
            ;;
        "show")
            show_log "$2" "$3"
            ;;
        "search")
            search_log "$2" "$3"
            ;;
        "clean")
            clean_logs "$2"
            ;;
        "analyze")
            analyze_errors "$2"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            echo -e "${RED}❌ 未知命令: $1${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"