import { $ } from 'bun'

// 清理之前的构建产物
await $`rm -rf dist`.quiet()

// 使用 bun 编译 TypeScript 代码
await $`bun build ./src/index.ts --outdir dist --target bun`.quiet()

// 生成类型定义文件
await $`bun run tsc --declaration --emitDeclarationOnly --outDir dist/types`.quiet()

console.log('Build completed successfully!')
