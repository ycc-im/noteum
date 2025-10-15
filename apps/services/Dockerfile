# 多阶段构建 Dockerfile for NestJS + tRPC Production

# 第一阶段：构建阶段
FROM node:18-alpine AS builder

# 安装构建依赖
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 复制配置文件
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# 复制各个包的 package.json
COPY apps/services/package.json ./apps/services/
COPY packages/utils/package.json ./packages/utils/
COPY packages/ui/package.json ./packages/ui/

# 安装所有依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY apps/services/src ./apps/services/src
COPY packages/utils/src ./packages/utils/src
COPY packages/ui/src ./packages/ui/src
COPY tsconfig.json ./
COPY apps/services/tsconfig.json ./apps/services/
COPY packages/utils/tsconfig.json ./packages/utils/
COPY packages/ui/tsconfig.json ./packages/ui/

# 构建所有包
RUN pnpm build

# 第二阶段：运行阶段
FROM node:18-alpine AS runner

# 安装运行时依赖
RUN apk add --no-cache \
    curl \
    dumb-init

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@8.15.0

# 复制配置文件
COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/services/package.json ./apps/services/
COPY packages/utils/package.json ./packages/utils/
COPY packages/ui/package.json ./packages/ui/

# 只安装生产依赖
RUN pnpm install --frozen-lockfile --prod && \
    pnpm store prune

# 复制构建产物
COPY --from=builder /app/apps/services/dist ./apps/services/dist
COPY --from=builder /app/packages/utils/dist ./packages/utils/dist
COPY --from=builder /app/packages/ui/dist ./packages/ui/dist

# 复制其他必要文件
COPY apps/services/prisma ./apps/services/prisma
COPY apps/services/.env.example ./apps/services/.env.example

# 创建必要的目录并设置权限
RUN mkdir -p /app/logs /app/uploads && \
    chown -R nestjs:nodejs /app

# 切换到非 root 用户
USER nestjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# 使用 dumb-init 作为 PID 1
ENTRYPOINT ["dumb-init", "--"]

# 启动应用
CMD ["node", "apps/services/dist/main.js"]