import * as React from 'react'
import { format } from 'date-fns'
import { cn } from '../../../../lib/utils'
import type { CalendarDayProps } from '../Calendar.types'

export function CalendarDay({
  date,
  isOutside,
  isSelected,
  isDisabled,
  isToday,
  data,
  onClick,
  className,
}: CalendarDayProps) {
  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.(date)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    onClick?.(date)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-selected={isSelected}
      aria-current={isToday ? 'date' : undefined}
      aria-disabled={isDisabled}
      aria-label={format(date, 'yyyy年MM月dd日')}
      className={cn(
        'relative w-9 h-9 p-0 font-normal',
        'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isOutside && 'text-muted-foreground opacity-50',
        isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
        isToday && !isSelected && 'bg-accent text-accent-foreground',
        isDisabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <time
        dateTime={format(date, 'yyyy-MM-dd')}
        className="absolute inset-0 flex items-center justify-center"
      >
        {format(date, 'd')}
      </time>

      {/* 显示笔记数量和重要事项标记 */}
      {data && (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center space-x-0.5">
          {data.noteCount ? <span className="h-1 w-1 rounded-full bg-primary" /> : null}
          {data.hasImportantItems ? <span className="h-1 w-1 rounded-full bg-destructive" /> : null}
          {data.activityLevel ? (
            <span
              className={cn(
                'h-1 w-1 rounded-full',
                data.activityLevel > 7
                  ? 'bg-success'
                  : data.activityLevel > 3
                  ? 'bg-warning'
                  : 'bg-info',
              )}
            />
          ) : null}
        </div>
      )}
    </button>
  )
}

CalendarDay.displayName = 'CalendarDay'
