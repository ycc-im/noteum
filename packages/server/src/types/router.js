"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exampleInputSchema = void 0;
const zod_1 = require("zod");
// 示例输入验证 schema
exports.exampleInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, '名字不能为空').max(50, '名字太长了')
}).optional().default({ name: '世界' });
//# sourceMappingURL=router.js.map