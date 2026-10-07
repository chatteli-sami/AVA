// ZoomablePlan.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/inventory.module.css";

interface ZoomablePlanProps {
  src: string;
  alt: string;
  blurDataURL?: string;
}

export default function ZoomablePlan({ src, alt, blurDataURL }: ZoomablePlanProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef({ startX: 0, startY: 0, moved: false });

  function clampScale(next: number) {
    return Math.max(1, Math.min(4, next));
  }

  function zoomAt(clientX: number, clientY: number, factor: number) {
    const next = clampScale(scale * factor);
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) {
      setScale(next);
      return;
    }
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const ratio = next / scale;
    setDragPos((prev) => ({
      x: cx - (cx - prev.x) * ratio,
      y: cy - (cy - prev.y) * ratio,
    }));
    setScale(next);
  }

  function onWheel(event: React.WheelEvent) {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.15 : 1 / 1.15;
    zoomAt(event.clientX, event.clientY, factor);
  }

  function onDoubleClick() {
    setScale(1);
    setDragPos({ x: 0, y: 0 });
    dragStartRef.current = { startX: 0, startY: 0, moved: false };
  }

  function onPointerDown(event: React.PointerEvent) {
    if (scale <= 1) return;
    event.preventDefault();
    setDragging(true);
    dragStartRef.current.startX = event.clientX - dragPos.x;
    dragStartRef.current.startY = event.clientY - dragPos.y;
    dragStartRef.current.moved = false;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent) {
    if (!dragging || scale <= 1) return;
    const nextX = event.clientX - dragStartRef.current.startX;
    const nextY = event.clientY - dragStartRef.current.startY;
    if (Math.abs(nextX - dragPos.x) > 3 || Math.abs(nextY - dragPos.y) > 3) {
      dragStartRef.current.moved = true;
    }
    setDragPos({ x: nextX, y: nextY });
  }

  function onPointerUp() {
    setDragging(false);
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        const { innerWidth, innerHeight } = window;
        zoomAt(innerWidth / 2, innerHeight / 2, 1.2);
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        const { innerWidth, innerHeight } = window;
        zoomAt(innerWidth / 2, innerHeight / 2, 1 / 1.2);
      } else if (event.key === "0" || event.key === "Home") {
        event.preventDefault();
        setScale(1);
        setDragPos({ x: 0, y: 0 });
        dragStartRef.current = { startX: 0, startY: 0, moved: false };
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale, dragPos]);

  return (
    <div
      ref={stageRef}
      className={styles.invLightboxMedia}
      onWheel={onWheel}
      onDoubleClick={onDoubleClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "default",
        touchAction: scale > 1 ? "none" : "pan-y",
      }}
    >
      <div
        style={{
          width: `${scale * 100}%`,
          height: `${scale * 100}%`,
          transform: `translate(${dragPos.x}px, ${dragPos.y}px)`,
          transformOrigin: "0 0",
        }}
      >
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 821px) 60vw, 92vw"
          style={{ objectFit: "contain" }}
          priority={false}
          loading="lazy"
          blurDataURL={blurDataURL}
        />
      </div>
      <span className={styles.invLightboxZoom}>
        {Math.round(scale * 100)}%
      </span>
    </div>
  );
}
