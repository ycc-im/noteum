#!/bin/bash

# Noteum Apps 目录开发工作区启动脚本
# 从 apps 目录并发启动 services 和 client

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 从 Apps 目录启动 Noteum 开发工作区...${NC}"
echo -e "${YELLOW}📋 当前目录: $(pwd)${NC}"
echo ""

# 调用根目录的启动脚本
echo -e "${BLUE}🔄 调用根目录开发启动脚本...${NC}"
exec ../scripts/dev-workspace.sh