"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const TestTRPC_1 = require("./components/TestTRPC/TestTRPC");
function App() {
    console.log('渲染 App 组件...');
    return ((0, jsx_runtime_1.jsx)("div", { style: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
        }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }, children: [(0, jsx_runtime_1.jsx)("h1", { style: {
                        color: '#333',
                        marginTop: 0,
                        marginBottom: '20px',
                    }, children: "Noteum tRPC \u6D4B\u8BD5" }), (0, jsx_runtime_1.jsx)(TestTRPC_1.TestTRPC, {})] }) }));
}
exports.default = App;
//# sourceMappingURL=App.js.map