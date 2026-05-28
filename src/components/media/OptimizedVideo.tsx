"use client";

import { forwardRef, useEffect, useRef } from "react";

interface OptimizedVideoProps
  extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src"> {
  src?: string;
  /** When true, only load metadata until the element is near the viewport */
  lazy?: boolean;
  lazyRootMargin?: string;
}

/**
 * Cloudinary-friendly video wrapper with optional viewport-gated loading.
 */
const OptimizedVideo = forwardRef<HTMLVideoElement, OptimizedVideoProps>(
  function OptimizedVideo(
    {
      lazy = false,
      lazyRootMargin = "200px",
      preload,
      src,
      className,
      ...props
    },
    ref
  ) {
    const internalRef = useRef<HTMLVideoElement>(null);
    const setRef = (node: HTMLVideoElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    useEffect(() => {
      if (!lazy || !src) return;

      const el = internalRef.current;
      if (!el) return;

      el.preload = "none";

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (!el.src && src) el.src = src;
          el.preload = "metadata";
          observer.disconnect();
        },
        { rootMargin: lazyRootMargin, threshold: 0.01 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, [lazy, lazyRootMargin, src]);

    return (
      <video
        ref={setRef}
        src={lazy ? undefined : src}
        data-src={lazy ? src : undefined}
        preload={lazy ? "none" : preload ?? "metadata"}
        className={className}
        playsInline
        {...props}
      />
    );
  }
);

export default OptimizedVideo;
