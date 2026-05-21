import {
  FRAME_COUNT,
  MIN_FRAMES_FOR_REVEAL,
  PRELOAD_BATCH_SIZE,
  frameSrc,
} from "./config";

export type FrameSlot = {
  image: HTMLImageElement | null;
  ready: boolean;
};

export type SequenceLoaderCallbacks = {
  onProgress: (percent: number) => void;
  onHeroReady: () => void;
  onRevealReady: () => void;
  onFullyLoaded: () => void;
};

function loadAndDecode(index: number, attempt = 0): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";

    const finish = async () => {
      try {
        if (img.decode) await img.decode();
      } catch {
        /* decode() may reject while the bitmap is still usable */
      }
      resolve(
        img.complete && img.naturalWidth > 0 && img.naturalHeight > 0
          ? img
          : null
      );
    };

    img.onload = () => void finish();
    img.onerror = () => {
      if (attempt < 1) {
        void loadAndDecode(index, attempt + 1).then(resolve);
      } else {
        resolve(null);
      }
    };
    img.src = frameSrc(index);
  });
}

/** Priority order: frame 0, early scroll range, then the rest. */
function buildLoadOrder(): number[] {
  const order: number[] = [0];
  const seen = new Set<number>([0]);

  const push = (i: number) => {
    if (i >= 0 && i < FRAME_COUNT && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };

  for (let i = 1; i < MIN_FRAMES_FOR_REVEAL; i++) push(i);
  for (let i = MIN_FRAMES_FOR_REVEAL; i < FRAME_COUNT; i++) push(i);

  return order;
}

const LOAD_ORDER = buildLoadOrder();

export function createSequenceLoader(callbacks: SequenceLoaderCallbacks) {
  const slots: FrameSlot[] = Array.from({ length: FRAME_COUNT }, () => ({
    image: null,
    ready: false,
  }));

  let heroReady = false;
  let revealReady = false;
  let cancelled = false;

  const reportProgress = () => {
    const ready = slots.filter((s) => s.ready).length;
    callbacks.onProgress((ready / FRAME_COUNT) * 100);
  };

  const checkMilestones = () => {
    if (!heroReady && slots[0]?.ready) {
      heroReady = true;
      callbacks.onHeroReady();
    }

    const headBuffered = slots
      .slice(0, MIN_FRAMES_FOR_REVEAL)
      .filter((s) => s.ready).length;

    if (!revealReady && headBuffered >= MIN_FRAMES_FOR_REVEAL) {
      revealReady = true;
      callbacks.onRevealReady();
    }

  };

  const loadIndex = async (index: number) => {
    const img = await loadAndDecode(index);
    if (cancelled) return;

    if (img) {
      slots[index] = { image: img, ready: true };
      reportProgress();
      checkMilestones();
    }
  };

  const run = async () => {
    await loadIndex(0);

    let i = 1;
    while (i < LOAD_ORDER.length && !cancelled) {
      const batch = LOAD_ORDER.slice(i, i + PRELOAD_BATCH_SIZE);
      i += PRELOAD_BATCH_SIZE;
      await Promise.all(batch.map((idx) => loadIndex(idx)));
    }

    if (!cancelled) {
      callbacks.onFullyLoaded();
    }
  };

  void run();

  return {
    slots,
    isFrameReady: (index: number) => Boolean(slots[index]?.ready),
    getFrame: (index: number) => slots[index]?.image ?? null,
    /** Nearest decoded frame — prevents black gaps during fast scrubbing. */
    resolveFrameIndex(target: number): number {
      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, target));
      if (slots[clamped]?.ready) return clamped;

      for (let d = 1; d < FRAME_COUNT; d++) {
        const lo = clamped - d;
        const hi = clamped + d;
        if (lo >= 0 && slots[lo]?.ready) return lo;
        if (hi < FRAME_COUNT && slots[hi]?.ready) return hi;
      }
      return -1;
    },
    cancel: () => {
      cancelled = true;
    },
  };
}
