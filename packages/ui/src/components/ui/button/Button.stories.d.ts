import type { StoryObj } from "@storybook/react";
declare const meta: {
    title: string;
    component: import("react").ForwardRefExoticComponent<import("./Button").ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
    parameters: {
        layout: string;
    };
    tags: string[];
    argTypes: {
        variant: {
            control: "select";
            options: string[];
        };
        size: {
            control: "select";
            options: string[];
        };
        asChild: {
            control: "boolean";
        };
    };
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
export declare const Destructive: Story;
export declare const Outline: Story;
export declare const Secondary: Story;
export declare const Ghost: Story;
export declare const Link: Story;
export declare const Small: Story;
export declare const Large: Story;
export declare const IconButton: Story;
export declare const IconWithText: Story;
export declare const Disabled: Story;
//# sourceMappingURL=Button.stories.d.ts.map