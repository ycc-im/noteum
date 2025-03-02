import type { Meta, StoryObj } from "@storybook/react"
import { Popover, PopoverContent, PopoverTrigger } from "./Popover"
import { Button } from "../button/Button"

const meta = {
  title: "UI/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">打开弹出框</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">尺寸</h4>
            <p className="text-sm text-muted-foreground">
              设置你的最大宽度和高度
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithAlignment: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">对齐弹出框</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40">
        <div className="grid gap-2">
          <p>对齐到末端</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
