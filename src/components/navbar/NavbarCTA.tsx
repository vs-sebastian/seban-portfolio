"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface NavbarCTAProps {
  compact?: boolean;
}

export default function NavbarCTA({ compact = false }: NavbarCTAProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href="#contact"
        className={`group relative inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] border border-white/15 text-white/90 font-medium hover:bg-white/[0.12] hover:text-white transition-colors duration-300 shadow-[0_0_24px_rgba(255,255,255,0.04)] ${
          compact ? "px-3.5 py-2 text-[12px]" : "px-4 py-2 text-[13px]"
        }`}
      >
        <span>Let&apos;s talk</span>
        <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
      </Link>
    </motion.div>
  );
}
