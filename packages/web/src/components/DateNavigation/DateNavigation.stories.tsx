import type { Meta, StoryObj } from "@storybook/react"
import { DateNavigation } from "../date-navigation/DateNavigation"

const meta = {
  title: "Components/DateNavigation",
  component: DateNavigation,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DateNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    selectedDate: new Date(),
    onDateChange: (date: Date) => {
      console.log("Selected date:", date)
    },
  },
}

export const WithCustomDate: Story = {
  args: {
    selectedDate: new Date("2025-02-07"),
    onDateChange: (date: Date) => {
      console.log("Selected date:", date)
    },
  },
}

export const WithCustomClass: Story = {
  args: {
    selectedDate: new Date(),
    onDateChange: (date: Date) => {
      console.log("Selected date:", date)
    },
    className: "bg-slate-100 p-4 rounded-lg",
  },
}
