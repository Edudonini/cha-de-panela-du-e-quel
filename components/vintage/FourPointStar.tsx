"use client";

import { cn } from "@/lib/utils";

interface FourPointStarProps {
  className?: string;
  size?: number;
  color?: "wine" | "rose" | "ink" | "cream" | "sage";
  filled?: boolean;
}

export function FourPointStar({
  className,
  size = 24,
  color = "rose",
  filled = true,
}: FourPointStarProps) {
  const colorClasses = {
    wine: "text-[#722F37]",
    rose: "text-[#C75B7A]",
    ink: "text-[#2D2926]",
    cream: "text-[#F5F0E8]",
    sage: "text-[#6B7F5E]",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
      className={cn(colorClasses[color], className)}
    >
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </svg>
  );
}
