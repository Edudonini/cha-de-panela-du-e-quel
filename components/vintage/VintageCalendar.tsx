"use client";

import { cn } from "@/lib/utils";

interface VintageCalendarProps {
  date: Date | string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VintageCalendar({
  date,
  className,
  size = "md",
}: VintageCalendarProps) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "");
  const year = dateObj.getFullYear();
  const weekday = dateObj.toLocaleDateString("pt-BR", { weekday: "long" });

  const sizeClasses = {
    sm: {
      container: "w-16 h-20",
      day: "text-2xl",
      month: "text-[10px]",
      year: "text-[8px]",
      weekday: "text-[8px]",
    },
    md: {
      container: "w-20 h-24",
      day: "text-3xl",
      month: "text-xs",
      year: "text-[10px]",
      weekday: "text-[10px]",
    },
    lg: {
      container: "w-28 h-32",
      day: "text-4xl",
      month: "text-sm",
      year: "text-xs",
      weekday: "text-xs",
    },
  };

  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center bg-[#F5F0E8] border-2 border-[#2D2926] shadow-vintage",
        sizes.container,
        className
      )}
    >
      {/* Header vermelho do calendário */}
      <div className="absolute top-0 left-0 right-0 h-[22%] bg-[#722F37] flex items-center justify-center">
        <span className={cn("font-display font-bold text-[#F5F0E8] tracking-wider", sizes.month)}>
          {month}
        </span>
      </div>

      {/* Corpo do calendário */}
      <div className="flex flex-col items-center justify-center pt-4">
        <span className={cn("font-display font-bold text-[#2D2926] leading-none", sizes.day)}>
          {day}
        </span>
        <span className={cn("font-serif text-[#722F37] capitalize mt-0.5", sizes.weekday)}>
          {weekday}
        </span>
        <span className={cn("font-body text-[#2D2926]/60 mt-0.5", sizes.year)}>
          {year}
        </span>
      </div>

      {/* Sombra interna sutil */}
      <div className="absolute inset-0 pointer-events-none border border-[#2D2926]/10" />
    </div>
  );
}
