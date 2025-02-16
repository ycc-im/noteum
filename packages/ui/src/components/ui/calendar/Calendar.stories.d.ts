import type { StoryObj } from "@storybook/react";
import { Calendar } from "./Calendar";
declare const meta: {
    title: string;
    component: typeof Calendar;
    parameters: {
        layout: string;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Range: Story;
export declare const Multiple: Story;
export declare const WithFooter: Story;
export declare const Disabled: Story;
export declare const WithDisabledDates: Story;
//# sourceMappingURL=Calendar.stories.d.ts.map