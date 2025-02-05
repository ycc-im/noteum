FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]
