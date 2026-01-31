"use client";

import { useState } from "react";
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
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { GiftItemPublic } from "@/types/database";
import { PostActionInstructions } from "./PostActionInstructions";
import { Separator } from "@/components/ui/separator";
import { FourPointStar } from "./vintage/FourPointStar";

interface ContributeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GiftItemPublic;
  guestName: string;
  eventConfig: {
    pix_receiver_name: string;
    pix_key: string;
    delivery_address_full: string;
    store_url?: string | null;
  } | null;
}

export function ContributeDialog({
  open,
  onOpenChange,
  item,
  guestName,
  eventConfig,
}: ContributeDialogProps) {
  const [amount, setAmount] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  const amountCents = Math.round(parseFloat(amount.replace(",", ".")) * 100) || 0;

  const handleContribute = async () => {
    if (!guestName.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, informe seu nome primeiro.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || amountCents <= 0) {
      toast({
        title: "Atenção",
        description: "Por favor, informe um valor válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabaseBrowser().rpc(
        "contribute_to_group_gift",
        {
          p_item_id: item.id,
          p_guest_name: guestName.trim(),
          p_is_anonymous: isAnonymous,
          p_amount_cents: amountCents,
        }
      );

      if (error) throw error;

      if (data && !data.ok) {
        throw new Error(data.error || "Erro ao contribuir");
      }

      toast({
        title: "Contribuição registrada!",
        description: "Obrigado por sua contribuição!",
      });

      setShowInstructions(true);
    } catch (error: any) {
      console.error("Erro ao contribuir:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível registrar a contribuição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showInstructions && eventConfig) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <PostActionInstructions
            deliveryAddress={eventConfig.delivery_address_full}
            storeUrl={item.store_url || eventConfig.store_url}
            onClose={() => {
              setShowInstructions(false);
              onOpenChange(false);
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FourPointStar size={12} color="rose" />
            <DialogTitle>Contribuir para {item.title}</DialogTitle>
            <FourPointStar size={12} color="rose" />
          </div>
          <DialogDescription>
            Faça o PIX por fora e registre aqui o valor que pretende contribuir. A gente acompanha tudo por aqui.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-display text-sm text-[#2D2926]">
              Valor da contribuição (R$)
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

          <Separator className="bg-[#2D2926]/10" />

          {/* Dados do PIX com estilo vintage */}
          <div className="space-y-3 p-4 bg-[#2D2926]/5 border-2 border-[#2D2926]/10">
            <div className="flex items-center gap-2 mb-3">
              <FourPointStar size={10} color="wine" />
              <span className="font-display text-sm text-[#722F37]">Dados para PIX</span>
              <FourPointStar size={10} color="wine" />
            </div>
            <div>
              <Label className="text-xs text-[#2D2926]/60 font-serif">Nome do recebedor</Label>
              <p className="font-serif font-medium text-[#2D2926]">{eventConfig?.pix_receiver_name}</p>
            </div>
            <div>
              <Label className="text-xs text-[#2D2926]/60 font-serif">Chave PIX (CPF)</Label>
              <p className="font-body font-medium text-[#2D2926]">{eventConfig?.pix_key}</p>
            </div>
          </div>

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
              Manter anônimo (seu nome não aparecerá publicamente)
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
              "Confirmar Contribuição"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
