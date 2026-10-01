"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ScrollVideoProps = {
  src: string;
  scrollHeight?: string;
  smoothness?: number;
  className?: string;
  poster?: string;
  children?: ReactNode;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export default function ScrollVideo({
  src,
  scrollHeight = "400vh",
  smoothness = 0.1,
  className,
  poster = "/video/tour-scrub-poster.jpg",
  children,
}: ScrollVideoProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const smoothedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const unlockedRef = useRef(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;

    if (!wrapper || !video) {
      return undefined;
    }

    const lowerBound = clamp(smoothness, 0.08, 0.12);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const unlockVideo = async () => {
      if (unlockedRef.current || !video) return;
      unlockedRef.current = true;

      try {
        video.muted = true;
        await video.play();
      } catch {
        // iOS Safari sometimes blocks the first play(); the call is still enough to unlock media.
      }

      video.pause();
    };

    const handleMetadata = () => {
      if (mediaQuery.matches) {
        video.currentTime = 0;
        video.pause();
        return;
      }

      if (video.readyState >= 1) {
        void unlockVideo();
      }
    };

    const tick = () => {
      const rect = wrapper.getBoundingClientRect();
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = clamp((window.innerHeight - rect.top) / travel, 0, 1);

      wrapper.style.setProperty("--scroll-progress", progress.toFixed(4));

      if (mediaQuery.matches) {
        if (video.currentTime !== 0) {
          video.currentTime = 0;
          lastTimeRef.current = 0;
          smoothedRef.current = 0;
        }

        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      if (duration > 0) {
        const targetTime = progress * duration;
        const lerped = smoothedRef.current + (targetTime - smoothedRef.current) * lowerBound;
        smoothedRef.current = lerped;

        const delta = Math.abs(lerped - lastTimeRef.current);
        if (delta > 0.01) {
          const nextTime = clamp(lerped, 0, duration);

          if ("fastSeek" in video && typeof video.fastSeek === "function") {
            video.fastSeek(nextTime);
          } else {
            video.currentTime = nextTime;
          }

          lastTimeRef.current = nextTime;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", handleMetadata, { once: true });
    document.addEventListener("pointerdown", unlockVideo, { passive: true, once: true });
    document.addEventListener("touchstart", unlockVideo, { passive: true, once: true });
    document.addEventListener("keydown", unlockVideo, { once: true });

    if (video.readyState >= 1) {
      handleMetadata();
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      video.removeEventListener("loadedmetadata", handleMetadata);
      document.removeEventListener("pointerdown", unlockVideo);
      document.removeEventListener("touchstart", unlockVideo);
      document.removeEventListener("keydown", unlockVideo);
    };
  }, [smoothness]);

  return (
    <div
      ref={wrapperRef}
      className={className ? `scroll-video-shell ${className}` : "scroll-video-shell"}
      style={{ height: scrollHeight }}
    >
      <div className="scroll-video-sticky">
        <video
          ref={videoRef}
          className="scroll-video-media"
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          controls={false}
          autoPlay={false}
        />

        {children ? <div className="scroll-video-overlay">{children}</div> : null}
      </div>
    </div>
  );
}
