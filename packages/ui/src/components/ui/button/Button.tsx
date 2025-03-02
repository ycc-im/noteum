import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import type { VariantProps } from "class-variance-authority"

import { cn } from "../../../lib/utils"
import { buttonVariants } from "./buttonVariants"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // 使用类型断言来解决类型问题
    const SlotComponent = Slot as unknown as React.ComponentType<React.ButtonHTMLAttributes<HTMLButtonElement> & { ref?: React.Ref<HTMLButtonElement> }>
    
    if (asChild) {
      return (
        <SlotComponent
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      )
    }
    
    // 使用 React.createElement 来避免 TypeScript 的类型检查问题
    return React.createElement(
      "button",
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref: ref,
        ...props
      }
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
