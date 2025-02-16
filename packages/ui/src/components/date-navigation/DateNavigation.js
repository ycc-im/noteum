import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { addDays, format, subDays } from "date-fns";
import { Icons } from "@/components/ui/icons/Icons";
import { zhCN } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/Button";
import { Calendar } from "@/components/ui/calendar/Calendar";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover/Popover";
export function DateNavigation({ selectedDate, onDateChange, className, }) {
    const handlePrevDay = () => {
        onDateChange(subDays(selectedDate, 1));
    };
    const handleNextDay = () => {
        onDateChange(addDays(selectedDate, 1));
    };
    const handleToday = () => {
        onDateChange(new Date());
    };
    return (_jsxs("div", { className: cn("flex items-center space-x-1", className), children: [_jsxs(Button, { variant: "outline", size: "icon", onClick: handlePrevDay, className: "h-8 w-8", children: [_jsx(Icons.ChevronLeft, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "\u524D\u4E00\u5929" })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleToday, className: "h-8", children: "\u4ECA\u5929" }), _jsxs(Button, { variant: "outline", size: "icon", onClick: handleNextDay, className: "h-8 w-8", children: [_jsx(Icons.ChevronRight, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "\u540E\u4E00\u5929" })] }), _jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", size: "sm", className: cn("h-8 w-[140px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground"), children: [_jsx(Icons.Calendar, { className: "mr-2 h-4 w-4" }), selectedDate ? (format(selectedDate, "PPP", { locale: zhCN })) : (_jsx("span", { children: "\u9009\u62E9\u65E5\u671F" }))] }) }), _jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: _jsx(Calendar, { mode: "single", selected: selectedDate, onSelect: (date) => date && onDateChange(date), initialFocus: true, locale: zhCN }) })] })] }));
}
//# sourceMappingURL=DateNavigation.js.map