"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 120;
const PRELOAD_BATCH_SIZE = 10;

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = new Array(FRAME_COUNT);

    const loadImages = async () => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        // The images are named frame_000.webp through frame_119.webp
        const indexStr = i.toString().padStart(3, "0");
        img.src = `/sequence/frame_${indexStr}.webp`;

        await new Promise((resolve) => {
          img.onload = () => {
            loadedImages[i] = img;
            loadedCount++;
            setLoadProgress((loadedCount / FRAME_COUNT) * 100);
            resolve(null);
          };
          img.onerror = () => {
            // Handle error, maybe fallback
            loadedImages[i] = img; // We still assign it to avoid holes
            loadedCount++;
            resolve(null);
          };
        });
      }

      setImages(loadedImages);
      setIsLoaded(true);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!isLoaded || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let currentDrawnIndex = -1;

    const render = () => {
      const targetIndex = Math.round(frameIndex.get());
      
      // Only draw if the index changed
      if (targetIndex !== currentDrawnIndex && images[targetIndex] && images[targetIndex].complete) {
        const img = images[targetIndex];
        
        // Handle object-fit: cover logic
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        
        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
          // Canvas is wider than image
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          drawX = 0;
          drawY = (canvas.height - drawHeight) / 2;
        } else {
          // Canvas is taller than image
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          drawY = 0;
          drawX = (canvas.width - drawWidth) / 2;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw image
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        currentDrawnIndex = targetIndex;
      }
      
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, images, frameIndex]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        // We set internal resolution higher
        canvasRef.current.width = window.innerWidth * dpr;
        canvasRef.current.height = window.innerHeight * dpr;
        // But CSS size is the same
        canvasRef.current.style.width = `${window.innerWidth}px`;
        canvasRef.current.style.height = `${window.innerHeight}px`;
        
        // Force a re-render
        if (isLoaded) {
           // update frame trigger
           frameIndex.set(frameIndex.get() + 0.0001);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // init

    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, frameIndex]);

  return (
    <>
      {!isLoaded && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212]">
          <div className="text-white text-xl font-light tracking-widest mb-4">LOADING</div>
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out" 
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      <div id="home" ref={containerRef} className="relative h-[500vh] w-full bg-[#121212] scroll-mt-24">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
          />
          <div className="absolute inset-0 z-10 bg-black/40" />
          <Overlay scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </>
  );
}
