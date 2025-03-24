import * as React from 'react'
import { Button } from '../../button'
import { Icons } from '../../icons/Icons'
import { cn } from '../../../../lib/utils'
import type { CalendarNavigationProps } from '../Calendar.types'

export function CalendarNavigation({
  onPrevious,
  onNext,
  onToday,
  className,
}: CalendarNavigationProps) {
  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" onClick={onPrevious} aria-label="上一个">
          <Icons.ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onToday} className="text-sm font-medium">
          今天
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext} aria-label="下一个">
          <Icons.ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

CalendarNavigation.displayName = 'CalendarNavigation'
