"use client";

import { useEffect, useState } from "react";
import { CollageHero } from "@/components/CollageHero";
import { EventInfoCard } from "@/components/EventInfoCard";
import { GuestNameStep } from "@/components/GuestNameStep";
import { RsvpCard } from "@/components/RsvpCard";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/browser";
import type { EventConfig } from "@/types/database";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { FourPointStar } from "@/components/vintage/FourPointStar";

export default function Home() {
  const [eventConfig, setEventConfig] = useState<EventConfig | null>(null);
  const [guestName, setGuestName] = useState("");
  const [rsvpComplete, setRsvpComplete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchEventConfig() {
      try {
        const { data, error } = await supabaseBrowser()
          .from("event_config")
          .select("*")
          .limit(1)
          .single();

        if (error) throw error;
        if (data) setEventConfig(data);
      } catch (error) {
        console.error("Erro ao carregar configuração do evento:", error);
      }
    }

    fetchEventConfig();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Hero com película de filme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="shadow-vintage-lg"
          >
            <CollageHero />
          </motion.div>

          {/* Card de informações do evento */}
          {eventConfig ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <EventInfoCard eventConfig={eventConfig} />
            </motion.div>
          ) : (
            <Skeleton className="h-48 w-full" />
          )}

          {/* Mensagem de boas-vindas */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center space-y-3 py-4"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[#722F37]/30" />
              <FourPointStar size={12} color="wine" />
              <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[#722F37]/30" />
            </div>
            <p className="font-serif text-lg text-[#2D2926] max-w-2xl mx-auto">
              Estamos montando nosso novo lar e queremos celebrar com você.
            </p>
            <p className="font-serif text-sm text-[#2D2926]/70 max-w-2xl mx-auto">
              Se você quiser nos presentear, escolhemos alguns itens e também deixamos opções para contribuir em itens maiores. Obrigado por fazer parte desse momento.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-[#722F37]/30" />
              <FourPointStar size={12} color="wine" />
              <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-[#722F37]/30" />
            </div>
          </motion.div>

          {/* Formulários de nome e RSVP */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GuestNameStep
              onNameChange={setGuestName}
              initialName={guestName}
            />

            {guestName.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <RsvpCard
                  guestName={guestName}
                  onRsvpComplete={() => setRsvpComplete(true)}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Botão para ver presentes */}
          {(rsvpComplete || guestName.trim()) && (
            <motion.div
              className="flex justify-center pt-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={() => router.push("/presentes")}
                size="lg"
                variant="vintage"
                className="gap-2"
              >
                <Gift className="h-5 w-5" />
                Ver Lista de Presentes
              </Button>
            </motion.div>
          )}

          {/* Seção "Como funciona" estilo editorial */}
          <motion.div
            className="mt-12 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Título estilo jornal */}
            <div className="text-center">
              <div className="inline-block relative">
                <h2 className="font-display text-2xl text-[#722F37] px-8">Como funciona</h2>
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <FourPointStar size={16} color="rose" />
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <FourPointStar size={16} color="rose" />
                </div>
              </div>
              <div className="mt-2 w-24 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#722F37] to-transparent" />
            </div>

            {/* Grid de passos */}
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  num: "1",
                  title: "Coloque seu nome",
                  desc: "Informe seu nome para personalizar sua experiência",
                },
                {
                  num: "2",
                  title: "Confirme presença (RSVP)",
                  desc: "Nos avise se você vai conseguir ir",
                },
                {
                  num: "3",
                  title: "Escolha um presente",
                  desc: "Reserve um item ou contribua com qualquer valor em uma vaquinha",
                },
                {
                  num: "4",
                  title: "Instruções",
                  desc: "Após confirmar, você verá as instruções (levar no dia ou enviar)",
                },
              ].map((step, index) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative p-5 bg-[#F5F0E8] border-2 border-[#2D2926]/15 shadow-[3px_3px_0_0_rgba(45,41,38,0.08)] min-h-[100px] flex flex-col"
                >
                  {/* Número estilo vintage */}
                  <div className="absolute -top-3 -left-2 w-8 h-8 bg-[#722F37] text-[#F5F0E8] flex items-center justify-center font-display font-bold text-sm border-2 border-[#2D2926] shadow-[2px_2px_0_0_#2D2926]">
                    {step.num}
                  </div>
                  <h3 className="font-display font-medium text-[#2D2926] mb-2 mt-2 ml-4">
                    {step.title}
                  </h3>
                  <p className="text-sm font-serif text-[#2D2926]/70 flex-1 ml-4">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rodapé decorativo */}
          <div className="pt-8 pb-4">
            <div className="flex items-center justify-center gap-2">
              <FourPointStar size={8} color="rose" />
              <FourPointStar size={12} color="wine" />
              <FourPointStar size={16} color="rose" />
              <FourPointStar size={12} color="wine" />
              <FourPointStar size={8} color="rose" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
