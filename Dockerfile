FROM node:22-slim

# 安装必要的包
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    procps \
    && rm -rf /var/lib/apt/lists/*

# 创建非 root 用户
RUN useradd -m -s /bin/bash developer

# 设置环境变量
ENV PNPM_HOME=/home/developer/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV NODE_ENV=development

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# 创建必要的目录
RUN mkdir -p /app/node_modules \
    && mkdir -p /home/developer/.local/share/pnpm/store \
    && chown -R developer:developer /home/developer \
    && chown -R developer:developer /app

WORKDIR /app

# 切换到非 root 用户
USER developer

# 配置 pnpm
RUN pnpm config set store-dir /home/developer/.local/share/pnpm/store

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# 默认命令
CMD ["bash"]
