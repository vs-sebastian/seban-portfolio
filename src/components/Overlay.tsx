"use client";

import React from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  // Section 1: 0% to 25%
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.25, 1], [1, 1, 0, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.25, 1], [0, -50, -50]);

  // Section 2: 30% to 55%
  const opacity2 = useTransform(scrollYProgress, [0, 0.25, 0.3, 0.5, 0.55, 1], [0, 0, 1, 1, 0, 0]);
  const y2 = useTransform(scrollYProgress, [0, 0.25, 0.3, 0.55, 1], [50, 50, 0, -50, -50]);

  // Section 3: 60% to 85%
  const opacity3 = useTransform(scrollYProgress, [0, 0.55, 0.6, 0.8, 0.9, 1], [0, 0, 1, 1, 0, 0]);
  const y3 = useTransform(scrollYProgress, [0, 0.55, 0.6, 0.9, 1], [50, 50, 0, -50, -50]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 md:px-24 pointer-events-none">
      
      {/* Section 1 */}
      <motion.div 
        style={{ opacity: opacity1, y: y1 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4 drop-shadow-2xl">
          Sebastian VS
        </h1>
        <h2 className="text-xl md:text-2xl font-light text-white/80 mb-6 uppercase tracking-widest">
          Graphic Designer • UI/UX Designer • UI Developer
        </h2>
        <p className="max-w-2xl text-white/60 font-light text-sm md:text-base leading-relaxed">
          Crafting visually immersive digital experiences through design, motion, and frontend development.
        </p>
      </motion.div>

      {/* Section 2 */}
      <motion.div 
        style={{ opacity: opacity2, y: y2 }}
        className="absolute inset-0 flex flex-col items-start justify-center text-left px-8 md:px-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl max-w-3xl">
          I build digital experiences.
        </h2>
        <p className="max-w-xl text-white/70 font-light text-lg md:text-xl leading-relaxed">
          From UI systems and responsive interfaces to cinematic edits, motion graphics, and visual storytelling.
        </p>
      </motion.div>

      {/* Section 3 */}
      <motion.div 
        style={{ opacity: opacity3, y: y3 }}
        className="absolute inset-0 flex flex-col items-end justify-center text-right px-8 md:px-24"
      >
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 drop-shadow-2xl max-w-3xl">
          Bridging creativity and technology.
        </h2>
        <p className="max-w-xl text-white/70 font-light text-lg md:text-xl leading-relaxed">
          Combining graphic design, UI/UX thinking, video editing, and frontend development into seamless digital experiences.
        </p>
      </motion.div>

    </div>
  );
}
