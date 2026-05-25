"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import type { ProjectSummary } from "@/lib/projects/types";
import { cinematicEase } from "@/lib/motion";

interface VideoPreviewCardProps {
  project: ProjectSummary;
  index?: number;
}

export default function VideoPreviewCard({
  project,
  index = 0,
}: VideoPreviewCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const href = `/projects/${project.categorySlug}/${project.slug}`;
  const src = project.cover?.kind === "video" ? project.cover.src : null;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void el.play().catch(() => {});
        } else {
          el.pause();
          el.currentTime = 0;
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: cinematicEase }}
      className="snap-start shrink-0 w-[min(85vw,480px)]"
    >
      <Link
        href={href}
        className="group block rounded-2xl overflow-hidden border border-white/10 bg-[#141414] hover:border-white/20 transition-colors"
      >
        <div className="relative aspect-video bg-black">
          {src && (
            <video
              ref={videoRef}
              src={src}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/15">
                <Play className="w-3.5 h-3.5 fill-white text-white" />
              </span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                Motion
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
