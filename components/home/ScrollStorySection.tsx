import type { CSSProperties, ReactNode } from "react";
import ScrollVideo from "../ScrollVideo";

type FadeStyle = CSSProperties & {
  "--fade-start": string;
  "--fade-end": string;
};

type FadeOverlayProps = {
  className: string;
  start: string;
  end: string;
  children: ReactNode;
};

function FadeOverlay({ className, start, end, children }: FadeOverlayProps) {
  const overlayStyle = {
    "--fade-start": start,
    "--fade-end": end,
  } as FadeStyle;

  return (
    <div
      className={`scroll-overlay ${className}`}
      style={overlayStyle}
    >
      {children}
    </div>
  );
}

export default function ScrollStorySection() {
  return (
    <section className="scroll-story-demo" aria-label="Visite immersive AVA">
      <ScrollVideo
        src="/video/tour-scrub.mp4"
        poster="/images/logoava.avif"
        scrollHeight="420vh"
        className="story-video"
      >
        <FadeOverlay className="copy-left" start="0.08" end="0.36">
          <span className="eyebrow">Immersion AVA</span>
          <h2>Un art de vivre pensé pour les moments qui comptent.</h2>
        </FadeOverlay>

        <FadeOverlay className="copy-right" start="0.28" end="0.6">
          <p>Espaces lumineux, finitions premium et vues dignes d’une villa contemporaine.</p>
        </FadeOverlay>

        <FadeOverlay className="copy-bottom" start="0.52" end="0.8">
          <span>Réservez votre visite</span>
        </FadeOverlay>
      </ScrollVideo>
    </section>
  );
}
