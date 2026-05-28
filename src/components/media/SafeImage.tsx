"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface SafeImageProps extends ImageProps {
  fallbackClassName?: string;
}

export default function SafeImage({
  fallbackClassName = "bg-[#0d0d0d]",
  onError,
  alt,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !props.src) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center text-white/25 text-xs font-light ${fallbackClassName}`}
        role="img"
        aria-label={typeof alt === "string" ? alt : "Image unavailable"}
      >
        Preview unavailable
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
    />
  );
}
