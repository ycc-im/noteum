import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Popover, PopoverContent, PopoverTrigger } from "./Popover";
import { Button } from "../button/Button";
const meta = {
    title: "UI/Popover",
    component: Popover,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
export default meta;
export const Default = {
    render: () => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "\u6253\u5F00\u5F39\u51FA\u6846" }) }), _jsx(PopoverContent, { children: _jsxs("div", { className: "grid gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-medium leading-none", children: "\u5C3A\u5BF8" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "\u8BBE\u7F6E\u4F60\u7684\u6700\u5927\u5BBD\u5EA6\u548C\u9AD8\u5EA6" })] }), _jsxs("div", { className: "grid gap-2", children: [_jsxs("div", { className: "grid grid-cols-3 items-center gap-4", children: [_jsx("label", { htmlFor: "width", children: "\u5BBD\u5EA6" }), _jsx("input", { id: "width", defaultValue: "100%", className: "col-span-2 h-8" })] }), _jsxs("div", { className: "grid grid-cols-3 items-center gap-4", children: [_jsx("label", { htmlFor: "maxWidth", children: "\u6700\u5927\u5BBD\u5EA6" }), _jsx("input", { id: "maxWidth", defaultValue: "300px", className: "col-span-2 h-8" })] }), _jsxs("div", { className: "grid grid-cols-3 items-center gap-4", children: [_jsx("label", { htmlFor: "height", children: "\u9AD8\u5EA6" }), _jsx("input", { id: "height", defaultValue: "25px", className: "col-span-2 h-8" })] }), _jsxs("div", { className: "grid grid-cols-3 items-center gap-4", children: [_jsx("label", { htmlFor: "maxHeight", children: "\u6700\u5927\u9AD8\u5EA6" }), _jsx("input", { id: "maxHeight", defaultValue: "none", className: "col-span-2 h-8" })] })] })] }) })] })),
};
export const WithDifferentAlignments = {
    render: () => (_jsxs("div", { className: "flex space-x-4", children: [_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "\u5DE6\u5BF9\u9F50" }) }), _jsx(PopoverContent, { align: "start", className: "w-40", children: _jsx("div", { className: "text-sm", children: "\u8FD9\u662F\u5DE6\u5BF9\u9F50\u7684\u5F39\u51FA\u5185\u5BB9" }) })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "\u5C45\u4E2D\u5BF9\u9F50" }) }), _jsx(PopoverContent, { align: "center", className: "w-40", children: _jsx("div", { className: "text-sm", children: "\u8FD9\u662F\u5C45\u4E2D\u5BF9\u9F50\u7684\u5F39\u51FA\u5185\u5BB9" }) })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", children: "\u53F3\u5BF9\u9F50" }) }), _jsx(PopoverContent, { align: "end", className: "w-40", children: _jsx("div", { className: "text-sm", children: "\u8FD9\u662F\u53F3\u5BF9\u9F50\u7684\u5F39\u51FA\u5185\u5BB9" }) })] })] })),
};
//# sourceMappingURL=Popover.stories.js.map