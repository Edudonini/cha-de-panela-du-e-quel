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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { FourPointStar } from "./vintage/FourPointStar";

interface CancelReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: string;
  itemTitle: string;
  expectedGuestName: string;
  onSuccess: () => void;
}

export function CancelReservationDialog({
  open,
  onOpenChange,
  reservationId,
  itemTitle,
  expectedGuestName,
  onSuccess,
}: CancelReservationDialogProps) {
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!guestName.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, confirme seu nome para cancelar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name: guestName.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cancelar reserva");
      }

      toast({
        title: "Reserva cancelada",
        description: "Sua reserva foi cancelada com sucesso.",
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erro ao cancelar:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível cancelar a reserva.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FourPointStar size={12} color="rose" />
            <DialogTitle>Cancelar Reserva</DialogTitle>
            <FourPointStar size={12} color="rose" />
          </div>
          <DialogDescription>
            Tem certeza que deseja cancelar sua reserva de <strong>{itemTitle}</strong>?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirm-name" className="text-[#2D2926]">
              Confirme seu nome para cancelar
            </Label>
            <Input
              id="confirm-name"
              placeholder="Digite seu nome"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="border-[#2D2926]/20 focus:border-[#722F37]"
            />
            <p className="text-xs text-[#2D2926]/60">
              O nome deve ser o mesmo usado na reserva
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Manter Reserva
          </Button>
          <Button
            onClick={handleCancel}
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelando...
              </>
            ) : (
              "Cancelar Reserva"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
