"use client";

import { useEffect, useState } from "react";
import { GiftCard } from "@/components/GiftCard";
import { ReserveDialog } from "@/components/ReserveDialog";
import { CancelReservationDialog } from "@/components/CancelReservationDialog";
import { PixContributionSection } from "@/components/PixContributionSection";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { GiftItemPublic, EventConfig } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FourPointStar } from "@/components/vintage/FourPointStar";

type UserReservation = {
  reservation_id: string;
  guest_name: string;
  item_id: string;
  item_title: string;
};

export default function PresentesPage() {
  const [items, setItems] = useState<GiftItemPublic[]>([]);
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [selectedItem, setSelectedItem] = useState<GiftItemPublic | null>(null);
  const [isReserveDialogOpen, setIsReserveDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<UserReservation | null>(null);
  const [userReservations, setUserReservations] = useState<Map<string, UserReservation>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    setGuestName(localStorage.getItem("guest_name") || "");
    loadUserReservations();
  }, []);

  // Scroll automático para seção PIX quando URL tiver #pix
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#pix") {
      // Aguarda um pouco para o conteúdo carregar
      const timer = setTimeout(() => {
        const pixSection = document.getElementById("pix");
        if (pixSection) {
          pixSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const loadUserReservations = () => {
    const reservations = new Map<string, UserReservation>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("reservation_")) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "");
          if (data.reservation_id && data.item_id) {
            reservations.set(data.item_id, data);
          }
        } catch {
          // Ignorar dados inválidos
        }
      }
    }
    setUserReservations(reservations);
  };

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

  const handleCancelReservation = (item: GiftItemPublic) => {
    const reservation = userReservations.get(item.id);
    if (reservation) {
      setSelectedItem(item);
      setSelectedReservation(reservation);
      setIsCancelDialogOpen(true);
    }
  };

  const handleCancelSuccess = () => {
    if (selectedItem) {
      localStorage.removeItem(`reservation_${selectedItem.id}`);
      loadUserReservations();
    }
    setIsCancelDialogOpen(false);
    setSelectedItem(null);
    setSelectedReservation(null);
    window.location.reload();
  };

  const handleDialogClose = () => {
    setIsReserveDialogOpen(false);
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
          <Skeleton className="h-64 mb-10" />
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
        {/* Botao voltar */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="gap-2 text-[#722F37] hover:text-[#722F37]/80">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>

        {/* Cabecalho estilo jornal */}
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

            {/* Titulo principal */}
            <div className="relative inline-block">
              <h1 className="font-display text-3xl md:text-4xl text-[#722F37] tracking-tight">
                Lista de Presentes
              </h1>
              {/* Decoracao de cantos */}
              <div className="absolute -top-2 -left-4 w-3 h-3 border-t-2 border-l-2 border-[#722F37]" />
              <div className="absolute -top-2 -right-4 w-3 h-3 border-t-2 border-r-2 border-[#722F37]" />
              <div className="absolute -bottom-2 -left-4 w-3 h-3 border-b-2 border-l-2 border-[#722F37]" />
              <div className="absolute -bottom-2 -right-4 w-3 h-3 border-b-2 border-r-2 border-[#722F37]" />
            </div>

            {/* Subtitulo */}
            <p className="font-serif text-[#2D2926]/70 max-w-md mx-auto">
              Escolha um presente para reservar ou presenteie via PIX
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
              Nenhum presente disponivel no momento.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <GiftCard
                  item={item}
                  onReserve={() => handleReserve(item)}
                  userReservation={userReservations.get(item.id) || null}
                  onCancelReservation={() => handleCancelReservation(item)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Secao PIX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <PixContributionSection eventConfig={eventConfig} guestName={guestName} />
        </motion.div>

        {/* Rodape decorativo */}
        <div className="pt-12 pb-6">
          <div className="flex items-center justify-center gap-2">
            <FourPointStar size={8} color="rose" />
            <FourPointStar size={12} color="wine" />
            <FourPointStar size={16} color="rose" />
            <FourPointStar size={12} color="wine" />
            <FourPointStar size={8} color="rose" />
          </div>
        </div>

        {/* Dialog de reserva */}
        {selectedItem && (
          <ReserveDialog
            open={isReserveDialogOpen}
            onOpenChange={setIsReserveDialogOpen}
            item={selectedItem}
            guestName={guestName}
            eventConfig={eventConfig}
          />
        )}

        {/* Dialog de cancelamento */}
        {selectedItem && selectedReservation && (
          <CancelReservationDialog
            open={isCancelDialogOpen}
            onOpenChange={setIsCancelDialogOpen}
            reservationId={selectedReservation.reservation_id}
            itemTitle={selectedItem.title}
            expectedGuestName={selectedReservation.guest_name}
            onSuccess={handleCancelSuccess}
          />
        )}
      </main>
    </div>
  );
}
