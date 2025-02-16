import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icons } from "./Icons";
const meta = {
    title: "UI/Icons",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
export default meta;
const IconDisplay = ({ icon: Icon }) => (_jsxs("div", { className: "flex flex-col items-center gap-2 p-4", children: [_jsx(Icon, { className: "h-6 w-6" }), _jsx("span", { className: "text-sm", children: Icon.name })] }));
export const AllIcons = {
    render: () => (_jsx("div", { className: "grid grid-cols-3 gap-4", children: Object.entries(Icons).map(([name, Icon]) => (_jsx(IconDisplay, { icon: Icon }, name))) })),
};
export const Individual = {
    render: () => (_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icons.ChevronLeft, { className: "h-6 w-6" }), _jsx("span", { className: "text-sm", children: "ChevronLeft" })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icons.ChevronRight, { className: "h-6 w-6" }), _jsx("span", { className: "text-sm", children: "ChevronRight" })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icons.Calendar, { className: "h-6 w-6" }), _jsx("span", { className: "text-sm", children: "Calendar" })] })] })),
};
export const Sizes = {
    render: () => (_jsxs("div", { className: "flex items-end gap-4", children: [_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icons.Calendar, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm", children: "Small" })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icons.Calendar, { className: "h-6 w-6" }), _jsx("span", { className: "text-sm", children: "Medium" })] }), _jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx(Icons.Calendar, { className: "h-8 w-8" }), _jsx("span", { className: "text-sm", children: "Large" })] })] })),
};
//# sourceMappingURL=Icons.stories.js.map