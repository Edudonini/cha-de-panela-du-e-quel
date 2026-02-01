"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { GiftItemPublic } from "@/types/database";
import { Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

interface GiftCardProps {
  item: GiftItemPublic;
  onReserve?: () => void;
}

export function GiftCard({ item, onReserve }: GiftCardProps) {
  const priceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(item.price_suggested_cents / 100);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col relative">
        {/* Imagem com moldura estilo álbum vintage */}
        {item.image_url && (
          <div className="relative">
            {/* Cantos decorativos estilo álbum de fotos */}
            <div className="absolute top-0 left-0 w-7 h-7 z-10">
              <div className="absolute top-0 left-0 w-full h-full border-t-[14px] border-l-[14px] border-[#C9A86C]" />
            </div>
            <div className="absolute top-0 right-0 w-7 h-7 z-10">
              <div className="absolute top-0 right-0 w-full h-full border-t-[14px] border-r-[14px] border-[#C9A86C]" />
            </div>

            <div className="relative w-full h-48 bg-[#F5F0E8] border-4 border-[#e8dcc8] shadow-inner">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-contain p-3"
              />
              {/* Overlay sutil vintage */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8]/20 via-transparent to-[#2D2926]/10 pointer-events-none" />
            </div>

            {/* Cantos inferiores decorativos */}
            <div className="absolute bottom-0 left-0 w-7 h-7 z-10">
              <div className="absolute bottom-0 left-0 w-full h-full border-b-[14px] border-l-[14px] border-[#C9A86C]" />
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 z-10">
              <div className="absolute bottom-0 right-0 w-full h-full border-b-[14px] border-r-[14px] border-[#C9A86C]" />
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="flex-1 text-[#2D2926]">{item.title}</CardTitle>
          </div>
          {item.description && (
            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Preco estilo etiqueta */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-serif text-[#2D2926]/70">Valor sugerido:</span>
            <div className="bg-[#722F37] text-[#F5F0E8] px-3 py-1 font-body font-medium text-sm shadow-[2px_2px_0_0_rgba(45,41,38,0.2)]">
              {priceFormatted}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {item.is_reserved ? (
              <Badge variant="outline" className="w-full justify-center gap-1 py-1.5">
                <Check className="h-3 w-3" />
                Reservado
              </Badge>
            ) : (
              <Badge variant="success" className="w-full justify-center py-1.5">
                Disponivel
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
          <Button
            onClick={onReserve}
            disabled={item.is_reserved}
            className="w-full"
            variant={item.is_reserved ? "secondary" : "vintage"}
            aria-label={item.is_reserved ? "Item ja reservado" : `Reservar ${item.title}`}
          >
            {item.is_reserved ? "Ja Reservado" : "Reservar"}
          </Button>
          {item.store_url && (
            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto sm:flex-shrink-0"
            >
              <a href={item.store_url} target="_blank" rel="noopener noreferrer" aria-label={`Ver ${item.title} na loja`}>
                Ver Loja
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
