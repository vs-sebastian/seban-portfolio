"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play, Maximize2, FileText } from "lucide-react";
import type { Project } from "@/lib/projects/types";
import { cinematicEase } from "@/lib/motion";
import ImmersiveViewer from "@/components/viewer/ImmersiveViewer";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const viewable = project.media.filter(
    (m) => m.kind === "image" || m.kind === "video" || m.kind === "presentation"
  );
  const images = viewable.filter((m) => m.kind === "image");
  const displayMedia = images.length > 0 ? images : viewable;

  const openViewer = (item: (typeof project.media)[0]) => {
    const idx = viewable.findIndex((m) => m.id === item.id);
    setViewerIndex(idx >= 0 ? idx : 0);
    setViewerOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: cinematicEase }}
        className="mb-12 flex flex-wrap gap-2"
      >
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/10"
          >
            {tag}
          </span>
        ))}
        <span className="text-xs text-white/40 self-center ml-2">
          {project.mediaCount} assets · {project.layout.replace("-", " ")}
        </span>
      </motion.div>

      <button
        type="button"
        onClick={() => openViewer(viewable[0] ?? project.media[0])}
        className="group relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 mb-12 bg-[#0a0a0a]"
      >
        {project.cover?.kind === "image" && (
          <Image
            src={project.cover.src}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-contain transition-transform duration-700 group-hover:scale-[1.02]"
          />
        )}
        {project.cover?.kind === "video" && (
          <video
            src={project.cover.src}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl text-sm font-medium text-white">
            <Maximize2 className="w-4 h-4" />
            Immersive View
          </span>
        </div>
      </button>

      <div
        className={
          project.layout === "ui-showcase"
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : project.layout === "editorial"
              ? "columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
              : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
        }
      >
        {displayMedia.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: Math.min(i * 0.03, 0.3), duration: 0.5, ease: cinematicEase }}
            onClick={() => openViewer(item)}
            className={`relative overflow-hidden rounded-xl border border-white/10 bg-[#141414] hover:border-white/25 transition-all group text-left w-full break-inside-avoid ${
              item.orientation === "portrait"
                ? "aspect-[3/4]"
                : item.orientation === "square"
                  ? "aspect-square"
                  : "aspect-[16/10]"
            }`}
          >
            {item.kind === "image" && (
              <Image
                src={item.src}
                alt={item.fileName}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
            )}
            {item.kind === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Play className="w-8 h-8 text-white/80" />
              </div>
            )}
            {item.kind === "presentation" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/60">
                <FileText className="w-8 h-8" />
                <span className="text-xs px-2 text-center truncate max-w-full">
                  {item.fileName}
                </span>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <ImmersiveViewer
        project={project}
        initialIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </>
  );
}
