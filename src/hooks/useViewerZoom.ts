"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.35;
const WHEEL_SENSITIVITY = 0.0012;

export interface ViewerTransform {
  scale: number;
  x: number;
  y: number;
}

function clampScale(value: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export function useViewerZoom(enabled: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ViewerTransform>({ scale: 1, x: 0, y: 0 });
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(
    null
  );
  const isPanningRef = useRef(false);

  const [transform, setTransform] = useState<ViewerTransform>({
    scale: 1,
    x: 0,
    y: 0,
  });

  const applyTransform = useCallback((next: ViewerTransform, syncState = true) => {
    const scale = clampScale(next.scale);
    const x = scale <= 1 ? 0 : next.x;
    const y = scale <= 1 ? 0 : next.y;
    const t = { scale, x, y };
    transformRef.current = t;

    const layer = containerRef.current?.querySelector(
      "[data-viewer-layer]"
    ) as HTMLElement | null;
    if (layer) {
      layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    if (syncState) setTransform(t);
  }, []);

  const reset = useCallback(() => {
    applyTransform({ scale: 1, x: 0, y: 0 });
    panStartRef.current = null;
    isPanningRef.current = false;
    pinchStartRef.current = null;
    pointersRef.current.clear();
  }, [applyTransform]);

  const zoomAtPoint = useCallback(
    (clientX: number, clientY: number, targetScale: number) => {
      const el = containerRef.current;
      if (!el) return;

      const prev = transformRef.current;
      const nextScale = clampScale(targetScale);

      if (nextScale <= 1) {
        applyTransform({ scale: 1, x: 0, y: 0 });
        return;
      }

      const rect = el.getBoundingClientRect();
      const originX = clientX - rect.left - rect.width / 2;
      const originY = clientY - rect.top - rect.height / 2;
      const ratio = nextScale / prev.scale;

      applyTransform({
        scale: nextScale,
        x: prev.x - originX * (ratio - 1),
        y: prev.y - originY * (ratio - 1),
      });
    },
    [applyTransform]
  );

  const zoomToCenter = useCallback(
    (delta: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      zoomAtPoint(cx, cy, transformRef.current.scale + delta);
    },
    [zoomAtPoint]
  );

  const zoomIn = useCallback(() => {
    zoomToCenter(ZOOM_STEP);
  }, [zoomToCenter]);

  const zoomOut = useCallback(() => {
    zoomToCenter(-ZOOM_STEP);
  }, [zoomToCenter]);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current?.closest("[data-viewer-root]") as HTMLElement | null;
    if (!el) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await el.requestFullscreen();
      }
    } catch {
      /* fullscreen may be blocked */
    }
  }, []);

  const getPinchDistance = useCallback(() => {
    const pts = Array.from(pointersRef.current.values());
    if (pts.length < 2) return 0;
    const dx = pts[0].x - pts[1].x;
    const dy = pts[0].y - pts[1].y;
    return Math.hypot(dx, dy);
  }, []);

  useEffect(() => {
    if (!enabled) {
      reset();
    }
  }, [enabled, reset]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = -e.deltaY * WHEEL_SENSITIVITY * (e.ctrlKey ? 2.5 : 1);
      zoomAtPoint(
        e.clientX,
        e.clientY,
        transformRef.current.scale + delta * transformRef.current.scale
      );
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [enabled, zoomAtPoint]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || e.button !== 0) return;

      const target = e.target as HTMLElement;
      if (target.closest("button, a, video")) return;

      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      containerRef.current?.setPointerCapture(e.pointerId);

      if (pointersRef.current.size === 2) {
        isPanningRef.current = false;
        panStartRef.current = null;
        pinchStartRef.current = {
          distance: getPinchDistance(),
          scale: transformRef.current.scale,
        };
        return;
      }

      if (transformRef.current.scale > 1) {
        isPanningRef.current = true;
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          offsetX: transformRef.current.x,
          offsetY: transformRef.current.y,
        };
      }
    },
    [enabled, getPinchDistance]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || !pointersRef.current.has(e.pointerId)) return;

      const prev = pointersRef.current.get(e.pointerId)!;
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size >= 2 && pinchStartRef.current) {
        const dist = getPinchDistance();
        if (dist < 1 || pinchStartRef.current.distance < 1) return;

        const ratio = dist / pinchStartRef.current.distance;
        const centerX =
          (Array.from(pointersRef.current.values()).reduce((s, p) => s + p.x, 0) ?? 0) /
          pointersRef.current.size;
        const centerY =
          (Array.from(pointersRef.current.values()).reduce((s, p) => s + p.y, 0) ?? 0) /
          pointersRef.current.size;

        zoomAtPoint(
          centerX,
          centerY,
          pinchStartRef.current.scale * ratio
        );
        return;
      }

      if (isPanningRef.current && panStartRef.current && transformRef.current.scale > 1) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        applyTransform({
          scale: transformRef.current.scale,
          x: panStartRef.current.offsetX + dx,
          y: panStartRef.current.offsetY + dy,
        });
      }

      void prev;
    },
    [enabled, getPinchDistance, zoomAtPoint, applyTransform]
  );

  const endPointer = useCallback((e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);

    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }

    if (pointersRef.current.size === 0) {
      isPanningRef.current = false;
      panStartRef.current = null;
    } else if (pointersRef.current.size === 1 && transformRef.current.scale > 1) {
      const remaining = Array.from(pointersRef.current.entries())[0];
      isPanningRef.current = true;
      panStartRef.current = {
        x: remaining[1].x,
        y: remaining[1].y,
        offsetX: transformRef.current.x,
        offsetY: transformRef.current.y,
      };
    }

    try {
      if (containerRef.current?.hasPointerCapture(e.pointerId)) {
        containerRef.current.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* already released */
    }
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => endPointer(e),
    [endPointer]
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent) => endPointer(e),
    [endPointer]
  );

  return {
    containerRef,
    transform,
    reset,
    zoomIn,
    zoomOut,
    zoomToCenter,
    toggleFullscreen,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    canPan: transform.scale > 1,
  };
}
