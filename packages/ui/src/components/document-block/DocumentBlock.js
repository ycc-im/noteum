import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
export function DocumentBlock({ block, className, onIndentChange }) {
    const handleIndentIncrease = () => {
        onIndentChange?.(block.id, block.indent + 1);
    };
    const handleIndentDecrease = () => {
        if (block.indent > 0) {
            onIndentChange?.(block.id, block.indent - 1);
        }
    };
    const renderBlockContent = () => {
        switch (block.type) {
            case 'heading':
                return _jsx("h2", { className: "text-2xl font-bold", children: block.content });
            case 'paragraph':
                return _jsx("p", { className: "text-base", children: block.content });
            case 'list-item':
                return (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-current mr-2" }), block.content] }));
            case 'code':
                return (_jsx("pre", { className: "bg-muted p-2 rounded", children: _jsx("code", { children: block.content }) }));
            case 'quote':
                return (_jsx("blockquote", { className: "border-l-4 border-primary pl-4", children: block.content }));
            default:
                return block.content;
        }
    };
    return (_jsxs("div", { className: cn("group relative flex items-start p-2 hover:bg-muted/50 rounded-md transition-colors", className), style: { marginLeft: `${block.indent * 24}px` }, children: [_jsxs("div", { className: "absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 px-2", children: [_jsx("button", { onClick: handleIndentDecrease, className: "p-1 hover:bg-muted rounded disabled:opacity-50", disabled: block.indent === 0, children: _jsx(ChevronRightIcon, {}) }), _jsx("button", { onClick: handleIndentIncrease, className: "p-1 hover:bg-muted rounded", children: _jsx(ChevronDownIcon, {}) })] }), _jsx("div", { className: "flex-1", children: renderBlockContent() })] }));
}
//# sourceMappingURL=DocumentBlock.js.map