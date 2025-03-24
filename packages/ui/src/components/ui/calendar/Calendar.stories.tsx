import type { Meta, StoryObj } from '@storybook/react'
import { Calendar } from './Calendar'
import { addDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  args: {
    mode: 'single',
    showOutsideDays: true,
    highlightToday: true,
  },
}

export default meta
type Story = StoryObj<typeof Calendar>

// 基础日历
export const Basic: Story = {
  args: {},
}

// 范围选择
export const RangeSelection: Story = {
  args: {
    mode: 'range',
    enableRangeSelection: true,
    initialDate: new Date(),
  },
}

// 带数据展示
export const WithData: Story = {
  args: {
    dateData: {
      [new Date().toISOString().split('T')[0]]: {
        noteCount: 3,
        hasImportantItems: true,
        activityLevel: 8,
      },
      [addDays(new Date(), 1).toISOString().split('T')[0]]: {
        noteCount: 1,
        hasImportantItems: false,
        activityLevel: 2,
      },
    },
  },
}

// 自定义视图
export const CustomView: Story = {
  args: {
    initialView: 'week',
    onViewChange: (view) => console.log('View changed to:', view),
  },
}

// 日期变化事件
export const DateChangeEvents: Story = {
  args: {
    onDateChange: (date) => console.log('Date changed to:', date),
    onDateSelect: (date) => console.log('Date selected:', date),
  },
}

// 多语言支持
export const Localization: Story = {
  args: {
    locale: zhCN,
  },
}

// 自定义日期渲染
export const CustomDateContent: Story = {
  args: {
    renderDateContent: (date, data) => (
      <div className="flex flex-col items-center">
        <span>{date.getDate()}</span>
        {data?.noteCount && <span className="text-xs text-primary">({data.noteCount})</span>}
      </div>
    ),
    dateData: {
      [new Date().toISOString().split('T')[0]]: {
        noteCount: 5,
        hasImportantItems: true,
        activityLevel: 9,
      },
    },
  },
}

// 完整功能展示
export const FullFeatured: Story = {
  args: {
    mode: 'range',
    enableRangeSelection: true,
    showOutsideDays: true,
    highlightToday: true,
    dateData: {
      [new Date().toISOString().split('T')[0]]: {
        noteCount: 5,
        hasImportantItems: true,
        activityLevel: 9,
      },
    },
    onDateChange: (date) => console.log('Date changed:', date),
    onViewChange: (view) => console.log('View changed:', view),
    onDateSelect: (date) => console.log('Date selected:', date),
    onRangeSelect: (range) => console.log('Range selected:', range),
    locale: zhCN,
    initialView: 'month',
  },
}
