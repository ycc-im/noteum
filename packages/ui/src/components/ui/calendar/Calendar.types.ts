import type { SelectRangeEventHandler, DayProps } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'
import type { Locale } from 'date-fns'

export type CalendarView = 'day' | 'week' | 'month'
export type CalendarMode = 'single' | 'range' | 'multiple'

export interface DateData {
  noteCount?: number
  hasImportantItems?: boolean
  activityLevel?: number
}

export interface CalendarProps {
  // 基础配置
  initialDate?: Date
  initialView?: CalendarView
  className?: string
  mode?: CalendarMode
  locale?: Locale
  showWeekends?: boolean
  showOutsideDays?: boolean
  highlightToday?: boolean

  // 回调函数
  onDateChange?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
  onDateSelect?: (date: Date) => void
  onRangeSelect?: (range: DateRange | undefined) => void

  // 数据和渲染
  dateData?: Record<string, DateData>
  fetchDateData?: (date: Date, view: CalendarView) => Promise<Record<string, DateData>>
  renderDateContent?: (date: Date, data: DateData) => React.ReactNode

  // 功能标志
  enableRangeSelection?: boolean
  enableDragAndDrop?: boolean
}

export interface CalendarContextValue {
  selectedDate: Date | undefined
  selectedRange: DateRange | undefined
  view: CalendarView
  locale: string
  dateData: Record<string, DateData>

  // Actions
  onDateSelect: (date: Date) => void
  onRangeSelect: (range: DateRange | undefined) => void
  setView: (view: CalendarView) => void
  navigateToDate: (date: Date) => void

  // UI State
  isLoading: boolean
  error: Error | null
}

export interface CalendarHeaderProps {
  date: Date
  view: CalendarView
  onViewChange: (view: CalendarView) => void
  className?: string
}

export interface CalendarNavigationProps {
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  className?: string
}

export interface CalendarDayProps extends DayProps {
  date: Date
  isOutside?: boolean
  isSelected?: boolean
  isDisabled?: boolean
  isToday?: boolean
  data?: DateData
  onClick?: (date: Date) => void
  className?: string
}
