"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { BuildingImage } from "./AnimatedBuilding";
import styles from "./IntroSection.module.css";

type FlyingHummingbirdProps = {
  image: BuildingImage;
};

export default function FlyingHummingbird({ image }: FlyingHummingbirdProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Track scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Flight path: starts top-right, flies along gentle curve
  const flightProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const birdX = useTransform(flightProgress, [0, 0.5, 1], ["85%", "50%", "15%"]);

  const birdY = useTransform(
    flightProgress,
    [0, 0.3, 0.5, 0.7, 1],
    ["15%", "8%", "12%", "10%", "18%"]
  );

  const birdRotate = useTransform(flightProgress, [0, 0.5, 1], [5, 0, -5]);

  const birdFloatY = useTransform(flightProgress, [0, 0.5, 1], [0, -4, 0]);

  const birdScale = useTransform(flightProgress, [0, 1], [0.4, 0.6]);

  // Bird opacity: starts at 0.25, fades out near bottom
  const birdOpacity = useTransform(
    flightProgress,
    [0, 0.1, 0.6, 0.8],
    [0.25, 0.32, 0.18, 0]
  );

  // On reduced motion, skip all animation and stay subtle
  const birdStyle = reduced
    ? {
        opacity: 0.22,
        transform: "scale(0.45)",
        left: "85%",
        top: "15%",
      }
    : {
        left: birdX,
        top: birdY,
        transform: `scale(${birdScale}) rotate(${birdRotate}deg) translateY(${birdFloatY}px)`,
        opacity: birdOpacity,
      };

  // Reset inline styles on unmount for reduced motion
  useEffect(() => {
    if (reduced) {
      const bird = birdRef.current;
      if (bird) {
        bird.style.removeProperty("transform");
        bird.style.removeProperty("opacity");
      }
    }
  }, [reduced]);

  return (
    <div
      ref={sectionRef}
      className={styles.hummingbirdSection}
      aria-hidden="true"
    >
      <motion.div
        ref={birdRef}
        className={`${styles.hummingbird} ${reduced ? styles.hummingbirdReduced : ""}`}
        style={{
          ...birdStyle,
          willChange: "transform, opacity",
        }}
        onPointerMoveCapture={(e) => e.preventDefault()}
        onTouchMoveCapture={(e) => e.preventDefault()}
        onClick={(e) => e.preventDefault()}
      >
        <img
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          loading="eager"
        />
      </motion.div>
    </div>
  );
}
