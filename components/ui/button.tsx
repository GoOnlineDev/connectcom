import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-burgundy-900 text-white hover:bg-burgundy-800 hover:shadow-md active:bg-burgundy-950",
        primary: "bg-burgundy-600 text-white hover:bg-burgundy-700 hover:shadow-md active:bg-burgundy-800",
        secondary: "bg-beige-200 text-burgundy-900 hover:bg-beige-300 hover:shadow-md border border-beige-300",
        destructive: "bg-red-500 text-white hover:bg-red-600 hover:shadow-md active:bg-red-700",
        outline: "border-2 border-burgundy-900 text-burgundy-900 bg-white hover:bg-burgundy-50 hover:text-burgundy-800 hover:shadow-md active:bg-burgundy-100",
        ghost: "text-burgundy-700 hover:bg-burgundy-50 hover:text-burgundy-900 shadow-none",
        link: "text-burgundy-900 underline-offset-4 hover:underline shadow-none p-0 h-auto",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-md",
        sm: "h-9 px-3 py-1.5 rounded-md text-xs",
        lg: "h-12 px-8 py-3 rounded-lg text-base font-semibold",
        icon: "h-10 w-10 rounded-md",
        pill: "h-10 px-6 py-2 rounded-full",
        "pill-sm": "h-8 px-4 py-1.5 rounded-full text-xs",
        "pill-lg": "h-12 px-8 py-3 rounded-full text-base font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 