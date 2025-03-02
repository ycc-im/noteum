import type { Meta, StoryObj } from "@storybook/react"
import { Icons } from "./Icons"
import * as React from "react"

const meta = {
  title: "UI/Icons",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} as Meta<{ icons: typeof Icons }>

export default meta
type Story = StoryObj<{ icons: typeof Icons }>

// 定义图标组件类型
type IconProps = React.SVGProps<SVGSVGElement> & { size?: number }

// 使用类型断言来解决类型问题
const IconDisplay = ({ icon: Icon }: { icon: React.FC<IconProps> }) => {
  const IconComponent = Icon as unknown as React.FC<{ className: string }>
  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <IconComponent className="h-6 w-6" />
      <span className="text-sm">{Icon.displayName || "Icon"}</span>
    </div>
  )
}

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(Icons).map(([name, Icon]) => (
        <IconDisplay key={name} icon={Icon as unknown as React.FC<IconProps>} />
      ))}
    </div>
  ),
}

export const Individual: Story = {
  render: () => {
    // 使用类型断言来解决类型问题
    const ChevronLeft = Icons.ChevronLeft as unknown as React.FC<{ className: string }>
    const ChevronRight = Icons.ChevronRight as unknown as React.FC<{ className: string }>
    const Calendar = Icons.Calendar as unknown as React.FC<{ className: string }>
    
    return (
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-2">
          <ChevronLeft className="h-6 w-6" />
          <span className="text-sm">ChevronLeft</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <ChevronRight className="h-6 w-6" />
          <span className="text-sm">ChevronRight</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Calendar className="h-6 w-6" />
          <span className="text-sm">Calendar</span>
        </div>
      </div>
    )
  },
}

export const Sizes: Story = {
  render: () => {
    // 使用类型断言来解决类型问题
    const Calendar = Icons.Calendar as unknown as React.FC<{ className: string }>
    
    return (
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Small</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Calendar className="h-6 w-6" />
          <span className="text-sm">Medium</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Calendar className="h-8 w-8" />
          <span className="text-sm">Large</span>
        </div>
      </div>
    )
  },
}
