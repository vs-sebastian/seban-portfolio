"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { MediaAsset } from "@/lib/projects/types";

interface ThumbnailRailProps {
  media: MediaAsset[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export default function ThumbnailRail({
  media,
  activeIndex,
  onSelect,
}: ThumbnailRailProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 max-w-full scrollbar-thin">
      {media.map((item, i) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(i)}
          className={`relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border transition-all duration-300 ${
            i === activeIndex
              ? "border-white/40 ring-2 ring-white/20 scale-105"
              : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/25"
          }`}
        >
          {item.kind === "image" && (
            <Image
              src={item.src}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          )}
          {item.kind === "video" && (
            <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-[10px] text-white/70">
              VID
            </div>
          )}
          {item.kind === "presentation" && (
            <div className="absolute inset-0 bg-white/10 flex items-center justify-center text-[10px] text-white/70">
              PPT
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
