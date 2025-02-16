"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const react_query_1 = require("@tanstack/react-query");
const client_2 = require("@trpc/client");
const react_2 = require("react");
const TRPC_1 = require("./utils/TRPC/TRPC");
const App_1 = __importDefault(require("./App"));
console.log('初始化前端应用...');
console.log('创建 QueryClient...');
function TRPCProvider({ children }) {
    const [queryClient] = (0, react_2.useState)(() => new react_query_1.QueryClient());
    const [trpcClient] = (0, react_2.useState)(() => TRPC_1.trpc.createClient({
        links: [
            (0, client_2.httpBatchLink)({
                url: 'http://localhost:3000/trpc',
            }),
        ],
    }));
    return ((0, jsx_runtime_1.jsx)(TRPC_1.trpc.Provider, { client: trpcClient, queryClient: queryClient, children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient, children: children }) }));
}
const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error('找不到 root 元素!');
}
else {
    client_1.default.createRoot(rootElement).render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(TRPCProvider, { children: (0, jsx_runtime_1.jsx)(App_1.default, {}) }) }));
}
//# sourceMappingURL=main.js.map