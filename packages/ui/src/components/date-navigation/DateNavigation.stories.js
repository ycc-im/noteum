import { DateNavigation } from "./DateNavigation";
const meta = {
    title: "Components/DateNavigation",
    component: DateNavigation,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};
export default meta;
export const Default = {
    args: {
        selectedDate: new Date(),
        onDateChange: (date) => {
            console.log("Selected date:", date);
        },
    },
};
export const WithCustomDate = {
    args: {
        selectedDate: new Date("2025-02-07"),
        onDateChange: (date) => {
            console.log("Selected date:", date);
        },
    },
};
export const WithCustomClass = {
    args: {
        selectedDate: new Date(),
        onDateChange: (date) => {
            console.log("Selected date:", date);
        },
        className: "bg-slate-100 p-4 rounded-lg",
    },
};
//# sourceMappingURL=DateNavigation.stories.js.map