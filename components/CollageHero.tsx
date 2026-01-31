"use client";

import { FilmStrip } from "./vintage/FilmStrip";
import { FourPointStar } from "./vintage/FourPointStar";
import { motion } from "framer-motion";

// Fotos do casal - pasta: public/fotos convite
const couplePhotos = [
  "/fotos-convite/20241222_140400.jpg",
  "/fotos-convite/20250823_204716.jpg",
  "/fotos-convite/20251115_162927.jpg",
  "/fotos-convite/20251123_120738.jpg",
  "/fotos-convite/IMG-20220613-WA0011.jpg",
  "/fotos-convite/IMG-20221025-WA0099.jpg",
  "/fotos-convite/IMG-20230109-WA0029.jpg",
  "/fotos-convite/IMG-20230320-WA0007.jpg",
  "/fotos-convite/IMG-20230425-WA0070.jpg",
  "/fotos-convite/IMG-20230425-WA0072.jpg",
  "/fotos-convite/IMG-20230511-WA0018.jpg",
  "/fotos-convite/IMG-20230809-WA0059.jpg",
  "/fotos-convite/IMG-20240210-WA0036.jpg",
  "/fotos-convite/Screenshot_20240814_192606_Photos~2.jpg",
];

export function CollageHero() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Mobile Layout - Película horizontal no topo */}
      <div className="block md:hidden">
        {/* Película de filme horizontal */}
        <FilmStrip
          images={couplePhotos}
          orientation="horizontal"
          speed={25}
        />

        {/* Conteúdo principal mobile */}
        <div className="relative bg-[#F5F0E8] pt-8 pb-6 px-4">
          <div className="text-center space-y-4">
            {/* Estrelas decorativas */}
            <div className="flex justify-center gap-3 mb-2">
              <FourPointStar size={14} color="rose" />
              <FourPointStar size={10} color="wine" />
              <FourPointStar size={14} color="rose" />
            </div>

            {/* Nomes do casal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-script text-4xl text-[#722F37] leading-tight">
                Edu & Raquel
              </h1>
            </motion.div>

            {/* Box de destaque */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-block"
            >
              <div className="bg-[#722F37] text-[#F5F0E8] px-6 py-2 border-2 border-[#2D2926] shadow-[3px_3px_0_0_#2D2926]">
                <span className="font-display text-sm tracking-[0.2em] uppercase">
                  Chá de Panela
                </span>
              </div>
            </motion.div>

            {/* Estrelas inferiores */}
            <div className="flex justify-center gap-2 pt-2">
              <FourPointStar size={8} color="rose" />
              <FourPointStar size={12} color="wine" />
              <FourPointStar size={8} color="rose" />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Película lateral */}
      <div className="hidden md:flex">
        {/* Película de filme lateral esquerda */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-shrink-0"
        >
          <FilmStrip
            images={couplePhotos}
            orientation="vertical"
            speed={35}
          />
        </motion.div>

        {/* Conteúdo central */}
        <div className="flex-1 relative bg-[#F5F0E8] flex items-center justify-center px-8 lg:px-12 min-h-[420px] lg:min-h-[480px]">
          <div className="relative text-center space-y-6 py-8">
            {/* Estrelas decorativas superiores */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center gap-4"
            >
              <FourPointStar size={16} color="rose" />
              <FourPointStar size={12} color="wine" />
              <FourPointStar size={20} color="rose" />
              <FourPointStar size={12} color="wine" />
              <FourPointStar size={16} color="rose" />
            </motion.div>

            {/* Nomes do casal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="font-script text-5xl lg:text-6xl text-[#722F37] leading-tight">
                Edu & Raquel
              </h1>
            </motion.div>

            {/* Linha ornamental */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-32 h-[2px] mx-auto bg-gradient-to-r from-transparent via-[#722F37] to-transparent"
            />

            {/* Box de destaque "Chá de Panela" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-block"
            >
              <div className="bg-[#722F37] text-[#F5F0E8] px-8 py-3 border-2 border-[#2D2926] shadow-[4px_4px_0_0_#2D2926]">
                <span className="font-display text-base lg:text-lg tracking-[0.25em] uppercase">
                  Chá de Panela
                </span>
              </div>
            </motion.div>

            {/* Estrelas decorativas inferiores */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center gap-3 pt-2"
            >
              <FourPointStar size={10} color="rose" />
              <FourPointStar size={14} color="wine" />
              <FourPointStar size={10} color="rose" />
            </motion.div>
          </div>

          {/* Decoração de cantos */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#722F37]/40" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#722F37]/40" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#722F37]/40" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#722F37]/40" />
        </div>
      </div>
    </div>
  );
}
