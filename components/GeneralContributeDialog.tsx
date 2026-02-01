"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Check } from "lucide-react";
import { FourPointStar } from "./vintage/FourPointStar";
import { Separator } from "@/components/ui/separator";
import type { EventConfig } from "@/types/database";

interface GeneralContributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guestName: string;
  eventConfig: EventConfig | null;
  onSuccess?: () => void;
}

export function GeneralContributeDialog({
  open,
  onOpenChange,
  guestName,
  eventConfig,
  onSuccess,
}: GeneralContributeDialogProps) {
  const [amount, setAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const amountCents = Math.round(parseFloat(amount.replace(",", ".")) * 100) || 0;

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

  const handleContribute = async () => {
    if (!guestName.trim()) {
      toast({
        title: "Atencao",
        description: "Por favor, informe seu nome primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || amountCents <= 0) {
      toast({
        title: "Atencao",
        description: "Por favor, informe um valor valido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_name: guestName.trim(),
          is_anonymous: isAnonymous,
          amount_cents: amountCents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao contribuir");
      }

      toast({
        title: "Contribuicao registrada!",
        description: "Obrigado por sua contribuicao!",
      });

      setAmount("");
      setIsAnonymous(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Nao foi possivel registrar a contribuicao. Tente novamente.";
      console.error("Erro ao contribuir:", error);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const qrCodeUrl = eventConfig?.pix_qr_code_url || "/pix.png";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FourPointStar size={12} color="rose" />
            <DialogTitle>Registrar Contribuicao PIX</DialogTitle>
            <FourPointStar size={12} color="rose" />
          </div>
          <DialogDescription>
            Faca o PIX pelo QR Code ou chave abaixo e registre o valor que voce contribuiu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* QR Code e dados PIX */}
          <div className="flex flex-col items-center gap-4 p-4 bg-[#2D2926]/5 border-2 border-[#2D2926]/10">
            <div className="flex items-center gap-2 mb-2">
              <FourPointStar size={10} color="wine" />
              <span className="font-display text-sm text-[#722F37]">Dados para PIX</span>
              <FourPointStar size={10} color="wine" />
            </div>

            {/* QR Code */}
            <div className="bg-white p-2 shadow-sm">
              <Image
                src={qrCodeUrl}
                alt="QR Code PIX"
                width={120}
                height={120}
                className="w-28 h-28"
              />
            </div>

            {/* Chave PIX */}
            <div className="w-full text-center">
              <Label className="text-xs text-[#2D2926]/60 font-serif">Chave PIX (UUID)</Label>
              <div className="flex items-center justify-center gap-2 mt-1">
                <code className="bg-white px-2 py-1 font-mono text-xs text-[#2D2926] break-all">
                  {eventConfig?.pix_key}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPix}
                  className="gap-1 h-6 text-xs flex-shrink-0"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            {/* Nome */}
            <div className="text-center">
              <Label className="text-xs text-[#2D2926]/60 font-serif">Nome do recebedor</Label>
              <p className="font-serif font-medium text-[#2D2926] text-sm">
                {eventConfig?.pix_receiver_name}
              </p>
            </div>
          </div>

          <Separator className="bg-[#2D2926]/10" />

          {/* Valor da contribuição */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-display text-sm text-[#2D2926]">
              Valor da contribuicao (R$)
            </Label>
            <Input
              id="amount"
              type="text"
              placeholder="0,00"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d,]/g, "");
                setAmount(value);
              }}
              className="text-center text-lg font-body"
            />
          </div>

          {/* Checkbox anônimo */}
          <div className="flex items-center space-x-3 p-3 bg-[#2D2926]/5 border border-[#2D2926]/10">
            <Checkbox
              id="anonymous-contribute"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              className="border-[#722F37] data-[state=checked]:bg-[#722F37]"
            />
            <Label
              htmlFor="anonymous-contribute"
              className="text-sm font-serif font-normal cursor-pointer text-[#2D2926]"
            >
              Manter anonimo (seu nome nao aparecera publicamente)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleContribute} disabled={isSubmitting} variant="vintage">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              "Confirmar Contribuicao"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
