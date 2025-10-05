import { jsx, jsxs } from 'react/jsx-runtime';
import { Link } from '@tanstack/react-router';
import { useLogto } from '@logto/react';

const logo = "/assets/logo-CHtJT8UQ.svg";
function HomePage() {
  const {
    isAuthenticated,
    isLoading
  } = useLogto();
  return /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("header", { className: "min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]", children: [
    /* @__PURE__ */ jsx("img", { src: logo, className: "h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]", alt: "logo" }),
    /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "\u6B22\u8FCE\u6765\u5230 Noteum" }),
    isLoading ? /* @__PURE__ */ jsx("p", { className: "text-xl mb-8", children: "\u52A0\u8F7D\u4E2D..." }) : isAuthenticated ? /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xl mb-4", children: "\u60A8\u5DF2\u6210\u529F\u767B\u5F55\uFF01" }),
      /* @__PURE__ */ jsx(Link, { to: "/dashboard", className: "inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors", children: "\u8FDB\u5165\u4EEA\u8868\u677F" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xl mb-6", children: "\u5F00\u59CB\u4F7F\u7528\u667A\u80FD\u7B14\u8BB0\u7CFB\u7EDF" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors", children: "\u7ACB\u5373\u767B\u5F55" }),
        /* @__PURE__ */ jsx(Link, { to: "/login", className: "px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#282c34] transition-colors", children: "\u6CE8\u518C\u8D26\u6237" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 text-base", children: [
      /* @__PURE__ */ jsx("a", { className: "text-[#61dafb] hover:underline", href: "https://reactjs.org", target: "_blank", rel: "noopener noreferrer", children: "Learn React" }),
      /* @__PURE__ */ jsx("a", { className: "text-[#61dafb] hover:underline", href: "https://tanstack.com", target: "_blank", rel: "noopener noreferrer", children: "Learn TanStack" })
    ] })
  ] }) });
}

export { HomePage as component };
//# sourceMappingURL=index-0Axb7Fjc.mjs.map
