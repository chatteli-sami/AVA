"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import styles from "./IntroSection.module.css";

type BuildingImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type { BuildingImage };

type AnimatedBuildingProps = {
  image: BuildingImage;
};

const HOVER_TILT_MAX = 6;

export default function AnimatedBuilding({ image }: AnimatedBuildingProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const wrap = wrapRef.current;
      if (!wrap || reduced) return;
      const rect = wrap.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * HOVER_TILT_MAX;
      const tiltY = (0.5 - x) * HOVER_TILT_MAX;
      wrap.style.setProperty("--tilt-x", `${tiltX}deg`);
      wrap.style.setProperty("--tilt-y", `${tiltY}deg`);
    },
    [reduced],
  );

  const handlePointerLeave = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduced) return;
    wrap.style.setProperty("--tilt-x", "0deg");
    wrap.style.setProperty("--tilt-y", "0deg");
  }, [reduced]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduced) return;
    wrap.addEventListener("pointermove", handlePointerMove);
    wrap.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      wrap.removeEventListener("pointermove", handlePointerMove);
      wrap.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave, reduced]);

  const wrapperStyle = reduced
    ? undefined
    : { "--tilt-x": "0deg", "--tilt-y": "0deg" };

  return (
    <div className={styles.buildingScene}>
      <div className={styles.buildingWrapper}>
        <div
          ref={wrapRef}
          className={styles.buildingImageWrap}
          style={wrapperStyle as CSSProperties}
        >
          <Image
            className={styles.buildingImage}
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            priority={false}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
          />
        </div>
      </div>
    </div>
  );
}