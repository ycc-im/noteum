import { z } from 'zod';
// 定义输入验证 schema
export const exampleInputSchema = z.object({
    name: z.string().min(1, '名字不能为空').max(50, '名字太长了')
}).optional().default({ name: '世界' });
