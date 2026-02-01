"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, ExternalLink, Gift, Truck, Copy, Check } from "lucide-react";
import { FourPointStar } from "./vintage/FourPointStar";
import { useToast } from "@/hooks/use-toast";

interface PostActionInstructionsProps {
  deliveryAddress: string;
  storeUrl?: string | null;
  onClose: () => void;
}

export function PostActionInstructions({
  deliveryAddress,
  storeUrl,
  onClose,
}: PostActionInstructionsProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(deliveryAddress);
      setCopied(true);
      toast({
        title: "Endereço copiado!",
        description: "O endereço foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o endereço.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Título com decoração */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FourPointStar size={12} color="rose" />
          <h3 className="text-xl font-display font-semibold text-[#722F37]">
            Instruções de Entrega
          </h3>
          <FourPointStar size={12} color="rose" />
        </div>
        <p className="text-sm font-serif text-[#2D2926]/70">
          Escolha uma das opções abaixo:
        </p>
      </div>

      {/* Opção A: Levar no dia */}
      <Card className="bg-[#F5F0E8] border-2 border-[#2D2926]/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-[#2D2926]">
            <Gift className="h-4 w-4 text-[#722F37]" />
            <span className="font-display">Opção A: Levar no dia</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-serif text-[#2D2926]/80">
            Se preferir, pode levar o presente no dia do evento.
          </p>
        </CardContent>
      </Card>

      {/* Opção B: Enviar para entrega */}
      <Card className="bg-[#F5F0E8] border-2 border-[#2D2926]/15">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-[#2D2926]">
            <Truck className="h-4 w-4 text-[#722F37]" />
            <span className="font-display">Opção B: Enviar para entrega</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-[#2D2926]/5 border border-[#2D2926]/10">
            <MapPin className="h-4 w-4 text-[#722F37] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-[#2D2926]/60 font-serif mb-1">Endereço de entrega:</p>
              <p className="text-sm font-serif font-medium text-[#2D2926]">{deliveryAddress}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAddress}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-[#722F37]/10"
              title="Copiar endereço"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 text-[#722F37]" />
              )}
            </Button>
          </div>

          {storeUrl && (
            <>
              <Separator className="bg-[#2D2926]/10" />
              <div className="space-y-2">
                <p className="text-xs text-[#2D2926]/60 font-serif">Sugestão de compra:</p>
                <Button variant="outline" asChild className="w-full gap-2">
                  <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Abrir link da loja
                  </a>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button onClick={onClose} className="w-full" variant="vintage">
        Entendi, obrigado!
      </Button>
    </div>
  );
}
