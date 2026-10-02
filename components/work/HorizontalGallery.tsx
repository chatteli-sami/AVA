"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  type MotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import type { GalleryProject } from "../../types/gallery";
import styles from "../../styles/work.module.css";

interface FrameProps {
  src: string;
  title: string;
  index: number;
  reduced: boolean;
  scrollYProgress: MotionValue<number>;
  slot: number;
  filter: MotionValue<string>;
  skewX: MotionValue<number>;
}

function Frame({ src, title, index, reduced, scrollYProgress, slot, filter, skewX }: FrameProps) {
  const start = Math.max(0, index * slot - slot * 0.5);
  const end = Math.min(1, start + slot * 2);
  const imageX = useTransform(scrollYProgress, [start, end], ["5%", "-5%"]);
  const scale = useTransform(scrollYProgress, [start, (start + end) / 2, end], [1, 1.08, 1]);

  return (
    <motion.figure className={styles.hFrame} style={reduced ? undefined : { filter, skewX }}>
      <motion.div className={styles.hFrameInner} style={reduced ? undefined : { x: imageX, scale }}>
        <Image
          className={styles.hImage}
          src={src}
          alt={`${title} — vue ${index + 1}`}
          fill
          sizes="(min-width: 900px) 68vw, 88vw"
        />
      </motion.div>
    </motion.figure>
  );
}

export default function HorizontalGallery({ project }: { project: GalleryProject }) {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // The track is `width: max-content`, so the travel distance is only known once
  // measured. A percentage on `x` resolves against the track's own width, which
  // overshoots whenever the track is wider than the viewport.
  useEffect(() => {
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    const measure = () => {
      setDistance(Math.max(0, track.scrollWidth - sticky.clientWidth));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(sticky);
    return () => observer.disconnect();
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  const velocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const blur = useTransform(smoothVelocity, [-2, 0, 2], [6, 0, 6], { clamp: true });
  const skewX = useTransform(smoothVelocity, [-2, 0, 2], [-2, 0, 2], { clamp: true });
  const blurFilter = useTransform(blur, (value) => `blur(${value.toFixed(2)}px)`);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0], { clamp: true });

  const frameCount = project.images.length;
  const slot = 1 / Math.max(frameCount - 1, 1);

  return (
    <div
      ref={sectionRef}
      className={reduced ? `${styles.hScroll} ${styles.hScrollReduced}` : styles.hScroll}
      style={reduced ? undefined : { height: `${frameCount * 90}vh` }}
    >
      <div ref={stickyRef} className={reduced ? `${styles.hSticky} ${styles.hStickyReduced}` : styles.hSticky}>
        <motion.div ref={trackRef} className={styles.hTrack} style={reduced ? undefined : { x }}>
          {project.images.map((src, index) => (
            <Frame
              key={`${src}-${index}`}
              src={src}
              title={project.title}
              index={index}
              reduced={reduced}
              scrollYProgress={scrollYProgress}
              slot={slot}
              filter={blurFilter}
              skewX={skewX}
            />
          ))}
        </motion.div>

        <motion.p
          className={styles.hHint}
          style={reduced ? { opacity: 0 } : { opacity: hintOpacity }}
          aria-hidden="true"
        >
          Scroll to explore
        </motion.p>
      </div>
    </div>
  );
}