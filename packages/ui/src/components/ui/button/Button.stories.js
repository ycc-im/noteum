import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "./Button";
import { Icons } from "../icons/Icons";
const meta = {
    title: "UI/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
        },
        size: {
            control: "select",
            options: ["default", "sm", "lg", "icon"],
        },
        asChild: {
            control: "boolean",
        },
    },
};
export default meta;
export const Default = {
    args: {
        children: "按钮",
        variant: "default",
        size: "default",
    },
};
export const Destructive = {
    args: {
        children: "删除",
        variant: "destructive",
    },
};
export const Outline = {
    args: {
        children: "边框按钮",
        variant: "outline",
    },
};
export const Secondary = {
    args: {
        children: "次要按钮",
        variant: "secondary",
    },
};
export const Ghost = {
    args: {
        children: "幽灵按钮",
        variant: "ghost",
    },
};
export const Link = {
    args: {
        children: "链接按钮",
        variant: "link",
    },
};
export const Small = {
    args: {
        children: "小按钮",
        size: "sm",
    },
};
export const Large = {
    args: {
        children: "大按钮",
        size: "lg",
    },
};
export const IconButton = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsx(Button, { size: "icon", variant: "outline", children: _jsx(Icons.ChevronLeft, { className: "h-4 w-4" }) }), _jsx(Button, { size: "icon", variant: "outline", children: _jsx(Icons.Calendar, { className: "h-4 w-4" }) }), _jsx(Button, { size: "icon", variant: "outline", children: _jsx(Icons.ChevronRight, { className: "h-4 w-4" }) })] })),
};
export const IconWithText = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsxs(Button, { children: [_jsx(Icons.Calendar, { className: "mr-2 h-4 w-4" }), "\u9009\u62E9\u65E5\u671F"] }), _jsxs(Button, { variant: "outline", children: [_jsx(Icons.ChevronLeft, { className: "mr-2 h-4 w-4" }), "\u4E0A\u4E00\u9875"] }), _jsxs(Button, { variant: "outline", children: ["\u4E0B\u4E00\u9875", _jsx(Icons.ChevronRight, { className: "ml-2 h-4 w-4" })] })] })),
};
export const Disabled = {
    args: {
        children: "禁用按钮",
        disabled: true,
    },
};
//# sourceMappingURL=Button.stories.js.map