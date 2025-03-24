import * as React from 'react'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Button } from '../../button'
import { Icons } from '../../icons/Icons'
import { cn } from '../../../../lib/utils'
import type { CalendarHeaderProps } from '../Calendar.types'

export function CalendarHeader({ date, view, onViewChange, className }: CalendarHeaderProps) {
  // 格式化日期标题
  const formatTitle = () => {
    switch (view) {
      case 'day':
        return format(date, 'yyyy年MM月dd日 EEEE', { locale: zhCN })
      case 'week':
        return `${format(date, 'yyyy年第wo周', { locale: zhCN })}`
      case 'month':
        return format(date, 'yyyy年MM月', { locale: zhCN })
      default:
        return format(date, 'yyyy年MM月dd日', { locale: zhCN })
    }
  }

  return (
    <div className={cn('flex items-center justify-between p-2', className)}>
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold">{formatTitle()}</h2>
        <span className="text-sm text-muted-foreground">{view}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('day')}
          className={cn(view === 'day' && 'bg-muted')}
        >
          日
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('week')}
          className={cn(view === 'week' && 'bg-muted')}
        >
          周
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewChange('month')}
          className={cn(view === 'month' && 'bg-muted')}
        >
          月
        </Button>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon">
          <Icons.Share2 className="h-4 w-4" />
          <span className="sr-only">分享</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Icons.MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">更多选项</span>
        </Button>
      </div>
    </div>
  )
}

CalendarHeader.displayName = 'CalendarHeader'
