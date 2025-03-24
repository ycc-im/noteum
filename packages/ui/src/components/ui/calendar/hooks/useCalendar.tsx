import * as React from 'react'
import type { CalendarView, DateData, CalendarContextValue } from '../Calendar.types'
import type { DateRange } from 'react-day-picker'
import { addDays, addMonths, addWeeks, startOfMonth, startOfWeek } from 'date-fns'

// 创建Context
const CalendarContext = React.createContext<CalendarContextValue | undefined>(undefined)

// Provider Props类型
interface CalendarProviderProps {
  children: React.ReactNode
  defaultDate?: Date
  defaultView?: CalendarView
  onDateChange?: (date: Date) => void
  onViewChange?: (view: CalendarView) => void
  fetchDateData?: (date: Date, view: CalendarView) => Promise<Record<string, DateData>>
}

export function CalendarProvider({
  children,
  defaultDate = new Date(),
  defaultView = 'month',
  onDateChange,
  onViewChange,
  fetchDateData,
}: CalendarProviderProps) {
  // 状态管理
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(defaultDate)
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>()
  const [view, setView] = React.useState<CalendarView>(defaultView)
  const [dateData, setDateData] = React.useState<Record<string, DateData>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  // 数据加载
  const loadDateData = React.useCallback(
    async (date: Date, currentView: CalendarView) => {
      if (!fetchDateData) return

      setIsLoading(true)
      setError(null)

      try {
        const data = await fetchDateData(date, currentView)
        setDateData((prev) => ({ ...prev, ...data }))
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load date data'))
      } finally {
        setIsLoading(false)
      }
    },
    [fetchDateData],
  )

  // 日期变化处理
  const handleDateSelect = React.useCallback(
    (date: Date) => {
      setSelectedDate(date)
      onDateChange?.(date)
    },
    [onDateChange],
  )

  // 范围选择处理
  const handleRangeSelect = React.useCallback((range: DateRange | undefined) => {
    setSelectedRange(range)
  }, [])

  // 视图切换处理
  const handleViewChange = React.useCallback(
    (newView: CalendarView) => {
      setView(newView)
      onViewChange?.(newView)
    },
    [onViewChange],
  )

  // 日期导航
  const navigateToDate = React.useCallback(
    (date: Date) => {
      switch (view) {
        case 'day':
          setSelectedDate(date)
          break
        case 'week':
          setSelectedRange({
            from: startOfWeek(date),
            to: addDays(startOfWeek(date), 6),
          })
          break
        case 'month':
          setSelectedDate(startOfMonth(date))
          break
      }
    },
    [view],
  )

  // 导航辅助函数
  const navigate = React.useCallback(
    (amount: number) => {
      if (!selectedDate) return

      let newDate: Date
      switch (view) {
        case 'day':
          newDate = addDays(selectedDate, amount)
          break
        case 'week':
          newDate = addWeeks(selectedDate, amount)
          break
        case 'month':
          newDate = addMonths(selectedDate, amount)
          break
        default:
          newDate = selectedDate
      }
      navigateToDate(newDate)
    },
    [selectedDate, view, navigateToDate],
  )

  // 数据加载副作用
  React.useEffect(() => {
    if (selectedDate) {
      loadDateData(selectedDate, view)
    }
  }, [selectedDate, view, loadDateData])

  const value = React.useMemo(
    () => ({
      selectedDate,
      selectedRange,
      view,
      locale: 'zh-CN',
      dateData,
      onDateSelect: handleDateSelect,
      onRangeSelect: handleRangeSelect,
      setView: handleViewChange,
      navigateToDate,
      isLoading,
      error,
    }),
    [
      selectedDate,
      selectedRange,
      view,
      dateData,
      handleDateSelect,
      handleRangeSelect,
      handleViewChange,
      navigateToDate,
      isLoading,
      error,
    ],
  )

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
}

// Hook
export function useCalendar() {
  const context = React.useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}

// 导出其他有用的hooks
export function useCalendarNavigation() {
  const { navigateToDate, selectedDate, view } = useCalendar()

  const goToToday = React.useCallback(() => {
    navigateToDate(new Date())
  }, [navigateToDate])

  const goToPrevious = React.useCallback(() => {
    if (!selectedDate) return
    const amount = view === 'day' ? -1 : view === 'week' ? -7 : -1
    navigateToDate(addDays(selectedDate, amount))
  }, [selectedDate, view, navigateToDate])

  const goToNext = React.useCallback(() => {
    if (!selectedDate) return
    const amount = view === 'day' ? 1 : view === 'week' ? 7 : 1
    navigateToDate(addDays(selectedDate, amount))
  }, [selectedDate, view, navigateToDate])

  return {
    goToToday,
    goToPrevious,
    goToNext,
  }
}
