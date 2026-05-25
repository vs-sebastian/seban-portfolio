"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/projects/types";
import { cinematicEase } from "@/lib/motion";

interface ProjectsHubProps {
  categories: Category[];
}

export default function ProjectsHub({ categories }: ProjectsHubProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: i * 0.08, ease: cinematicEase }}
        >
          <Link
            href={`/projects/${cat.slug}`}
            className="group relative block rounded-3xl overflow-hidden border border-white/10 bg-[#161616] hover:border-white/20 transition-colors duration-500"
          >
            <div className="relative aspect-[16/9] bg-[#0a0a0a] overflow-hidden">
              {cat.cover?.kind === "image" && (
                <Image
                  src={cat.cover.src}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-[1.02] transition-all duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-xs uppercase tracking-[0.25em] text-white/45 mb-3">
                  {cat.projectCount} projects
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {cat.title}
                </h2>
                <p className="text-white/60 font-light max-w-md text-sm md:text-base leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between px-8 py-5 border-t border-white/5">
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                Explore category
              </span>
              <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
