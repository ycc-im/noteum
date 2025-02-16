"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTRPC = TestTRPC;
const jsx_runtime_1 = require("react/jsx-runtime");
const TRPC_1 = require("../../utils/TRPC/TRPC");
function TestTRPC() {
    const hello = TRPC_1.trpc.example.hello.useQuery({ name: '前端' }, {
        retry: false,
    });
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }, children: [hello.isLoading && ((0, jsx_runtime_1.jsx)("p", { style: { color: 'blue' }, children: "\u52A0\u8F7D\u4E2D..." })), hello.data && ((0, jsx_runtime_1.jsxs)("p", { style: { color: 'green' }, children: ["\u670D\u52A1\u5668\u8FD4\u56DE: ", hello.data.message] })), hello.error && ((0, jsx_runtime_1.jsxs)("p", { style: { color: 'red' }, children: ["\u9519\u8BEF: ", hello.error.message] }))] }));
}
//# sourceMappingURL=TestTRPC.js.map