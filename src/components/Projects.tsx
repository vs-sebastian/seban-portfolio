"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SafeImage from "@/components/media/SafeImage";
import OptimizedVideo from "@/components/media/OptimizedVideo";
import { ArrowRight } from "lucide-react";
import type { ProjectSummary } from "@/lib/projects/types";

export interface CategoryLink {
  label: string;
  href: string;
}

interface ProjectsProps {
  featured: ProjectSummary[];
  categoryLinks: CategoryLink[];
}

export default function Projects({ featured, categoryLinks }: ProjectsProps) {
  return (
    <section id="projects" className="py-32 px-6 md:px-24 bg-[#121212] relative z-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Selected Work</h2>
            <div className="w-20 h-1 bg-white/20 rounded-full" />
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
          >
            View full gallery
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-12">
          {categoryLinks.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white/90 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, i) => (
            <motion.div
              key={`${project.categorySlug}-${project.slug}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            >
              <Link
                href={`/projects/${project.categorySlug}/${project.slug}`}
                className="group relative block p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-transparent hover:from-white/30 transition-colors duration-500"
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                <div className="relative h-full bg-[#161616] backdrop-blur-xl rounded-2xl overflow-hidden border border-white/5 group-hover:border-white/10 transition-colors duration-500 flex flex-col">
                  {project.cover?.kind === "image" && (
                    <div className="relative aspect-[16/10] bg-[#0d0d0d]">
                      <SafeImage
                        src={project.cover.src}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>
                  )}
                  {project.cover?.kind === "video" && (
                    <div className="relative aspect-[16/10] bg-[#0d0d0d]">
                      <OptimizedVideo
                        src={project.cover.src}
                        lazy
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover object-center opacity-75 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                      />
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45 mb-2">
                      {project.categoryTitle}
                    </p>
                    <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-white/60 font-light leading-relaxed mb-6 text-sm flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-3 py-1 bg-white/5 rounded-full text-white/70 border border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="flex items-center text-sm font-medium text-white/80 group-hover:text-white transition-colors w-fit">
                      View Project
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
