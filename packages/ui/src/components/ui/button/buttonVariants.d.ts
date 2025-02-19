import { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export const buttonVariants: ReturnType<typeof cva>
export type ButtonVariants = VariantProps<typeof buttonVariants>
