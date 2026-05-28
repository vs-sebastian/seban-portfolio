import {
  FRAME_COUNT,
  MIN_FRAMES_FOR_REVEAL,
} from "./config";
import {
  createSequenceLoader,
  type FrameSlot,
  type SequenceLoader,
  type SequenceLoaderCallbacks,
} from "./loadSequence";

type Listener = SequenceLoaderCallbacks;

let sharedSlots: FrameSlot[] | null = null;
let loader: SequenceLoader | null = null;
let subscribers = 0;
let heroReady = false;
let revealReady = false;
let fullyLoaded = false;
let progress = 0;
const listeners = new Set<Listener>();

function emit(): void {
  for (const cb of listeners) {
    cb.onProgress(progress);
    if (heroReady) cb.onHeroReady();
    if (revealReady) cb.onRevealReady();
    if (fullyLoaded) cb.onFullyLoaded();
  }
}

function ensureLoaderStarted(): SequenceLoader {
  if (loader && sharedSlots) return loader;

  sharedSlots = Array.from({ length: FRAME_COUNT }, () => ({
    image: null,
    ready: false,
  }));

  loader = createSequenceLoader(
    {
      onProgress: (percent) => {
        progress = percent;
        emit();
      },
      onHeroReady: () => {
        if (!heroReady) {
          heroReady = true;
          emit();
        }
      },
      onRevealReady: () => {
        if (!revealReady) {
          revealReady = true;
          emit();
        }
      },
      onFullyLoaded: () => {
        if (!fullyLoaded) {
          fullyLoaded = true;
          emit();
        }
      },
    },
    sharedSlots
  );

  return loader;
}

export function isSequenceWarm(): boolean {
  return heroReady && Boolean(sharedSlots?.[0]?.ready);
}

export function isSequenceRevealReady(): boolean {
  return revealReady;
}

export function acquireSequenceLoader(
  callbacks: SequenceLoaderCallbacks
): SequenceLoader {
  listeners.add(callbacks);
  subscribers += 1;

  const active = ensureLoaderStarted();
  callbacks.onProgress(progress);
  if (heroReady) callbacks.onHeroReady();
  if (revealReady) callbacks.onRevealReady();
  if (fullyLoaded) callbacks.onFullyLoaded();

  return active;
}

export function releaseSequenceLoader(
  callbacks: SequenceLoaderCallbacks
): void {
  listeners.delete(callbacks);
  subscribers = Math.max(0, subscribers - 1);
  // Keep slots and background loading warm for fast return navigation.
}
