import { jsx as _jsx } from "react/jsx-runtime";
import { Calendar } from "./Calendar";
import { zhCN } from "date-fns/locale";
const meta = {
    title: "UI/Calendar",
    component: Calendar,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
export default meta;
export const Default = {
    args: {
        mode: "single",
        selected: new Date(),
        locale: zhCN,
        weekStartsOn: 1,
        ISOWeek: true,
        fixedWeeks: true,
        fromDate: new Date(2024, 0, 1),
        toDate: new Date(2025, 11, 31),
    },
};
export const Range = {
    args: {
        mode: "range",
        selected: {
            from: new Date(2025, 1, 1),
            to: new Date(2025, 1, 10),
        },
        locale: zhCN,
        weekStartsOn: 1,
        ISOWeek: true,
    },
};
export const Multiple = {
    args: {
        mode: "multiple",
        selected: [
            new Date(2025, 1, 1),
            new Date(2025, 1, 5),
            new Date(2025, 1, 10),
        ],
        locale: zhCN,
        weekStartsOn: 1,
        ISOWeek: true,
    },
};
export const WithFooter = {
    args: {
        mode: "single",
        selected: new Date(),
        locale: zhCN,
        weekStartsOn: 1,
        ISOWeek: true,
        footer: _jsx("div", { className: "p-2 text-center", children: "\u81EA\u5B9A\u4E49\u9875\u811A\u5185\u5BB9" }),
    },
};
export const Disabled = {
    args: {
        mode: "single",
        selected: new Date(),
        locale: zhCN,
        weekStartsOn: 1,
        ISOWeek: true,
        disabled: true,
    },
};
export const WithDisabledDates = {
    args: {
        mode: "single",
        selected: new Date(),
        locale: zhCN,
        weekStartsOn: 1,
        ISOWeek: true,
        disabled: [
            { from: new Date(2025, 1, 1), to: new Date(2025, 1, 5) },
            { from: new Date(2025, 1, 15), to: new Date(2025, 1, 20) },
        ],
    },
};
//# sourceMappingURL=Calendar.stories.js.map