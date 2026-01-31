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
import { Checkbox } from "@/components/ui/checkbox";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { GiftItemPublic } from "@/types/database";
import { PostActionInstructions } from "./PostActionInstructions";
import { FourPointStar } from "./vintage/FourPointStar";

interface ReserveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: GiftItemPublic;
  guestName: string;
  eventConfig: {
    delivery_address_full: string;
    store_url?: string | null;
  } | null;
}

export function ReserveDialog({
  open,
  onOpenChange,
  item,
  guestName,
  eventConfig,
}: ReserveDialogProps) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { toast } = useToast();

  const handleReserve = async () => {
    if (!guestName.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, informe seu nome primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabaseBrowser().rpc("reserve_gift_item", {
        p_item_id: item.id,
        p_guest_name: guestName.trim(),
        p_is_anonymous: isAnonymous,
      });

      if (error) throw error;

      if (data && !data.ok) {
        if (data.error === "ALREADY_RESERVED") {
          toast({
            title: "Item já reservado",
            description: "Este item foi reservado por outra pessoa. Por favor, escolha outro.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(data.error || "Erro ao reservar");
      }

      toast({
        title: "Reserva confirmada!",
        description: "Obrigado por escolher este presente!",
      });

      setShowInstructions(true);
    } catch (error: any) {
      console.error("Erro ao reservar:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível reservar o item. Tente novamente.",
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
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FourPointStar size={12} color="rose" />
            <DialogTitle>Reservar {item.title}</DialogTitle>
            <FourPointStar size={12} color="rose" />
          </div>
          <DialogDescription>
            Confirme sua reserva. Você receberá instruções de entrega após confirmar.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-3 p-3 bg-[#2D2926]/5 border border-[#2D2926]/10">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              className="border-[#722F37] data-[state=checked]:bg-[#722F37]"
            />
            <Label
              htmlFor="anonymous"
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
          <Button onClick={handleReserve} disabled={isSubmitting} variant="vintage">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Reservando...
              </>
            ) : (
              "Confirmar Reserva"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
