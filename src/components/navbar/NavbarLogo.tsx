"use client";

import { motion } from "framer-motion";
import HomeLink from "@/components/navigation/HomeLink";

export default function NavbarLogo() {
  return (
    <HomeLink
      className="group flex items-center gap-2.5 shrink-0"
      aria-label="Sebastian VS — Home"
    >
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
      >
        <span className="text-[11px] font-semibold tracking-tight text-white/90">
          SV
        </span>
        <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/[0.06] transition-colors duration-500" />
      </motion.div>
      <span className="hidden lg:block text-[13px] font-medium text-white/50 group-hover:text-white/80 transition-colors duration-300 tracking-wide">
        Sebastian VS
      </span>
    </HomeLink>
  );
}
