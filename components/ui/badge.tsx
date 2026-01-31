import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center border-2 px-2.5 py-0.5 text-xs font-serif font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-[#722F37] bg-[#722F37] text-[#F5F0E8]",
        secondary:
          "border-[#2D2926]/30 bg-[#F5F0E8] text-[#2D2926]",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground",
        outline:
          "border-[#2D2926]/40 text-[#2D2926] bg-transparent",
        success:
          "border-[#6B7F5E] bg-[#6B7F5E] text-[#F5F0E8]",
        rose:
          "border-[#C75B7A] bg-[#C75B7A] text-[#F5F0E8]",
        vintage:
          "border-[#2D2926] bg-[#F5F0E8] text-[#2D2926] shadow-[2px_2px_0_0_rgba(45,41,38,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
