"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#0a0a0a] pt-32 pb-12 px-6 md:px-24 z-20 border-t border-white/5 overflow-hidden scroll-mt-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-24 space-y-6"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white/90 tracking-tight max-w-2xl mx-auto leading-tight">
            Designing experiences where visuals, motion, and interaction become one.
          </h2>
          <p className="text-white/50 text-lg font-light">
            Available for new opportunities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 text-sm font-light text-white/50 border-t border-white/5 pt-12"
        >
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-white/80 font-medium mb-2">Location</span>
            <span>Kerala, India</span>
            <span>Local Time: {new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="flex flex-col items-center md:items-center space-y-2">
            <span className="text-white/80 font-medium mb-2">Connect</span>
            <a href="mailto:hello@example.com" className="hover:text-white transition-colors duration-300">
              Email
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors duration-300">
              Behance
            </a>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-2">
            <span className="text-white/80 font-medium mb-2">Sebastian VS</span>
            <span>© {new Date().getFullYear()} All Rights Reserved.</span>
          </div>
        </motion.div>
        
      </div>
    </footer>
  );
}
