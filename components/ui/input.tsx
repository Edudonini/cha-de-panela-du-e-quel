import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full border-2 border-[#2D2926]/30 bg-[#F5F0E8] px-4 py-2 text-base font-serif text-[#2D2926] shadow-[inset_1px_1px_3px_rgba(45,41,38,0.1)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#2D2926] placeholder:text-[#2D2926]/40 placeholder:font-serif focus-visible:outline-none focus-visible:border-[#722F37] focus-visible:ring-1 focus-visible:ring-[#722F37]/30 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
