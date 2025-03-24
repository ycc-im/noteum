import * as React from 'react'
import {
  DayPicker,
  type DayPickerSingleProps,
  type DayPickerRangeProps,
  type DayProps as RdpDayProps,
  type DateRange,
} from 'react-day-picker'
import { zhCN } from 'date-fns/locale'
import { cn } from '../../../lib/utils'
import { CalendarHeader } from './components/CalendarHeader'
import { CalendarNavigation } from './components/CalendarNavigation'
import { CalendarDay } from './components/CalendarDay'
import { CalendarProvider, useCalendar, useCalendarNavigation } from './hooks/useCalendar'
import type { CalendarProps } from './Calendar.types'

interface ExtendedDayProps extends RdpDayProps {
  'aria-selected'?: string
  'aria-disabled'?: string
  'aria-current'?: string
}

function CalendarComponent({
  className,
  initialDate,
  initialView = 'month',
  onDateChange,
  onViewChange,
  fetchDateData,
  showOutsideDays = true,
  highlightToday = true,
  locale = zhCN,
  showWeekends = true,
  mode = 'single',
  className: containerClassName,
  ...props
}: CalendarProps) {
  const { selectedDate, selectedRange, view, dateData, onDateSelect, onRangeSelect, setView } =
    useCalendar()

  const { goToPrevious, goToNext, goToToday } = useCalendarNavigation()

  const handleSelect = React.useCallback(
    (value: Date | DateRange | undefined) => {
      if (!value) return
      if (mode === 'range' && value && typeof value === 'object' && 'from' in value) {
        onRangeSelect(value)
      } else if (value instanceof Date) {
        onDateSelect(value)
      }
    },
    [mode, onDateSelect, onRangeSelect],
  )

  // 基于mode构建DayPicker props
  const commonProps = {
    showOutsideDays,
    locale,
    className: cn('p-3', className),
    classNames: {
      root: 'flex flex-col space-y-4',
      caption: 'flex justify-between items-center',
      nav: 'flex space-x-1',
      table: 'w-full border-collapse space-y-1',
      head_row: 'flex',
      head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
      row: 'flex w-full mt-2',
      cell: cn(
        'text-center text-sm p-0 relative',
        '[&:has([aria-selected])]:bg-accent',
        'first:[&:has([aria-selected])]:rounded-l-md',
        'last:[&:has([aria-selected])]:rounded-r-md',
        'focus-within:relative focus-within:z-20',
      ),
      day: cn('h-9 w-9 p-0 font-normal aria-selected:opacity-100', highlightToday && 'relative'),
    },
    components: {
      Day: (dayProps: ExtendedDayProps) => {
        const isSelected = dayProps['aria-selected'] === 'true'
        const isDisabled = dayProps['aria-disabled'] === 'true'
        const isToday = dayProps['aria-current'] === 'date'

        return (
          <CalendarDay
            {...dayProps}
            date={dayProps.date}
            isSelected={isSelected}
            isDisabled={isDisabled}
            isToday={isToday}
            data={dateData[dayProps.date.toISOString().split('T')[0]]}
            onClick={() => onDateSelect(dayProps.date)}
          />
        )
      },
    },
  }

  const dayPickerProps =
    mode === 'range'
      ? ({
          ...commonProps,
          mode: 'range' as const,
          selected: selectedRange,
          onSelect: handleSelect as (range: DateRange | undefined) => void,
        } as DayPickerRangeProps)
      : ({
          ...commonProps,
          mode: 'single' as const,
          selected: selectedDate,
          onSelect: handleSelect as (date: Date | undefined) => void,
        } as DayPickerSingleProps)

  return (
    <div className={cn('calendar-container', containerClassName)}>
      <CalendarHeader date={selectedDate || new Date()} view={view} onViewChange={setView} />
      <CalendarNavigation onPrevious={goToPrevious} onNext={goToNext} onToday={goToToday} />
      <DayPicker {...dayPickerProps} />
    </div>
  )
}

// 包装组件以提供Context
export function Calendar(props: CalendarProps) {
  return (
    <CalendarProvider
      defaultDate={props.initialDate}
      defaultView={props.initialView}
      onDateChange={props.onDateChange}
      onViewChange={props.onViewChange}
      fetchDateData={props.fetchDateData}
    >
      <CalendarComponent {...props} />
    </CalendarProvider>
  )
}

Calendar.displayName = 'Calendar'
