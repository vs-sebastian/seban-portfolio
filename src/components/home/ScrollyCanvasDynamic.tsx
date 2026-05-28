"use client";

import dynamic from "next/dynamic";

/** Matches hero footprint — avoids layout shift while the canvas chunk loads. */
function ScrollyCanvasPlaceholder() {
  return (
    <div
      className="relative h-[500vh] w-full bg-[#121212] scroll-mt-24"
      aria-hidden
    >
      <div className="sticky top-0 h-screen w-full bg-[#121212]" />
    </div>
  );
}

const ScrollyCanvas = dynamic(() => import("@/components/ScrollyCanvas"), {
  ssr: false,
  loading: ScrollyCanvasPlaceholder,
});

export default ScrollyCanvas;
