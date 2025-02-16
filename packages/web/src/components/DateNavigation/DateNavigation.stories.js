"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithCustomClass = exports.WithCustomDate = exports.Default = void 0;
const DateNavigation_1 = require("../date-navigation/DateNavigation");
const meta = {
    title: "Components/DateNavigation",
    component: DateNavigation_1.DateNavigation,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
exports.default = meta;
exports.Default = {
    args: {
        selectedDate: new Date(),
        onDateChange: (date) => {
            console.log("Selected date:", date);
        },
    },
};
exports.WithCustomDate = {
    args: {
        selectedDate: new Date("2025-02-07"),
        onDateChange: (date) => {
            console.log("Selected date:", date);
        },
    },
};
exports.WithCustomClass = {
    args: {
        selectedDate: new Date(),
        onDateChange: (date) => {
            console.log("Selected date:", date);
        },
        className: "bg-slate-100 p-4 rounded-lg",
    },
};
//# sourceMappingURL=DateNavigation.stories.js.map