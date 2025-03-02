import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "../../../lib/utils"

// 使用类型断言来确保类型兼容性
const Popover = PopoverPrimitive.Root as React.FC<PopoverPrimitive.PopoverProps>

// 定义 PopoverTrigger 属性
type PopoverTriggerProps = {
  asChild?: boolean;
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  [key: string]: any;
}

// 创建 PopoverTrigger 组件
const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  (props, ref) => {
    // 使用类型断言来解决类型问题
    const Trigger = PopoverPrimitive.Trigger as any
    return <Trigger ref={ref} {...props} />
  }
)

PopoverTrigger.displayName = "PopoverTrigger"

// 定义 PopoverContent 属性
type PopoverContentProps = {
  className?: string;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  children?: React.ReactNode;
  [key: string]: any;
}

// 创建 PopoverContent 组件
const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, align = "center", sideOffset = 4, ...props }, ref) => {
    // 使用类型断言来解决类型问题
    const Portal = PopoverPrimitive.Portal as any
    const Content = PopoverPrimitive.Content as any
    
    return (
      <Portal>
        <Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </Portal>
    )
  }
)

PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
