"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useScroll, useTransform, motion, AnimatePresence } from "framer-motion";
import Overlay from "./Overlay";
import { FRAME_COUNT } from "@/lib/sequence/config";
import { drawFrameCover } from "@/lib/sequence/drawFrame";
import type { SequenceLoaderCallbacks } from "@/lib/sequence/loadSequence";
import {
  acquireSequenceLoader,
  isSequenceRevealReady,
  isSequenceWarm,
  releaseSequenceLoader,
} from "@/lib/sequence/sequence-session";

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<ReturnType<typeof acquireSequenceLoader> | null>(null);
  const drawnIndexRef = useRef(-1);
  const firstPaintRef = useRef(false);
  const revealReadyRef = useRef(isSequenceRevealReady());

  const warm = isSequenceWarm();
  const [loadProgress, setLoadProgress] = useState(warm ? 100 : 0);
  const [showHero, setShowHero] = useState(warm);
  const [isFullyLoaded, setIsFullyLoaded] = useState(warm);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  const tryReveal = useCallback(() => {
    if (firstPaintRef.current && revealReadyRef.current) {
      setShowHero(true);
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(window.innerWidth * dpr);
    const h = Math.floor(window.innerHeight * dpr);

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    drawnIndexRef.current = -1;
  }, []);

  const paintFrame = useCallback(
    (index: number, loader: NonNullable<typeof loaderRef.current>) => {
      const canvas = canvasRef.current;
      if (!canvas) return false;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return false;

      const img = loader.getFrame(index);
      if (!img) return false;

      return drawFrameCover(ctx, canvas, img);
    },
    []
  );

  useEffect(() => {
    resizeCanvas();

    const callbacks: SequenceLoaderCallbacks = {
      onProgress: setLoadProgress,
      onHeroReady: () => {
        resizeCanvas();
        const loader = loaderRef.current;
        if (loader && paintFrame(0, loader)) {
          drawnIndexRef.current = 0;
          firstPaintRef.current = true;
          tryReveal();
        }
      },
      onRevealReady: () => {
        revealReadyRef.current = true;
        tryReveal();
      },
      onFullyLoaded: () => setIsFullyLoaded(true),
    };

    const loader = acquireSequenceLoader(callbacks);
    loaderRef.current = loader;

    if (warm) {
      revealReadyRef.current = isSequenceRevealReady();
      if (paintFrame(0, loader)) {
        drawnIndexRef.current = 0;
        firstPaintRef.current = true;
        tryReveal();
      }
    }

    return () => {
      releaseSequenceLoader(callbacks);
    };
  }, [tryReveal, paintFrame, resizeCanvas, warm]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId = 0;
    let running = true;

    const paint = () => {
      if (!running) return;

      const loader = loaderRef.current;
      if (loader) {
        const target = Math.round(frameIndex.get());
        const resolved = loader.resolveFrameIndex(target);

        if (resolved >= 0 && resolved !== drawnIndexRef.current) {
          const img = loader.getFrame(resolved);
          if (img && drawFrameCover(ctx, canvas, img)) {
            drawnIndexRef.current = resolved;

            if (!firstPaintRef.current) {
              firstPaintRef.current = true;
              tryReveal();
            }
          }
        }
      }

      rafId = requestAnimationFrame(paint);
    };

    rafId = requestAnimationFrame(paint);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
  }, [frameIndex, tryReveal]);

  const showLoader = !showHero;

  return (
    <>
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="sequence-loader"
            initial={{ opacity: warm ? 0 : 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: warm ? 0.2 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#121212]"
          >
            <div className="text-white text-xl font-light tracking-widest mb-4">
              LOADING
            </div>
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300 ease-out"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            {!isFullyLoaded && loadProgress > 0 && (
              <p className="mt-4 text-white/40 text-xs font-light tracking-wide">
                Buffering sequence…
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        id="home"
        ref={containerRef}
        className="relative h-[500vh] w-full bg-[#121212] scroll-mt-24"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#121212]">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 transition-opacity duration-700 ease-out"
            style={{ opacity: showHero ? 1 : 0 }}
          />

          <motion.div
            className="absolute inset-0 z-10 bg-black/40"
            initial={false}
            animate={{ opacity: showHero ? 1 : 0 }}
            transition={{ duration: warm ? 0.25 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {showHero && <Overlay scrollYProgress={scrollYProgress} />}
        </div>
      </div>
    </>
  );
}
