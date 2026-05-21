"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Menu } from "lucide-react";
import { useEffect } from "react";
import { NAV_ITEMS, type NavItemId } from "@/config/navigation";
import NavLink from "./NavLink";
import NavbarLogo from "./NavbarLogo";
import NavbarCTA from "./NavbarCTA";

interface NavbarMobileProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeId: NavItemId;
}

const menuVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const itemVariants = {
  closed: { opacity: 0, y: 16 },
  open: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + i * 0.04,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export default function NavbarMobile({
  isOpen,
  onToggle,
  onClose,
  activeId,
}: NavbarMobileProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="flex md:hidden items-center gap-2">
        <NavbarCTA compact />
        <motion.button
          type="button"
          onClick={onToggle}
          whileTap={{ scale: 0.94 }}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-white/80"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
              onClick={onClose}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="absolute inset-x-4 top-20 bottom-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-3xl shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden flex flex-col"
            >
              <div className="px-6 pt-8 pb-4 border-b border-white/5">
                <NavbarLogo />
              </div>

              <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
                {NAV_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <NavLink
                      item={item}
                      isActive={activeId === item.id}
                      onSelect={onClose}
                      layoutId="nav-active-pill-mobile"
                      className="w-full [&_a]:text-lg [&_a]:py-3.5 [&_a]:px-4"
                    />
                  </motion.div>
                ))}
              </nav>

              <div className="px-8 pb-10 pt-4 border-t border-white/5 flex justify-between items-center text-white/40 text-xs font-light">
                <span>Sebastian VS</span>
                <span>Portfolio 2026</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
