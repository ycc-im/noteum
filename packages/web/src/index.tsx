// 使用条件导入以兼容不同环境
let serve: any;
try {
  ({ serve } = await import("bun"));
} catch (error) {
  // 在 GitHub Actions 环境中，提供一个模拟的 serve 函数
  console.warn("Could not import 'bun', using mock implementation for CI environment");
  serve = () => ({ stop: () => {} });
}
import index from "./index.html";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET() {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT() {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async (req: { params: { name: string } }) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production",
});

console.log(`🚀 Server running at ${server.url}`);
