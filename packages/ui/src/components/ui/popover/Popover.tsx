import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../../lib/utils"

// 这里使用类型断言来解决类型兼容性问题
const Popover = PopoverPrimitive.Root as React.FC<{
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>

const PopoverTrigger = PopoverPrimitive.Trigger as React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  }
>

const PopoverPortal = PopoverPrimitive.Portal as React.FC<{
  children?: React.ReactNode;
}>

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  // 避免 ReactNode 类型不匹配问题
  <PopoverPortal>
    {React.createElement(
      PopoverPrimitive.Content,
      {
        ref,
        align,
        sideOffset,
        className: cn(
          "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        ),
        ...props
      }
    )}
  </PopoverPortal>
))

PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent, PopoverPortal }
