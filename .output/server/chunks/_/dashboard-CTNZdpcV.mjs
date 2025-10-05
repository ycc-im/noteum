import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React from 'react';
import { useLogto } from '@logto/react';
import { useNavigate } from '@tanstack/react-router';

function ProtectedRoute({
  children,
  fallback
}) {
  const { isAuthenticated, isLoading } = useLogto();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname + window.location.search;
      navigate({
        to: "/login",
        search: currentPath !== "/" ? { redirect: currentPath } : void 0
      });
    }
  }, [isLoading, isAuthenticated, navigate]);
  if (isLoading) {
    return fallback || /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 text-gray-600", children: "\u9A8C\u8BC1\u8EAB\u4EFD\u4E2D..." })
    ] }) });
  }
  if (!isAuthenticated) {
    return null;
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function Dashboard(props) {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-100", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "md:flex md:items-center md:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate", children: "\u4EEA\u8868\u677F" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "\u6B22\u8FCE\u56DE\u5230 Noteum\uFF0C\u7BA1\u7406\u60A8\u7684\u7B14\u8BB0\u548C\u77E5\u8BC6\u4F53\u7CFB" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-4 flex md:mt-0 md:ml-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
          children: "\u65B0\u5EFA\u7B14\u8BB0"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-medium", children: "\u{1F4DD}" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u603B\u7B14\u8BB0\u6570" }),
          /* @__PURE__ */ jsx("dd", { className: "text-lg font-medium text-gray-900", children: "42" })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-green-500 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-medium", children: "\u{1F517}" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u8FDE\u63A5\u6570" }),
          /* @__PURE__ */ jsx("dd", { className: "text-lg font-medium text-gray-900", children: "128" })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-medium", children: "\u2B50" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u6536\u85CF\u7B14\u8BB0" }),
          /* @__PURE__ */ jsx("dd", { className: "text-lg font-medium text-gray-900", children: "7" })
        ] }) })
      ] }) }) }),
      /* @__PURE__ */ jsx("div", { className: "bg-white overflow-hidden shadow rounded-lg", children: /* @__PURE__ */ jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "w-8 h-8 bg-red-500 rounded-md flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white text-sm font-medium", children: "\u{1F4C5}" }) }) }),
        /* @__PURE__ */ jsx("div", { className: "ml-5 w-0 flex-1", children: /* @__PURE__ */ jsxs("dl", { children: [
          /* @__PURE__ */ jsx("dt", { className: "text-sm font-medium text-gray-500 truncate", children: "\u672C\u5468\u6D3B\u52A8" }),
          /* @__PURE__ */ jsx("dd", { className: "text-lg font-medium text-gray-900", children: "15" })
        ] }) })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white shadow rounded-lg", children: /* @__PURE__ */ jsxs("div", { className: "px-4 py-5 sm:p-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg leading-6 font-medium text-gray-900", children: "\u6700\u8FD1\u7684\u7B14\u8BB0" }),
      /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-500", children: "\u60A8\u6700\u8FD1\u7F16\u8F91\u6216\u521B\u5EFA\u7684\u7B14\u8BB0" }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-3", children: [
        { title: "\u9879\u76EE\u8BA1\u5212\u6587\u6863", time: "2 \u5C0F\u65F6\u524D" },
        { title: "\u4F1A\u8BAE\u8BB0\u5F55 - \u4EA7\u54C1\u8BA8\u8BBA", time: "\u6628\u5929" },
        { title: "React \u6700\u4F73\u5B9E\u8DF5", time: "3 \u5929\u524D" }
      ].map((note, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer",
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-gray-900", children: note.title }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: note.time })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "text-indigo-600 hover:text-indigo-900 text-sm font-medium", children: "\u7F16\u8F91" })
          ]
        },
        index
      )) })
    ] }) }) })
  ] }) });
}
function DashboardPage() {
  return /* @__PURE__ */ jsx(ProtectedRoute, { children: /* @__PURE__ */ jsx(Dashboard, {}) });
}

export { DashboardPage as component };
//# sourceMappingURL=dashboard-CTNZdpcV.mjs.map
