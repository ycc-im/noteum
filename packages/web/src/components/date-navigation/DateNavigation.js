"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateNavigation = DateNavigation;
const jsx_runtime_1 = require("react/jsx-runtime");
const date_fns_1 = require("date-fns");
const react_icons_1 = require("@radix-ui/react-icons");
const locale_1 = require("date-fns/locale");
const ui_1 = require("@noteum/ui");
function DateNavigation({ selectedDate, onDateChange, className, }) {
    const handlePrevDay = () => {
        onDateChange((0, date_fns_1.subDays)(selectedDate, 1));
    };
    const handleNextDay = () => {
        onDateChange((0, date_fns_1.addDays)(selectedDate, 1));
    };
    const handleToday = () => {
        onDateChange(new Date());
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, ui_1.cn)("flex items-center space-x-1", className), children: [(0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "icon", onClick: handlePrevDay, className: "h-8 w-8", children: [(0, jsx_runtime_1.jsx)(react_icons_1.ChevronLeftIcon, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "\u524D\u4E00\u5929" })] }), (0, jsx_runtime_1.jsx)(ui_1.Button, { variant: "outline", size: "sm", onClick: handleToday, className: "h-8", children: "\u4ECA\u5929" }), (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "icon", onClick: handleNextDay, className: "h-8 w-8", children: [(0, jsx_runtime_1.jsx)(react_icons_1.ChevronRightIcon, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "sr-only", children: "\u540E\u4E00\u5929" })] }), (0, jsx_runtime_1.jsxs)(ui_1.Popover, { children: [(0, jsx_runtime_1.jsx)(ui_1.PopoverTrigger, { asChild: true, children: (0, jsx_runtime_1.jsxs)(ui_1.Button, { variant: "outline", size: "sm", className: (0, ui_1.cn)("h-8 w-[140px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground"), children: [(0, jsx_runtime_1.jsx)(react_icons_1.CalendarIcon, { className: "mr-2 h-4 w-4" }), selectedDate ? ((0, date_fns_1.format)(selectedDate, "PPP", { locale: locale_1.zhCN })) : ((0, jsx_runtime_1.jsx)("span", { children: "\u9009\u62E9\u65E5\u671F" }))] }) }), (0, jsx_runtime_1.jsx)(ui_1.PopoverContent, { className: "w-auto p-0", align: "start", children: (0, jsx_runtime_1.jsx)(ui_1.Calendar, { mode: "single", selected: selectedDate, onSelect: (date) => date && onDateChange(date), initialFocus: true, locale: locale_1.zhCN }) })] })] }));
}
//# sourceMappingURL=DateNavigation.js.map