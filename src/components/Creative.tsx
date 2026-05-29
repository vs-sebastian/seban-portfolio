"use client";

import React from "react";
import { motion } from "framer-motion";
import SafeImage from "@/components/media/SafeImage";

const VIOLIN_IMAGE_SRC = "/my profile images/seb_with_violin.webp";

const interests = [
  { label: "Music & Production", desc: "Violin, Guitar, Piano & Music Production" },
  { label: "Visual Arts", desc: "Drawing & Sketching" },
  { label: "Exploration", desc: "Traveling & Hiking" },
  { label: "Sports", desc: "Football & Cricket" }
];

export default function Creative() {
  return (
    <section id="experiments" className="py-32 px-6 md:px-24 bg-[#121212] relative z-20 overflow-hidden scroll-mt-24">
      
      {/* Decorative ambient glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 w-full aspect-square md:aspect-[4/3] relative rounded-3xl overflow-hidden glass border border-white/10 group shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        >
          <div
            className="absolute -inset-4 bg-purple-500/10 rounded-[2rem] blur-3xl opacity-60 pointer-events-none"
            aria-hidden
          />

          <SafeImage
            src={VIOLIN_IMAGE_SRC}
            alt="Sebastian VS with violin — beyond the screen"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-900/10 pointer-events-none" />
          <div className="noise opacity-[0.04] pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-12"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Beyond the Screen
            </h2>
            <div className="w-20 h-1 bg-white/20 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {interests.map((interest, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="space-y-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-white/30 transition-all duration-300">
                  <div className="w-2 h-2 rounded-full bg-white/40 group-hover:bg-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-white/90 group-hover:text-white transition-colors">
                  {interest.label}
                </h3>
                <p className="text-white/50 text-sm font-light">
                  {interest.desc}
                </p>
              </motion.div>
            ))}
          </div>
          
        </motion.div>
        
      </div>
    </section>
  );
}
