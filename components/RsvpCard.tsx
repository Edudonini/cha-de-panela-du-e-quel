"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Heart, HeartCrack } from "lucide-react";
import { FourPointStar } from "@/components/vintage/FourPointStar";
import { motion } from "framer-motion";

interface RsvpCardProps {
  guestName: string;
  onRsvpComplete?: () => void;
}

export function RsvpCard({ guestName, onRsvpComplete }: RsvpCardProps) {
  const [attending, setAttending] = useState<boolean | null>(null);
  const [companionsCount, setCompanionsCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (attending === null) {
      toast({
        title: "Atenção",
        description: "Por favor, confirme se você vai conseguir ir.",
        variant: "destructive",
      });
      return;
    }

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
      const { error } = await supabaseBrowser()
        .from("guests_rsvp")
        .insert({
          guest_name: guestName.trim(),
          attending,
          companions_count: companionsCount,
        });

      if (error) throw error;

      toast({
        title: "RSVP confirmado!",
        description: attending
          ? `Obrigado por confirmar! Esperamos você${companionsCount > 0 ? ` e seus ${companionsCount} acompanhante${companionsCount > 1 ? "s" : ""}` : ""}.`
          : "Sentiremos sua falta!",
      });

      onRsvpComplete?.();
    } catch (error) {
      console.error("Erro ao salvar RSVP:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua confirmação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative overflow-visible">
      {/* Decoração de cantos */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#722F37]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#722F37]" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#722F37]" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#722F37]" />

      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FourPointStar size={10} color="rose" />
          <CardTitle className="text-[#722F37]">Você vai conseguir ir?</CardTitle>
          <FourPointStar size={10} color="rose" />
        </div>
        <CardDescription>
          Confirme sua presença para nos ajudar no planejamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex gap-3">
          <Button
            variant={attending === true ? "default" : "outline"}
            onClick={() => setAttending(true)}
            className="flex-1 gap-2"
          >
            <Heart className="h-4 w-4" />
            Vou
          </Button>
          <Button
            variant={attending === false ? "secondary" : "outline"}
            onClick={() => setAttending(false)}
            className="flex-1 gap-2"
          >
            <HeartCrack className="h-4 w-4" />
            Não vou
          </Button>
        </div>

        {attending === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <Label htmlFor="companions" className="font-display text-sm text-[#2D2926]">
              Número de acompanhantes (0-10)
            </Label>
            <Input
              id="companions"
              type="number"
              min="0"
              max="10"
              value={companionsCount}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setCompanionsCount(Math.max(0, Math.min(10, value)));
              }}
              className="text-center"
            />
          </motion.div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || attending === null}
          className="w-full"
          variant="vintage"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Confirmar"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
