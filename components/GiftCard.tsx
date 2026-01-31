"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { GiftItemPublic } from "@/types/database";
import { Gift, Users, Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FourPointStar } from "./vintage/FourPointStar";

interface GiftCardProps {
  item: GiftItemPublic;
  onReserve?: () => void;
  onContribute?: () => void;
}

export function GiftCard({ item, onReserve, onContribute }: GiftCardProps) {
  const priceFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(item.price_suggested_cents / 100);

  const isGroupGift = item.is_group_gift;
  const progress = isGroupGift && item.goal_cents
    ? Math.min(100, (item.contributed_cents / item.goal_cents) * 100)
    : 0;
  const contributedFormatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(item.contributed_cents / 100);
  const goalFormatted = isGroupGift && item.goal_cents
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(item.goal_cents / 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col relative">
        {/* Imagem com moldura de fita adesiva */}
        {item.image_url && (
          <div className="relative">
            {/* Fitas adesivas decorativas */}
            <div className="absolute -top-1 left-4 w-10 h-5 bg-[#e8dcc8]/90 -rotate-6 z-10 shadow-sm" />
            <div className="absolute -top-1 right-4 w-10 h-5 bg-[#e8dcc8]/90 rotate-6 z-10 shadow-sm" />

            <div className="relative w-full h-48 bg-[#2D2926]">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                className="object-cover filter-vintage"
              />
              {/* Overlay sutil vintage */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#2D2926]/20 pointer-events-none" />
            </div>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="flex-1 text-[#2D2926]">{item.title}</CardTitle>
            {isGroupGift && (
              <Badge variant="rose" className="gap-1 flex-shrink-0">
                <Users className="h-3 w-3" />
                Vaquinha
              </Badge>
            )}
          </div>
          {item.description && (
            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          {/* Preço estilo etiqueta */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-serif text-[#2D2926]/70">Valor sugerido:</span>
            <div className="bg-[#722F37] text-[#F5F0E8] px-3 py-1 font-body font-medium text-sm shadow-[2px_2px_0_0_rgba(45,41,38,0.2)]">
              {priceFormatted}
            </div>
          </div>

          {isGroupGift && item.goal_cents && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-serif text-[#2D2926]/70">Progresso:</span>
                <span className="font-body font-medium text-[#2D2926]">
                  {contributedFormatted} / {goalFormatted}
                </span>
              </div>
              <Progress value={progress} className="h-3" />
              {progress >= 100 && (
                <div className="flex items-center gap-1 text-xs text-[#6B7F5E] font-medium">
                  <FourPointStar size={10} color="sage" />
                  <span>Meta atingida!</span>
                  <FourPointStar size={10} color="sage" />
                </div>
              )}
            </div>
          )}

          {!isGroupGift && (
            <div className="flex items-center gap-2">
              {item.is_reserved ? (
                <Badge variant="outline" className="w-full justify-center gap-1 py-1.5">
                  <Check className="h-3 w-3" />
                  Reservado
                </Badge>
              ) : (
                <Badge variant="success" className="w-full justify-center py-1.5">
                  Disponível
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-2 pt-0">
          {!isGroupGift ? (
            <Button
              onClick={onReserve}
              disabled={item.is_reserved}
              className="w-full"
              variant={item.is_reserved ? "secondary" : "vintage"}
              aria-label={item.is_reserved ? "Item já reservado" : `Reservar ${item.title}`}
            >
              {item.is_reserved ? "Já Reservado" : "Reservar"}
            </Button>
          ) : (
            <Button
              onClick={onContribute}
              className="w-full"
              variant="vintage"
              aria-label={`Contribuir para ${item.title}`}
            >
              <Gift className="h-4 w-4 mr-2" />
              Contribuir
            </Button>
          )}
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
