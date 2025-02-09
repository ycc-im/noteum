import type { Meta, StoryObj } from "@storybook/react"
import { Calendar } from "./Calendar"
import { zhCN } from "date-fns/locale"

const meta = {
  title: "UI/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    mode: "single",
    selected: new Date(),
    locale: zhCN,
  },
}

export const Range: Story = {
  args: {
    mode: "range",
    selected: {
      from: new Date(2025, 1, 1),
      to: new Date(2025, 1, 10),
    },
    locale: zhCN,
  },
}

export const Multiple: Story = {
  args: {
    mode: "multiple",
    selected: [
      new Date(2025, 1, 1),
      new Date(2025, 1, 5),
      new Date(2025, 1, 10),
    ],
    locale: zhCN,
  },
}

export const WithFooter: Story = {
  args: {
    mode: "single",
    selected: new Date(),
    locale: zhCN,
    footer: <div className="p-2 text-center">自定义页脚内容</div>,
  },
}

export const Disabled: Story = {
  args: {
    mode: "single",
    selected: new Date(),
    locale: zhCN,
    disabled: true,
  },
}

export const WithDisabledDates: Story = {
  args: {
    mode: "single",
    selected: new Date(),
    locale: zhCN,
    disabled: [
      { from: new Date(2025, 1, 1), to: new Date(2025, 1, 5) },
      { from: new Date(2025, 1, 15), to: new Date(2025, 1, 20) },
    ],
  },
}
