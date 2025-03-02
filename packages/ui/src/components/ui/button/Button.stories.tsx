import type { Meta, StoryObj } from "@storybook/react"
import { Button, type ButtonProps } from "./Button"
import { Icons } from "../icons/Icons"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
      description: "按钮样式变体"
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "按钮尺寸"
    },
    asChild: {
      control: "boolean",
      description: "是否作为子元素"
    },
  },
} as Meta<typeof Button>

export default meta
// 使用正确的类型，确保 args 中可以使用 children
type Story = StoryObj<ButtonProps>

export const Default: Story = {
  args: {
    children: "按钮",
    variant: "default",
    size: "default",
  },
}

export const Destructive: Story = {
  args: {
    children: "删除",
    variant: "destructive",
  },
}

export const Outline: Story = {
  args: {
    children: "边框按钮",
    variant: "outline",
  },
}

export const Secondary: Story = {
  args: {
    children: "次要按钮",
    variant: "secondary",
  },
}

export const Ghost: Story = {
  args: {
    children: "幽灵按钮",
    variant: "ghost",
  },
}

export const Link: Story = {
  args: {
    children: "链接按钮",
    variant: "link",
  },
}

export const Small: Story = {
  args: {
    children: "小按钮",
    size: "sm",
  },
}

export const Large: Story = {
  args: {
    children: "大按钮",
    size: "lg",
  },
}

export const IconButton: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button size="icon" variant="outline">
        <Icons.ChevronLeft className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <Icons.Calendar className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="outline">
        <Icons.ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  ),
}

export const IconWithText: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>
        <Icons.Calendar className="mr-2 h-4 w-4" />
        选择日期
      </Button>
      <Button variant="outline">
        <Icons.ChevronLeft className="mr-2 h-4 w-4" />
        上一页
      </Button>
      <Button variant="outline">
        下一页
        <Icons.ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    children: "禁用按钮",
    disabled: true,
  },
}
