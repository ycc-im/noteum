import { addDays, format, subDays } from "date-fns"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"
import { zhCN } from 'date-fns/locale'

import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  cn,
} from "@noteum/ui"

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
        <ChevronLeftIcon className="h-4 w-4" />
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
        <ChevronRightIcon className="h-4 w-4" />
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
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP", { locale: zhCN })
            ) : (
              <span>选择日期</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date: Date | undefined) => date && onDateChange(date)}
            initialFocus
            locale={zhCN}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
