#!/bin/bash

# Storybook 部署脚本
# 用于构建和部署 Storybook 到静态托管服务

set -e

echo "🚀 开始构建 Storybook..."

# 清理之前的构建
echo "🧹 清理之前的构建..."
npm run storybook:clean

# 安装依赖
echo "📦 安装依赖..."
pnpm install

# 类型检查
echo "🔍 运行类型检查..."
npm run type-check

# 构建 Storybook
echo "🏗️ 构建 Storybook..."
npm run storybook:build

# 检查构建结果
if [ -d "storybook-static" ]; then
    echo "✅ Storybook 构建成功！"
    echo "📁 构建文件位于: ./storybook-static"

    # 显示构建统计信息
    echo "📊 构建统计信息:"
    du -sh storybook-static

    # 列出主要文件
    echo "📋 主要文件:"
    ls -la storybook-static/ | head -10

    echo ""
    echo "🎉 部署准备完成！"
    echo "要预览构建结果，运行: npm run storybook:serve"
    echo "要将构建结果部署到静态托管，请上传 ./storybook-static 目录的内容"

else
    echo "❌ Storybook 构建失败！"
    exit 1
fi