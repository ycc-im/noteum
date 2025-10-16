# 多阶段构建 - 前端生产环境
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建应用
RUN pnpm build

# 生产运行阶段
FROM nginx:alpine AS production

# 复制构建结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]