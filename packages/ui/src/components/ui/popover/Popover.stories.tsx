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
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width">宽度</label>
              <input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxWidth">最大宽度</label>
              <input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="height">高度</label>
              <input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxHeight">最大高度</label>
              <input
                id="maxHeight"
                defaultValue="none"
                className="col-span-2 h-8"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const WithDifferentAlignments: Story = {
  render: () => (
    <div className="flex space-x-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">左对齐</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-40">
          <div className="text-sm">这是左对齐的弹出内容</div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">居中对齐</Button>
        </PopoverTrigger>
        <PopoverContent align="center" className="w-40">
          <div className="text-sm">这是居中对齐的弹出内容</div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">右对齐</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-40">
          <div className="text-sm">这是右对齐的弹出内容</div>
        </PopoverContent>
      </Popover>
    </div>
  ),
}
