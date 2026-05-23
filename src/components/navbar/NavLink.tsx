"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import type { NavItem } from "@/config/navigation";

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  onSelect?: () => void;
  layoutId?: string;
  className?: string;
}

const MAGNETIC_STRENGTH = 0.22;

export default function NavLink({
  item,
  isActive,
  onSelect,
  layoutId = "nav-active-pill",
  className = "",
}: NavLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 30 });
  const springY = useSpring(y, { stiffness: 350, damping: 30 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    x.set(offsetX * MAGNETIC_STRENGTH);
    y.set(offsetY * MAGNETIC_STRENGTH);
  };

  const resetMagnetic = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      className={`relative ${className}`}
    >
      <Link
        ref={ref}
        href={item.href}
        onClick={onSelect}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetMagnetic}
        className={`relative z-10 block px-3.5 py-2 text-[13px] md:text-[14px] font-medium tracking-wide transition-colors duration-300 rounded-full ${
          isActive ? "text-white" : "text-white/55 hover:text-white/90"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && (
          <motion.span
            layoutId={layoutId}
            className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_20px_rgba(255,255,255,0.06)] backdrop-blur-md"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative z-10">{item.label}</span>
      </Link>
    </motion.div>
  );
}
