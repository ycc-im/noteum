// 使用条件导入以兼容不同环境
// 定义一个接口来定义我们需要的结果类型
interface ServeResult {
  stop: () => void;
  url: string;
}

// 使用类型断言来解决这个问题
let serve: unknown;
try {
  ({ serve } = await import('bun'));
} catch (error) {
  // 在 GitHub Actions 环境中，提供一个模拟的 serve 函数
  console.warn("Could not import 'bun', using mock implementation for CI environment");
  serve = () => ({ stop: () => {}, url: `http://localhost:${process.env.WEB_PORT}` });
}
import index from './index.html';

// 使用函数类型断言
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const server = (
  serve as (options: { routes: Record<string, unknown>; development?: boolean }) => ServeResult
)({
  routes: {
    // Serve index.html for all unmatched routes.
    '/*': index,

    '/api/hello': {
      async GET() {
        return Response.json({
          message: 'Hello, world!',
          method: 'GET',
        });
      },
      async PUT() {
        return Response.json({
          message: 'Hello, world!',
          method: 'PUT',
        });
      },
    },

    '/api/hello/:name': async (req: { params: { name: string } }) => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== 'production',
});

// 安全地访问 url 属性
const serverUrl =
  typeof server.url === 'string' ? server.url : `http://localhost:${process.env.WEB_PORT}`;
console.log(`🚀 Server running at ${serverUrl}`);
