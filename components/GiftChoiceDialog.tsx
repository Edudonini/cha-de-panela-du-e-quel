"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FourPointStar } from "./vintage/FourPointStar";
import { Gift, Banknote } from "lucide-react";

interface GiftChoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GiftChoiceDialog({ open, onOpenChange }: GiftChoiceDialogProps) {
  const router = useRouter();

  const handleListaClick = () => {
    onOpenChange(false);
    router.push("/presentes");
  };

  const handlePixClick = () => {
    onOpenChange(false);
    router.push("/presentes#pix");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F5F0E8] border-2 border-[#722F37]">
        {/* Cantos decorativos */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#722F37]" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#722F37]" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#722F37]" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#722F37]" />

        <DialogHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FourPointStar size={12} color="wine" />
            <DialogTitle className="font-display text-xl text-[#722F37]">
              Como deseja presentear?
            </DialogTitle>
            <FourPointStar size={12} color="wine" />
          </div>
          <div className="w-16 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#722F37] to-transparent" />
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Opcao Lista de Presentes */}
          <button
            onClick={handleListaClick}
            className="group relative p-6 bg-white border-2 border-[#2D2926]/20 hover:border-[#722F37] transition-all duration-200 shadow-[3px_3px_0_0_rgba(45,41,38,0.08)] hover:shadow-[4px_4px_0_0_rgba(114,47,55,0.15)]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#722F37]/10 rounded-full flex items-center justify-center group-hover:bg-[#722F37]/20 transition-colors">
                <Gift className="w-6 h-6 text-[#722F37]" />
              </div>
              <span className="font-display text-sm text-[#2D2926] group-hover:text-[#722F37] transition-colors">
                Lista de Presentes
              </span>
              <span className="text-xs font-serif text-[#2D2926]/60 text-center">
                Escolha um item para reservar
              </span>
            </div>
          </button>

          {/* Opcao PIX */}
          <button
            onClick={handlePixClick}
            className="group relative p-6 bg-white border-2 border-[#2D2926]/20 hover:border-[#722F37] transition-all duration-200 shadow-[3px_3px_0_0_rgba(45,41,38,0.08)] hover:shadow-[4px_4px_0_0_rgba(114,47,55,0.15)]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#722F37]/10 rounded-full flex items-center justify-center group-hover:bg-[#722F37]/20 transition-colors">
                <Banknote className="w-6 h-6 text-[#722F37]" />
              </div>
              <span className="font-display text-sm text-[#2D2926] group-hover:text-[#722F37] transition-colors">
                Presentear via PIX
              </span>
              <span className="text-xs font-serif text-[#2D2926]/60 text-center">
                Contribua com qualquer valor
              </span>
            </div>
          </button>
        </div>

        {/* Linha decorativa inferior */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <FourPointStar size={8} color="rose" />
          <div className="h-[1px] w-12 bg-[#2D2926]/20" />
          <FourPointStar size={10} color="wine" />
          <div className="h-[1px] w-12 bg-[#2D2926]/20" />
          <FourPointStar size={8} color="rose" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
