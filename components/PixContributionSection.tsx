"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FourPointStar } from "./vintage/FourPointStar";
import { GeneralContributeDialog } from "./GeneralContributeDialog";
import type { EventConfig } from "@/types/database";

interface PixContributionSectionProps {
  eventConfig: EventConfig | null;
  guestName: string;
}

export function PixContributionSection({ eventConfig, guestName }: PixContributionSectionProps) {
  const [copied, setCopied] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyPix = async () => {
    if (!eventConfig?.pix_key) return;

    try {
      await navigator.clipboard.writeText(eventConfig.pix_key);
      setCopied(true);
      toast({
        title: "Chave PIX copiada!",
        description: "Cole no seu aplicativo de banco.",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  if (!eventConfig) return null;

  const qrCodeUrl = eventConfig.pix_qr_code_url || "/pix.png";

  return (
    <>
      <section className="mb-10">
        <div className="relative border-2 border-[#722F37] bg-[#F5F0E8] p-6 md:p-8">
          {/* Cantos decorativos */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#722F37]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#722F37]" />
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#722F37]" />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#722F37]" />

          {/* Cabeçalho */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <FourPointStar size={16} color="wine" />
            <h2 className="font-display text-xl md:text-2xl text-[#722F37]">
              Contribuicao PIX
            </h2>
            <FourPointStar size={16} color="wine" />
          </div>

          {/* Subtítulo */}
          <p className="text-center font-serif text-[#2D2926]/80 mb-6 max-w-md mx-auto">
            Quer ajudar com qualquer valor? Faca um PIX e registre sua contribuicao!
          </p>

          {/* Conteúdo principal */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            {/* QR Code */}
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-[#2D2926]/30" />
              <div className="absolute -top-2 -right-2 w-3 h-3 border-t-2 border-r-2 border-[#2D2926]/30" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 border-b-2 border-l-2 border-[#2D2926]/30" />
              <div className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-[#2D2926]/30" />

              <div className="bg-white p-3 shadow-md">
                <Image
                  src={qrCodeUrl}
                  alt="QR Code PIX"
                  width={160}
                  height={160}
                  className="w-32 h-32 md:w-40 md:h-40"
                />
              </div>
            </div>

            {/* Informações do PIX */}
            <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
              <div>
                <p className="text-xs font-serif text-[#2D2926]/60 mb-1">Chave PIX (UUID):</p>
                <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  <code className="bg-[#2D2926]/10 px-2 py-1 font-mono text-xs md:text-sm text-[#2D2926] break-all">
                    {eventConfig.pix_key}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyPix}
                    className="gap-1 h-7 text-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-serif text-[#2D2926]/60 mb-1">Nome:</p>
                <p className="font-serif font-medium text-[#2D2926]">
                  {eventConfig.pix_receiver_name}
                </p>
              </div>

              <Button
                variant="vintage"
                onClick={() => setIsDialogOpen(true)}
                className="mt-2"
              >
                Registrar Contribuicao
              </Button>
            </div>
          </div>

          {/* Linha decorativa inferior */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <FourPointStar size={8} color="rose" />
            <div className="h-[1px] w-16 bg-[#2D2926]/20" />
            <FourPointStar size={10} color="wine" />
            <div className="h-[1px] w-16 bg-[#2D2926]/20" />
            <FourPointStar size={8} color="rose" />
          </div>
        </div>
      </section>

      <GeneralContributeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        guestName={guestName}
        eventConfig={eventConfig}
        onSuccess={handleDialogClose}
      />
    </>
  );
}
