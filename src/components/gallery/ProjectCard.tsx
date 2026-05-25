"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/projects/types";
import { cinematicEase } from "@/lib/motion";

interface ProjectCardProps {
  project: ProjectSummary;
  index?: number;
  priority?: boolean;
}

function aspectClass(orientation?: string): string {
  if (orientation === "portrait") return "aspect-[3/4]";
  if (orientation === "square") return "aspect-square";
  return "aspect-[16/10]";
}

export default function ProjectCard({
  project,
  index = 0,
  priority = false,
}: ProjectCardProps) {
  const href = `/projects/${project.categorySlug}/${project.slug}`;
  const cover = project.cover;
  const aspect = aspectClass(cover?.orientation);

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.06, ease: cinematicEase }}
    >
      <Link href={href} className="group block">
        <div className="relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent group-hover:from-white/25 transition-colors duration-500">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />

          <div className="relative rounded-2xl overflow-hidden bg-[#161616] border border-white/5 group-hover:border-white/15 transition-colors duration-500">
            <div className={`relative w-full ${aspect} bg-[#0d0d0d] overflow-hidden`}>
              {cover?.kind === "image" && (
                <Image
                  src={cover.src}
                  alt={project.title}
                  fill
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
              {cover?.kind === "video" && (
                <video
                  src={cover.src}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
              )}
              {!cover && (
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-sm font-light">
                  Preview unavailable
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">
                      {project.categoryTitle}
                    </p>
                    <h3 className="text-xl md:text-2xl font-semibold text-white group-hover:text-white transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 flex flex-wrap gap-2 border-t border-white/5">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10"
                >
                  {tag}
                </span>
              ))}
              <span className="text-[11px] text-white/40 ml-auto self-center">
                {project.mediaCount} assets
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
