import { jsx, jsxs } from 'react/jsx-runtime';
import { useNavigate } from '@tanstack/react-router';
import { useHandleSignInCallback } from '@logto/react';

function AuthCallbackPage() {
  const navigate = useNavigate();
  const {
    isLoading
  } = useHandleSignInCallback(() => {
    console.log("Logto \u767B\u5F55\u56DE\u8C03\u5904\u7406\u5B8C\u6210");
    let redirectTo = "/";
    console.log("\u51C6\u5907\u8DF3\u8F6C\u5230:", redirectTo);
    setTimeout(() => {
      navigate({
        to: redirectTo,
        replace: true
      });
    }, 500);
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" }),
      /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-gray-900", children: "\u5904\u7406\u767B\u5F55\u7ED3\u679C" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-gray-600", children: "\u8BF7\u7A0D\u5019\uFF0C\u6B63\u5728\u9A8C\u8BC1\u60A8\u7684\u8EAB\u4EFD..." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "text-green-500 text-6xl mb-4", children: "\u2705" }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: "\u767B\u5F55\u6210\u529F" }),
    /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "\u6B63\u5728\u8DF3\u8F6C..." })
  ] }) });
}

export { AuthCallbackPage as component };
//# sourceMappingURL=auth.callback-kEUQ_sCe.mjs.map
