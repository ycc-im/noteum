# Web服务专用Dockerfile
FROM oven/bun:latest

WORKDIR /app
COPY package.json .
RUN bun install --frozen-lockfile

COPY . .

CMD ["bun", "run", "dev"]