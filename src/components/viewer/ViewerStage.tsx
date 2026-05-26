"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImage from "@/components/media/SafeImage";
import type { MediaAsset } from "@/lib/projects/types";
import { cinematicEase } from "@/lib/motion";
import type { useViewerZoom } from "@/hooks/useViewerZoom";

interface ViewerStageProps {
  asset: MediaAsset | null;
  zoom: ReturnType<typeof useViewerZoom>;
  isLoading?: boolean;
  interactionsEnabled?: boolean;
}

export default function ViewerStage({
  asset,
  zoom,
  isLoading,
  interactionsEnabled = true,
}: ViewerStageProps) {
  const {
    containerRef,
    transform,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    canPan,
  } = zoom;

  useEffect(() => {
    const layer = containerRef.current?.querySelector(
      "[data-viewer-layer]"
    ) as HTMLElement | null;
    if (layer) {
      layer.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`;
    }
  }, [asset?.id, containerRef, transform]);

  return (
    <div
      ref={containerRef}
      className="relative flex-1 flex items-center justify-center overflow-hidden select-none"
      style={{
        touchAction: "none",
        cursor: canPan ? (interactionsEnabled ? "grab" : "default") : "default",
      }}
      onPointerDown={interactionsEnabled ? onPointerDown : undefined}
      onPointerMove={interactionsEnabled ? onPointerMove : undefined}
      onPointerUp={interactionsEnabled ? onPointerUp : undefined}
      onPointerCancel={interactionsEnabled ? onPointerCancel : undefined}
    >
      <AnimatePresence mode="wait">
        {asset && (
          <div
            key={asset.id}
            data-viewer-layer
            className="relative w-full h-full flex items-center justify-center will-change-transform"
            style={{
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, filter: "blur(10px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: cinematicEase }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {asset.kind === "image" && (
                <div className="relative w-full h-full max-w-[min(96vw,1400px)] max-h-[78vh] mx-auto pointer-events-none">
                  <SafeImage
                    src={asset.src}
                    alt={asset.fileName}
                    fill
                    priority
                    sizes="100vw"
                    quality={90}
                    className="object-contain"
                    draggable={false}
                  />
                </div>
              )}

              {asset.kind === "video" && (
                <video
                  key={asset.src}
                  src={asset.src}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  className="max-w-[min(96vw,1400px)] max-h-[78vh] w-auto h-auto rounded-2xl shadow-2xl pointer-events-auto"
                />
              )}

              {asset.kind === "presentation" && (
                <div className="glass rounded-2xl px-10 py-12 max-w-lg text-center border border-white/10 pointer-events-auto">
                  <p className="text-white/80 font-medium mb-2">Presentation Asset</p>
                  <p className="text-white/50 text-sm font-light mb-6">{asset.fileName}</p>
                  <a
                    href={asset.src}
                    download
                    className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm text-white/90 hover:bg-white/15 transition-colors"
                  >
                    Download deck
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
        </div>
      )}

      {interactionsEnabled && transform.scale > 1 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] text-white/50 backdrop-blur-md pointer-events-none">
          {Math.round(transform.scale * 100)}% — drag to pan
        </div>
      )}
    </div>
  );
}
