import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../src/lib/utils';
export const withThemeProvider = (Story) => {
    return (_jsx("div", { className: cn("min-h-screen", "bg-background text-foreground", "[&:has([data-theme=dark])]:bg-slate-950", "[&:has([data-theme=dark])]:text-slate-50"), children: _jsx(Story, {}) }));
};
//# sourceMappingURL=decorators.js.map