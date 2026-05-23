"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";

const SCROLL_THRESHOLD = 8;

/**
 * Scroll-derived navbar state: opacity/blur intensity and hide-on-scroll-down.
 * Uses a single passive listener + springs for GPU-friendly motion values.
 */
export function useNavbarScroll() {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const scrollProgress = useMotionValue(0);
  const intensity = useSpring(scrollProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastScrollY.current;

        if (y < 80) {
          setIsVisible(true);
        } else if (delta > SCROLL_THRESHOLD) {
          setIsVisible(false);
        } else if (delta < -SCROLL_THRESHOLD) {
          setIsVisible(true);
        }

        const progress = Math.min(y / 400, 1);
        scrollProgress.set(progress);

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollProgress]);

  return { isVisible, intensity };
}
