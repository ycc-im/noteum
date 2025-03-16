import * as React from 'react'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

import {
  DayPicker,
  type DayPickerSingleProps,
  type DayPickerRangeProps,
  type DayPickerMultipleProps,
} from 'react-day-picker'

type CalendarProps = {
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  highlightToday?: boolean
  customDayRenderer?: (date: Date) => React.ReactElement | null
} & (
  | ({ mode: 'single' } & Omit<DayPickerSingleProps, 'mode'>)
  | ({ mode: 'range' } & Omit<DayPickerRangeProps, 'mode'>)
  | ({ mode: 'multiple' } & Omit<DayPickerMultipleProps, 'mode'>)
  | ({ mode?: 'default' } & Omit<DayPickerSingleProps, 'mode'>)
)

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  highlightToday = true,
  customDayRenderer,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        ...classNames,
        root: 'flex flex-col space-y-4',
        caption: 'flex justify-between items-center',
        nav: 'flex space-x-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn('h-9 w-9 p-0 font-normal aria-selected:opacity-100', highlightToday && 'relative'),
        day_range_start: 'day-range-start',
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: () => <Icons.ChevronLeft className="h-4 w-4" />,
        IconRight: () => <Icons.ChevronRight className="h-4 w-4" />,
        DayContent: (props) => {
          const { date } = props
          if (customDayRenderer) {
            const rendered = customDayRenderer(date)
            return React.isValidElement(rendered) ? rendered : null
          }
          return <span>{date.getDate()}</span>
        },
      }}
      {...props}
    />
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }
