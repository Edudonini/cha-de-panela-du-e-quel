"use client";

import { cn } from "@/lib/utils";

interface VintageFrameProps {
  variant?: "simple" | "ornate" | "tape";
  className?: string;
  children: React.ReactNode;
}

export function VintageFrame({
  variant = "simple",
  className,
  children,
}: VintageFrameProps) {
  if (variant === "tape") {
    return (
      <div className={cn("relative", className)}>
        {/* Fita adesiva superior esquerda */}
        <div className="absolute -top-2 -left-2 w-10 h-6 bg-[#e8dcc8]/80 -rotate-12 shadow-sm z-10" />
        {/* Fita adesiva superior direita */}
        <div className="absolute -top-2 -right-2 w-10 h-6 bg-[#e8dcc8]/80 rotate-12 shadow-sm z-10" />
        {/* Conteúdo */}
        <div className="relative bg-white p-1 shadow-vintage">
          {children}
        </div>
      </div>
    );
  }

  if (variant === "ornate") {
    return (
      <div className={cn("relative p-4", className)}>
        {/* Cantos decorativos */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#722F37]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#722F37]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#722F37]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#722F37]" />
        {/* Linha interna */}
        <div className="absolute inset-2 border border-[#722F37]/30 pointer-events-none" />
        {/* Conteúdo */}
        <div className="relative">
          {children}
        </div>
      </div>
    );
  }

  // Simple variant
  return (
    <div
      className={cn(
        "relative border-2 border-[#2D2926]/30 bg-[#F5F0E8] p-4 shadow-vintage",
        className
      )}
    >
      {children}
    </div>
  );
}
