"use client";

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { type Unit, type UnitType } from "../data/inventory";
import Link from "next/link";
import { lockPageScroll } from "../lib/scroll-lock";
import styles from "../styles/inventory.module.css";

interface ZoomablePlanProps {
  src: string;
  alt: string;
  blurDataURL?: string;
}

const ZoomablePlan = lazy(() => import("./ZoomablePlan") as Promise<{ default: React.ComponentType<ZoomablePlanProps> }>);

export interface PlanLightboxProps {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
  contactHref?: string;
}

const TYPE_LABELS: Record<UnitType, string> = {
  duplex: "Duplex",
  s3: "S+3",
  s45: "S+4.5",
};

export default function PlanLightbox({
  open,
  unit,
  onClose,
  contactHref = "/#contact",
}: PlanLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const releaseScroll = lockPageScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          document.querySelectorAll<HTMLElement>(
            `.${styles.invLightboxInner} a[href], .${styles.invLightboxInner} button:not([disabled]), .${styles.invLightboxInner} [tabindex]:not([tabindex="-1"])`,
          ),
        );
        if (focusable.length === 0) {
          event.preventDefault();
          closeRef.current?.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      releaseScroll();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const frame = window.requestAnimationFrame(() => {
      closeRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (open) return;
    const previous = previousFocusRef.current;
    const frame = window.requestAnimationFrame(() => {
      previous?.focus?.({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  if (!open || !unit) return null;

  const typeLabel = TYPE_LABELS[unit.type] ?? unit.type;

  return createPortal(
    <div
      className={styles.invLightbox}
      role="dialog"
      aria-modal="true"
      aria-label={`Plan de l'unité ${unit.ref}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.invLightboxInner}>
        <Suspense
          fallback={
            <div className={styles.invLightboxMedia}>
              <span className={styles.invLightboxZoom}>Chargement…</span>
            </div>
          }
        >
          <ZoomablePlan src={unit.planSrc} alt={`Plan de l'unité ${unit.ref}`} blurDataURL={unit.planBlur} />
        </Suspense>

        <div className={styles.invLightboxInfo}>
          <div className={styles.invCardRef}>{unit.ref}</div>
          <div className={styles.invCardType}>{typeLabel}</div>

          <div className={styles.invLightboxDetails}>
            <div className={styles.invCardField}>
              <span className={styles.invCardFieldK}>Surface</span>
              <span className={styles.invCardFieldV}>{unit.surface} m²</span>
            </div>
            <div className={styles.invCardField}>
              <span className={styles.invCardFieldK}>Chambres</span>
              <span className={styles.invCardFieldV}>{unit.bedrooms}</span>
            </div>
            <div className={styles.invCardField}>
              <span className={styles.invCardFieldK}>Piscine</span>
              <span className={styles.invCardFieldV}>
                {unit.pool ? "Piscine privative" : "Sans piscine"}
              </span>
            </div>
          </div>

          <div className={styles.invLightboxActions}>
            {unit.planPdf && (
              <a className={styles.invBtn} href={unit.planPdf} download>
                <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Télécharger le plan (PDF)
              </a>
            )}
            <Link className={styles.invBtn} href={contactHref}>
              <svg viewBox="0 0 24 24" fill="none" width="16" height="16" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 01-8.62 8.5 8.5 8.5 0 01-3.12-.6l-4.3 1.6 1.6-4.3A8.5 8.5 0 014 11.5 8.38 8.38 0 0112 3 8.38 8.38 0 0121 11.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Demander des informations
            </Link>
          </div>
        </div>

        <button
          ref={closeRef}
          type="button"
          className={styles.invLightboxClose}
          aria-label="Fermer le plan"
          onClick={onClose}
        >
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>,
    document.body,
  );
}
