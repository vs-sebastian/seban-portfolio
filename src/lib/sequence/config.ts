import { FRAME_COUNT } from "./generated";

export { FRAME_COUNT };

/** Frames required before the hero is revealed (first frame + scroll head buffer). */
export const MIN_FRAMES_FOR_REVEAL = Math.min(12, FRAME_COUNT);

/** Parallel decode batch size for background loading. */
export const PRELOAD_BATCH_SIZE = 8;

export function frameSrc(index: number): string {
  const indexStr = index.toString().padStart(3, "0");
  return `/sequence/frame_${indexStr}.webp`;
}
