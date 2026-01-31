"use client";

import { VintageCalendar } from "@/components/vintage/VintageCalendar";
import { VintageFrame } from "@/components/vintage/VintageFrame";
import { FourPointStar } from "@/components/vintage/FourPointStar";
import type { EventConfig } from "@/types/database";
import { Clock, MapPin } from "lucide-react";

interface EventInfoCardProps {
  eventConfig: EventConfig;
}

export function EventInfoCard({ eventConfig }: EventInfoCardProps) {
  // Parse date from string like "22 de Fevereiro de 2025"
  const parseEventDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;

    const months: Record<string, number> = {
      janeiro: 0, fevereiro: 1, marco: 2, abril: 3, maio: 4, junho: 5,
      julho: 6, agosto: 7, setembro: 8, outubro: 9, novembro: 10, dezembro: 11,
    };

    const match = dateStr.toLowerCase().match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)/);
    if (match) {
      const [, day, monthStr, year] = match;
      const monthNormalized = monthStr.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const month = months[monthNormalized];
      if (month !== undefined) {
        return new Date(parseInt(year), month, parseInt(day));
      }
    }
    return null;
  };

  const eventDate = parseEventDate(eventConfig.event_date);

  return (
    <VintageFrame variant="ornate" className="bg-[#F5F0E8] max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Título do evento */}
        <div className="flex items-center justify-center gap-2">
          <FourPointStar size={12} color="rose" />
          <h2 className="font-display text-xl text-[#722F37]">
            {eventConfig.event_title}
          </h2>
          <FourPointStar size={12} color="rose" />
        </div>

        {/* Nome do casal */}
        <p className="font-script text-2xl text-[#2D2926]">
          {eventConfig.couple_name}
        </p>

        {/* Calendário e informações */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-2">
          {/* Calendário vintage */}
          {eventDate && (
            <div className="flex-shrink-0">
              <VintageCalendar date={eventDate} size="lg" />
            </div>
          )}

          {/* Detalhes do evento */}
          <div className="space-y-3 text-center md:text-left">
            {eventConfig.event_time && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-[#722F37]" />
                <span className="font-serif text-[#2D2926]">{eventConfig.event_time}</span>
              </div>
            )}
            {eventConfig.event_address_full && (
              <div className="flex items-start justify-center md:justify-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-[#722F37] mt-0.5 flex-shrink-0" />
                <span className="font-serif text-[#2D2926] max-w-xs">{eventConfig.event_address_full}</span>
              </div>
            )}
          </div>
        </div>

        {/* Mensagem quando não há informações */}
        {!eventConfig.event_date && !eventConfig.event_time && !eventConfig.event_address_full && (
          <p className="text-sm font-serif text-[#2D2926]/60 italic pt-2">
            Data, horário e endereço serão informados em breve
          </p>
        )}
      </div>
    </VintageFrame>
  );
}
