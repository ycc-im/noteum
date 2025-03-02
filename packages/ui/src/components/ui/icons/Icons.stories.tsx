import type { Meta, StoryObj } from "@storybook/react"
import { Icons } from "./Icons"

const meta = {
  title: "UI/Icons",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Icons>

export default meta
type Story = StoryObj<typeof meta>

const IconDisplay = ({ icon: Icon }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) => (
  <div className="flex flex-col items-center gap-2 p-4">
    <Icon className="h-6 w-6" />
    <span className="text-sm">{Icon.name}</span>
  </div>
)

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      {Object.entries(Icons).map(([name, Icon]) => (
        <IconDisplay key={name} icon={Icon} />
      ))}
    </div>
  ),
}

export const Individual: Story = {
  render: () => (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icons.ChevronLeft className="h-6 w-6" />
        <span className="text-sm">ChevronLeft</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icons.ChevronRight className="h-6 w-6" />
        <span className="text-sm">ChevronRight</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icons.Calendar className="h-6 w-6" />
        <span className="text-sm">Calendar</span>
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <div className="flex flex-col items-center gap-2">
        <Icons.Calendar className="h-4 w-4" />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icons.Calendar className="h-6 w-6" />
        <span className="text-sm">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Icons.Calendar className="h-8 w-8" />
        <span className="text-sm">Large</span>
      </div>
    </div>
  ),
}
