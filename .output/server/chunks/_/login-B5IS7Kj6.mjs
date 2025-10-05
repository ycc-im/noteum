import { jsx, jsxs } from 'react/jsx-runtime';
import { useEffect } from 'react';
import { useLogto } from '@logto/react';
import { useNavigate, useSearch } from '@tanstack/react-router';

function Login(props) {
  const { signIn, isAuthenticated, isLoading } = useLogto();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = search.redirect || "/dashboard";
      navigate({ to: redirectTo });
      return;
    }
  }, [isAuthenticated, isLoading, signIn, navigate, search.redirect]);
  if (isLoading || isAuthenticated) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-600", children: "\u6B63\u5728\u8DF3\u8F6C\u5230\u767B\u5F55\u9875\u9762..." })
    ] }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md w-full space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "\u767B\u5F55\u5230 Noteum" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "\u6B63\u5728\u8DF3\u8F6C\u5230\u5B89\u5168\u767B\u5F55\u9875\u9762..." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => {
        },
        className: "group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        children: "\u70B9\u51FB\u767B\u5F55"
      }
    ) })
  ] }) });
}
const SplitComponent = Login;

export { SplitComponent as component };
//# sourceMappingURL=login-B5IS7Kj6.mjs.map
