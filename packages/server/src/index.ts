import { trpc } from "@elysiajs/trpc";
import { initTRPC } from "@trpc/server";
import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger';
import cors from '@elysiajs/cors';
import { pingRouter } from "./routers/ping";

const t = initTRPC.create();

const router = t.router({
  ...pingRouter._def.procedures,
});

export type Router = typeof router;

// 获取环境变量PORT，默认为9157
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9157;

export const app = new Elysia()
  .use(cors())
  .use(swagger())
  // 添加根路径处理程序
  .get("/", () => {
    return {
      message: "Server is running. Try accessing /trpc/ping to test the API.",
      endpoints: {
        trpc: "/trpc",
        ping: "/trpc/ping",
        swagger: "/swagger"
      }
    };
  })
  .use(trpc(router, {
    endpoint: "/trpc",
  }))
  .listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/trpc`);
  });