import type { StoryObj } from "@storybook/react";
import { DateNavigation } from "./DateNavigation";
declare const meta: {
    title: string;
    component: typeof DateNavigation;
    parameters: {
        layout: string;
    };
    tags: string[];
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const WithCustomDate: Story;
export declare const WithCustomClass: Story;
//# sourceMappingURL=DateNavigation.stories.d.ts.map