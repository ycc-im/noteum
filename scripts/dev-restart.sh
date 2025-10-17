#!/bin/bash

# Noteum 开发环境重启脚本
# 重启所有开发服务

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 重启 Noteum 开发环境...${NC}"
echo ""

# 停止所有服务
echo -e "${YELLOW}🛑 第一步: 停止现有服务...${NC}"
echo ""
./scripts/dev-stop.sh

# 等待一下确保完全停止
sleep 2

echo ""
echo -e "${YELLOW}🚀 第二步: 重新启动服务...${NC}"
echo ""

# 重新启动所有服务
./scripts/dev-workspace.sh