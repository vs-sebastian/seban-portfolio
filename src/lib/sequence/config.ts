export const FRAME_COUNT = 120;

/** Frames required before the hero is revealed (first frame + scroll head buffer). */
export const MIN_FRAMES_FOR_REVEAL = 12;

/** Parallel decode batch size for background loading. */
export const PRELOAD_BATCH_SIZE = 8;

export function frameSrc(index: number): string {
  const indexStr = index.toString().padStart(3, "0");
  return `/sequence/frame_${indexStr}.webp`;
}
