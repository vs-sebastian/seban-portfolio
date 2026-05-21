"use client";

import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-32 px-6 md:px-24 bg-[#121212] relative z-20 overflow-hidden scroll-mt-24">
      
      {/* Decorative ambient glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 space-y-8"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-tight">
            Designing at the intersection of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-400">logic and aesthetics.</span>
          </h2>
          
          <div className="w-12 h-1 bg-white/20 rounded-full" />
          
          <div className="space-y-6 text-white/70 font-light text-lg md:text-xl leading-relaxed">
            <p>
              I am an experienced Graphic Designer, UI/UX Designer, and Front-End Developer with a deep passion for visually appealing interfaces and seamless user experiences.
            </p>
            <p>
              My background spans across music, visual creativity, and advanced video editing, giving me a unique editorial eye for digital product design. I believe that true innovation happens when strong design thinking meets solid engineering workflows.
            </p>
            <p>
              Whether I'm structuring a complex SAAS layout or fine-tuning the motion timing of a cinematic edit, my focus is always on creating authentic, engaging, and premium experiences.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="flex-1 w-full aspect-[4/5] relative rounded-3xl overflow-hidden glass border border-white/10 flex items-center justify-center group"
        >
          {/* Subtle noise over a gradient background for an artistic feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
          <div className="noise opacity-[0.03]" />
          
          {/* Abstract geometric shapes to represent creativity and structure */}
          <div className="relative z-10 w-3/4 h-3/4 flex flex-col items-center justify-center space-y-6">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
               className="w-48 h-48 rounded-full border-[1px] border-white/20 border-t-white/60 relative"
             >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-[1px] border-white/10" />
             </motion.div>
          </div>
          
        </motion.div>
        
      </div>
    </section>
  );
}
