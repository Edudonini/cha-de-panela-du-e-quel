"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface FilmStripProps {
  images: string[];
  orientation?: "vertical" | "horizontal";
  className?: string;
  speed?: number;
}

export function FilmStrip({
  images,
  orientation = "vertical",
  className,
  speed = 30,
}: FilmStripProps) {
  const isVertical = orientation === "vertical";

  // Duplicar imagens para criar loop infinito suave
  const duplicatedImages = [...images, ...images];

  // Dimensões das fotos
  const photoHeight = isVertical ? 150 : 100; // altura da foto em pixels
  const photoWidth = Math.round(photoHeight * 0.8); // aspect ratio 4:5

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#1a1816]",
        isVertical
          ? "w-[160px] md:w-[200px] h-[420px] lg:h-[480px]"
          : "h-[140px] w-full",
        className
      )}
    >
      {/* Borda esquerda/superior com perfurações */}
      <div
        className={cn(
          "absolute bg-[#1a1816] z-20 flex items-center overflow-hidden",
          isVertical
            ? "left-0 top-0 bottom-0 w-[18px] md:w-[22px] flex-col gap-[10px] py-4 justify-start"
            : "top-0 left-0 right-0 h-[14px] flex-row gap-[8px] px-2 justify-start"
        )}
      >
        {Array.from({ length: isVertical ? 50 : 80 }).map((_, i) => (
          <div
            key={`left-${i}`}
            className={cn(
              "bg-[#3d3a38] rounded-[1px] flex-shrink-0",
              isVertical ? "w-[8px] h-[5px]" : "w-[5px] h-[6px]"
            )}
          />
        ))}
      </div>

      {/* Borda direita/inferior com perfurações */}
      <div
        className={cn(
          "absolute bg-[#1a1816] z-20 flex items-center overflow-hidden",
          isVertical
            ? "right-0 top-0 bottom-0 w-[18px] md:w-[22px] flex-col gap-[10px] py-4 justify-start"
            : "bottom-0 left-0 right-0 h-[14px] flex-row gap-[8px] px-2 justify-start"
        )}
      >
        {Array.from({ length: isVertical ? 50 : 80 }).map((_, i) => (
          <div
            key={`right-${i}`}
            className={cn(
              "bg-[#3d3a38] rounded-[1px] flex-shrink-0",
              isVertical ? "w-[8px] h-[5px]" : "w-[5px] h-[6px]"
            )}
          />
        ))}
      </div>

      {/* Container das fotos com animação */}
      <div
        className={cn(
          "absolute z-10 overflow-hidden",
          isVertical
            ? "left-[18px] md:left-[22px] right-[18px] md:right-[22px] top-0 bottom-0"
            : "top-[14px] bottom-[14px] left-0 right-0"
        )}
      >
        <div
          className={cn(
            "flex",
            isVertical
              ? "flex-col animate-film-scroll-vertical"
              : "flex-row animate-film-scroll-horizontal"
          )}
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 bg-[#0d0c0b]"
              style={{
                width: isVertical ? "100%" : `${photoWidth}px`,
                height: isVertical ? `${photoHeight}px` : "100%",
                aspectRatio: isVertical ? undefined : "4/5",
                margin: isVertical ? "2px 0" : "0 2px",
              }}
            >
              {/* Borda branca da foto */}
              <div className="absolute inset-[2px] bg-[#f5f0e8]">
                <div className="absolute inset-[2px] overflow-hidden">
                  <Image
                    src={src}
                    alt={`Foto ${(index % images.length) + 1}`}
                    fill
                    className="object-cover filter-vintage"
                    sizes={isVertical ? "160px" : "100px"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradiente de fade nas bordas */}
      <div
        className={cn(
          "absolute z-30 pointer-events-none",
          isVertical
            ? "top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#1a1816] to-transparent"
            : "left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1a1816] to-transparent"
        )}
      />
      <div
        className={cn(
          "absolute z-30 pointer-events-none",
          isVertical
            ? "bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#1a1816] to-transparent"
            : "right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#1a1816] to-transparent"
        )}
      />
    </div>
  );
}
