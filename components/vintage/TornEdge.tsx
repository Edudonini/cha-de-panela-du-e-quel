"use client";

import { cn } from "@/lib/utils";

interface TornEdgeProps {
  position: "top" | "bottom" | "both";
  className?: string;
  children?: React.ReactNode;
}

export function TornEdge({ position, className, children }: TornEdgeProps) {
  const tornTopPath = `polygon(
    0% 8px, 3% 0, 6% 6px, 9% 2px, 12% 8px, 15% 0, 18% 4px, 21% 8px, 24% 2px,
    27% 6px, 30% 0, 33% 8px, 36% 4px, 39% 0, 42% 6px, 45% 2px, 48% 8px,
    51% 0, 54% 4px, 57% 8px, 60% 2px, 63% 6px, 66% 0, 69% 8px, 72% 4px,
    75% 0, 78% 6px, 81% 2px, 84% 8px, 87% 0, 90% 4px, 93% 8px, 96% 2px,
    100% 6px, 100% 100%, 0% 100%
  )`;

  const tornBottomPath = `polygon(
    0% 0%, 100% 0%,
    100% calc(100% - 8px), 97% 100%, 94% calc(100% - 6px), 91% calc(100% - 2px),
    88% 100%, 85% calc(100% - 8px), 82% calc(100% - 4px), 79% 100%,
    76% calc(100% - 6px), 73% calc(100% - 2px), 70% 100%, 67% calc(100% - 8px),
    64% calc(100% - 4px), 61% 100%, 58% calc(100% - 6px), 55% calc(100% - 2px),
    52% 100%, 49% calc(100% - 8px), 46% calc(100% - 4px), 43% 100%,
    40% calc(100% - 6px), 37% calc(100% - 2px), 34% 100%, 31% calc(100% - 8px),
    28% calc(100% - 4px), 25% 100%, 22% calc(100% - 6px), 19% calc(100% - 2px),
    16% 100%, 13% calc(100% - 8px), 10% calc(100% - 4px), 7% 100%,
    4% calc(100% - 6px), 1% calc(100% - 2px), 0% 100%
  )`;

  const getClipPath = () => {
    if (position === "top") return tornTopPath;
    if (position === "bottom") return tornBottomPath;
    return undefined;
  };

  if (position === "both") {
    return (
      <div className={cn("relative", className)}>
        <div
          className="absolute inset-0 bg-[#F5F0E8]"
          style={{ clipPath: tornTopPath }}
        />
        <div
          className="relative bg-[#F5F0E8]"
          style={{ clipPath: tornBottomPath }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("bg-[#F5F0E8]", className)}
      style={{ clipPath: getClipPath() }}
    >
      {children}
    </div>
  );
}
