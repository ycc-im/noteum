import { addDays, format, subDays } from "date-fns"
import { Icons } from "../../components/ui/icons/Icons"
import { zhCN } from 'date-fns/locale'

import { cn } from "../../lib/utils"
import { Button } from "../../components/ui/button/Button"
import { Calendar } from "../../components/ui/calendar/Calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover/Popover"

interface DateNavigationProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  className?: string
}

export function DateNavigation({
  selectedDate,
  onDateChange,
  className,
}: DateNavigationProps) {
  const handlePrevDay = () => {
    onDateChange(subDays(selectedDate, 1))
  }

  const handleNextDay = () => {
    onDateChange(addDays(selectedDate, 1))
  }

  const handleToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevDay}
        className="h-8 w-8"
      >
        <Icons.ChevronLeft className="h-4 w-4" />
        <span className="sr-only">前一天</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleToday}
        className="h-8"
      >
        今天
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        className="h-8 w-8"
      >
        <Icons.ChevronRight className="h-4 w-4" />
        <span className="sr-only">后一天</span>
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 w-[140px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <Icons.Calendar className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP", { locale: zhCN })
            ) : (
              <span>选择日期</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateChange(date)}
            initialFocus
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
