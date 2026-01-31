"use client";

import { useEffect, useState } from "react";
import { GiftCard } from "@/components/GiftCard";
import { ReserveDialog } from "@/components/ReserveDialog";
import { ContributeDialog } from "@/components/ContributeDialog";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { GiftItemPublic, EventConfig } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FourPointStar } from "@/components/vintage/FourPointStar";

export default function PresentesPage() {
  const [items, setItems] = useState<GiftItemPublic[]>([]);
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [selectedItem, setSelectedItem] = useState<GiftItemPublic | null>(null);
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const guestName =
    typeof window !== "undefined"
      ? localStorage.getItem("guest_name") || ""
      : "";

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: configData } = await supabaseBrowser()
          .from("event_config")
          .select("*")
          .limit(1)
          .single();

        if (configData) setEventConfig(configData);

        const { data: itemsData, error } = await supabaseBrowser()
          .from("v_gift_items_public")
          .select("*")
          .in("status", ["active", "delivered"])
          .order("is_group_gift", { ascending: false })
          .order("price_suggested_cents", { ascending: true });

        if (error) throw error;
        if (itemsData) setItems(itemsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleReserve = (item: GiftItemPublic) => {
    setSelectedItem(item);
    setIsReserveDialogOpen(true);
  };

  const handleContribute = (item: GiftItemPublic) => {
    setSelectedItem(item);
    setIsContributeDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsReserveDialogOpen(false);
    setIsContributeDialogOpen(false);
    setSelectedItem(null);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-paper">
        <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          <div className="mb-6">
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Botão voltar */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 text-[#722F37] hover:text-[#722F37]/80">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Cabeçalho estilo jornal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="text-center space-y-4">
            {/* Linha decorativa superior */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] flex-1 max-w-24 bg-gradient-to-r from-transparent to-[#2D2926]/30" />
              <FourPointStar size={16} color="rose" />
              <FourPointStar size={12} color="wine" />
              <FourPointStar size={16} color="rose" />
              <div className="h-[2px] flex-1 max-w-24 bg-gradient-to-l from-transparent to-[#2D2926]/30" />
            </div>

            {/* Título principal */}
            <div className="relative inline-block">
              <h1 className="font-display text-3xl md:text-4xl text-[#722F37] tracking-tight">
                Lista de Presentes
              </h1>
              {/* Decoração de cantos */}
              <div className="absolute -top-2 -left-4 w-3 h-3 border-t-2 border-l-2 border-[#722F37]" />
              <div className="absolute -top-2 -right-4 w-3 h-3 border-t-2 border-r-2 border-[#722F37]" />
              <div className="absolute -bottom-2 -left-4 w-3 h-3 border-b-2 border-l-2 border-[#722F37]" />
              <div className="absolute -bottom-2 -right-4 w-3 h-3 border-b-2 border-r-2 border-[#722F37]" />
            </div>

            {/* Subtítulo */}
            <p className="font-serif text-[#2D2926]/70 max-w-md mx-auto">
              Escolha um presente ou contribua com uma vaquinha
            </p>

            {/* Linha decorativa inferior */}
            <div className="flex items-center justify-center gap-4">
              <div className="h-[2px] flex-1 max-w-24 bg-gradient-to-r from-transparent to-[#2D2926]/30" />
              <FourPointStar size={10} color="wine" />
              <div className="h-[2px] flex-1 max-w-24 bg-gradient-to-l from-transparent to-[#2D2926]/30" />
            </div>
          </div>
        </motion.div>

        {/* Grid de presentes */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <p className="font-serif text-[#2D2926]/70 text-lg">
              Nenhum presente disponível no momento.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GiftCard
                  item={item}
                  onReserve={() => handleReserve(item)}
                  onContribute={() => handleContribute(item)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Rodapé decorativo */}
        <div className="pt-12 pb-6">
          <div className="flex items-center justify-center gap-2">
            <FourPointStar size={8} color="rose" />
            <FourPointStar size={12} color="wine" />
            <FourPointStar size={16} color="rose" />
            <FourPointStar size={12} color="wine" />
            <FourPointStar size={8} color="rose" />
          </div>
        </div>

        {/* Diálogos */}
        {selectedItem && (
          <>
            {!selectedItem.is_group_gift ? (
              <ReserveDialog
                open={isReserveDialogOpen}
                onOpenChange={setIsReserveDialogOpen}
                item={selectedItem}
                guestName={guestName}
                eventConfig={eventConfig}
              />
            ) : (
              <ContributeDialog
                open={isContributeDialogOpen}
                onOpenChange={setIsContributeDialogOpen}
                item={selectedItem}
                guestName={guestName}
                eventConfig={eventConfig}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
