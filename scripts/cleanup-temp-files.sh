#!/bin/bash

# 清理临时文件脚本
# 清理 Vite/Vitest 和其他工具生成的临时文件

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧹 清理临时文件...${NC}"

# 清理 Vite/Vitest 时间戳文件
echo -e "${YELLOW}📋 清理 Vite/Vitest 临时文件...${NC}"
VITE_TEMP_FILES=$(find . -name "*.timestamp-*.mjs" -type f 2>/dev/null)
if [ -n "$VITE_TEMP_FILES" ]; then
    echo "$VITE_TEMP_FILES" | xargs rm -f
    echo -e "${GREEN}✅ 已清理 Vite/Vitest 临时文件${NC}"
else
    echo -e "${BLUE}ℹ️  没有找到 Vite/Vitest 临时文件${NC}"
fi

# 清理其他临时文件
echo -e "${YELLOW}📋 清理其他临时文件...${NC}"

# 清理 .temp 和 .tmp 文件
TEMP_FILES=$(find . -name ".temp" -o -name ".tmp" -o -name "*.temp" -o -name "*.tmp" 2>/dev/null)
if [ -n "$TEMP_FILES" ]; then
    echo "$TEMP_FILES" | xargs rm -rf 2>/dev/null || true
    echo -e "${GREEN}✅ 已清理临时文件${NC}"
else
    echo -e "${BLUE}ℹ️  没有找到临时文件${NC}"
fi

# 清理可能的缓存文件
echo -e "${YELLOW}📋 清理缓存文件...${NC}"
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite 2>/dev/null || true
    echo -e "${GREEN}✅ 已清理 Vite 缓存${NC}"
fi

# 清理编译缓存
if [ -d "packages" ]; then
    find packages -name ".vite" -type d -exec rm -rf {} + 2>/dev/null || true
    find apps -name ".vite" -type d -exec rm -rf {} + 2>/dev/null || true
    echo -e "${GREEN}✅ 已清理项目缓存${NC}"
fi

echo -e "${GREEN}🎉 临时文件清理完成！${NC}"