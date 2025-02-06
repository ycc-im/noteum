FROM node:20-slim

# 安装必要的包
RUN apt-get update && apt-get install -y git

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@8 --activate

WORKDIR /app

# 设置环境变量
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

# 默认命令
CMD ["bash"]
