import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-serif font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#722F37] text-[#F5F0E8] border-2 border-[#722F37] shadow-[3px_3px_0_0_rgba(45,41,38,0.2)] hover:shadow-[1px_1px_0_0_rgba(45,41,38,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-destructive shadow-[3px_3px_0_0_rgba(45,41,38,0.2)] hover:shadow-[1px_1px_0_0_rgba(45,41,38,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]",
        outline:
          "border-2 border-[#2D2926]/40 bg-transparent text-[#2D2926] hover:bg-[#2D2926]/5 hover:border-[#2D2926]/60",
        secondary:
          "bg-[#F5F0E8] text-[#2D2926] border-2 border-[#2D2926]/30 shadow-[2px_2px_0_0_rgba(45,41,38,0.1)] hover:bg-[#ebe5da] hover:shadow-[1px_1px_0_0_rgba(45,41,38,0.1)] hover:translate-x-[1px] hover:translate-y-[1px]",
        ghost: "text-[#2D2926] hover:bg-[#2D2926]/5",
        link: "text-[#722F37] underline-offset-4 hover:underline font-medium",
        vintage:
          "bg-[#722F37] text-[#F5F0E8] border-2 border-[#2D2926] shadow-[4px_4px_0_0_#2D2926] hover:shadow-[2px_2px_0_0_#2D2926] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] font-display font-semibold tracking-wide",
        rose:
          "bg-[#C75B7A] text-[#F5F0E8] border-2 border-[#C75B7A] shadow-[3px_3px_0_0_rgba(45,41,38,0.2)] hover:shadow-[1px_1px_0_0_rgba(45,41,38,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
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
