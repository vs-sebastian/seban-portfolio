"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import type { Project } from "@/lib/projects/types";
import { useViewerZoom } from "@/hooks/useViewerZoom";
import { cinematicEase } from "@/lib/motion";
import ViewerStage from "./ViewerStage";
import ThumbnailRail from "./ThumbnailRail";

interface ImmersiveViewerProps {
  project: Project;
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImmersiveViewer({
  project,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImmersiveViewerProps) {
  const viewable = project.media.filter(
    (m) => m.kind === "image" || m.kind === "video" || m.kind === "presentation"
  );
  const [index, setIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(false);

  const asset = viewable[index] ?? null;
  const isImage = asset?.kind === "image";
  const zoom = useViewerZoom(isOpen && isImage);

  const ambientSrc =
    asset?.kind === "image"
      ? asset.src
      : project.cover?.kind === "image"
        ? project.cover.src
        : null;

  useEffect(() => {
    if (isOpen) setIndex(initialIndex);
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => {
        const next = i + dir;
        if (next < 0) return viewable.length - 1;
        if (next >= viewable.length) return 0;
        return next;
      });
      zoom.reset();
      setIsLoading(true);
    },
    [viewable.length, zoom]
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          void document.exitFullscreen();
        } else {
          onClose();
        }
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
      if (isImage) {
        if (e.key === "+" || e.key === "=") zoom.zoomIn();
        if (e.key === "-") zoom.zoomOut();
        if (e.key === "0") zoom.reset();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, go, zoom, isImage]);

  useEffect(() => {
    if (!asset || asset.kind !== "image") {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const img = new window.Image();
    img.src = asset.src;
    img.onload = () => setIsLoading(false);
    img.onerror = () => setIsLoading(false);
  }, [asset]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-viewer-root
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: cinematicEase }}
          className="fixed inset-0 z-[100] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing ${project.title}`}
        >
          {ambientSrc && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <Image
                src={ambientSrc}
                alt=""
                fill
                className="object-cover scale-110 blur-3xl opacity-30 saturate-150"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-[#080808]/85 backdrop-blur-2xl" />
            </div>
          )}
          {!ambientSrc && (
            <div className="absolute inset-0 bg-[#080808]/95 backdrop-blur-2xl pointer-events-none" />
          )}

          <div className="relative z-10 flex flex-col h-full min-h-0">
            <header className="flex items-center justify-between px-4 md:px-8 py-4 shrink-0">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 truncate">
                  {project.categoryTitle}
                </p>
                <h2 className="text-lg md:text-xl font-semibold text-white truncate">
                  {project.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {isImage && (
                  <div className="flex items-center gap-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl px-2 py-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        zoom.zoomOut();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      aria-label="Zoom out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        zoom.zoomIn();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      aria-label="Zoom in"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        zoom.reset();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      aria-label="Reset zoom and pan"
                      title="Reset view"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void zoom.toggleFullscreen();
                      }}
                      className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                      aria-label="Toggle fullscreen"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition-colors"
                  aria-label="Close viewer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </header>

            <div className="relative flex-1 flex items-stretch min-h-0 px-2 md:px-6">
              <button
                type="button"
                onClick={() => go(-1)}
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <ViewerStage
                asset={asset}
                zoom={zoom}
                isLoading={isLoading}
                interactionsEnabled={isImage}
              />

              <button
                type="button"
                onClick={() => go(1)}
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-black/40 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <footer className="pb-4 md:pb-6 shrink-0">
              <div className="mx-auto max-w-4xl rounded-2xl bg-black/35 border border-white/10 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 text-xs text-white/50">
                  <span>
                    {index + 1} / {viewable.length}
                  </span>
                  <span className="truncate max-w-[50%]">{asset?.fileName}</span>
                </div>
                <ThumbnailRail
                  media={viewable}
                  activeIndex={index}
                  onSelect={(i) => {
                    setIndex(i);
                    zoom.reset();
                  }}
                />
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
