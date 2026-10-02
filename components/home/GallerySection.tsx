"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { galleryProjects } from "../../data/gallery";
import type { GalleryProject } from "../../types/gallery";
import { scrollToAnchor } from "../../lib/anchor-navigation";
import { consumeGalleryReturn, isGalleryReturnPending, rememberGalleryScroll } from "../../lib/gallery-scroll";
import { isCoverTransitionBusy, openCover, preloadCover, reportGalleryRect } from "../../lib/cover-transition";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

const RIGHT_COLUMN_RISE = "60px";
const LEFT_COLUMN_RISE = "40px";
const RIGHT_COLUMN_DELAY = "100ms";

/** Long enough to outlast the gallery's own scroll restore, which re-applies for ~1.5s. */
const RETURN_REPORT_FRAMES = 100;

type RevealStyle = CSSProperties & {
  "--gallery-rise": string;
  "--gallery-delay": string;
};

function rectOf(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

function GalleryCard({ project, index }: { project: GalleryProject; index: number }) {
  const reduced = usePrefersReducedMotion();
  const { ref: revealRef, revealed } = useRevealOnScroll<HTMLElement>({ threshold: 0.2 });
  const cardRef = useRef<HTMLElement | null>(null);

  // One node, two owners: the reveal observer and the return-position report.
  const attachCard = useCallback(
    (node: HTMLElement | null) => {
      revealRef.current = node;
      cardRef.current = node;
    },
    [revealRef],
  );

  // The right column starts a little lower and later, for a parallax feel.
  const isRightColumn = index % 2 === 1;

  const style: RevealStyle = {
    "--gallery-rise": isRightColumn ? RIGHT_COLUMN_RISE : LEFT_COLUMN_RISE,
    "--gallery-delay": isRightColumn ? RIGHT_COLUMN_DELAY : "0ms",
  };

  const className = revealed || reduced ? "gallery-card is-revealed" : "gallery-card";

  // Returning from a project: publish this card's resting box so the overlay can
  // shrink onto it. The gallery restores its scroll offset over several frames,
  // so the position is republished until it settles.
  useEffect(() => {
    if (!isGalleryReturnPending()) return undefined;
    const card = cardRef.current;
    if (!card) return undefined;

    let frame = 0;
    let attempts = 0;
    const publish = () => {
      const media = card.querySelector<HTMLElement>(".gallery-card-media");
      if (media) reportGalleryRect(project.slug, rectOf(media));
    };
    const tick = () => {
      publish();
      attempts += 1;
      if (attempts < RETURN_REPORT_FRAMES) frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [project.slug]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    // A second click mid-animation must not start a competing navigation.
    if (isCoverTransitionBusy()) {
      event.preventDefault();
      return;
    }

    const media = event.currentTarget.querySelector<HTMLElement>(".gallery-card-media");
    const image = media?.querySelector<HTMLImageElement>("img");
    if (!media || !image) return;

    event.preventDefault();
    rememberGalleryScroll();
    preloadCover(project.cover);

    openCover({
      href: `/gallery/${project.slug}`,
      slug: project.slug,
      // The optimised URL the card is already painting, so no second request.
      src: image.currentSrc || project.cover,
      preloadSrc: project.cover,
      alt: image.alt,
      from: rectOf(media),
      reduced,
    });

    event.currentTarget.closest<HTMLElement>(".gallery-card")?.setAttribute("data-cover-source", "true");
  };

  return (
    <article ref={attachCard} className={className} style={style}>
      <Link
        href={`/gallery/${project.slug}`}
        className="gallery-card-link"
        aria-label={`${project.title} — voir le projet`}
        onClick={handleClick}
      >
        <span className="gallery-card-tags">{project.meta.join("  •  ")}</span>

        <h3 className="gallery-card-title">{project.title}</h3>

        <span className="gallery-card-media">
          <Image
            className="gallery-card-image"
            src={project.cover}
            alt={`${project.title} — ${project.summary}`}
            fill
            sizes="(min-width: 761px) 42vw, 88vw"
            loading={index < 2 ? "eager" : "lazy"}
          />
        </span>

        <span className="gallery-card-meta">
          {project.location} • {project.year} • {project.area}
        </span>
      </Link>
    </article>
  );
}

export default function GallerySection() {
  // Returning from a project detail page: restore the exact list offset, or fall
  // back to the section itself when the visitor arrived here without one.
  useEffect(() => {
    const pending = consumeGalleryReturn();
    if (!pending) return;

    if (pending.scrollY === null) {
      scrollToAnchor("gallery", { behavior: "instant" });
      return;
    }

    const target = pending.scrollY;
    const apply = () => window.scrollTo({ top: target, behavior: "instant" });

    // Scroll anchoring pins the viewport while late-loading images above resize
    // the document, which drags the restored offset off target.
    const previousAnchor = document.body.style.overflowAnchor;
    document.body.style.overflowAnchor = "none";

    let frame = window.requestAnimationFrame(() => {
      apply();
      frame = window.requestAnimationFrame(apply);
    });
    const timers = [
      window.setTimeout(apply, 400),
      window.setTimeout(apply, 1200),
      window.setTimeout(() => {
        document.body.style.overflowAnchor = previousAnchor;
      }, 1500),
    ];

    return () => {
      window.cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.body.style.overflowAnchor = previousAnchor;
    };
  }, []);

  return (
    <section className="gallery" id="gallery" aria-labelledby="gallery-heading">
      <div className="gallery-inner">
        <header className="gallery-header">
          <p className="gallery-kicker">Nos réalisations</p>
          <h2 id="gallery-heading">Galerie</h2>
          <p className="gallery-intro">
            Une sélection de projets d’intérieur et d’architecture livrés entre Tunis et les Jardins de Carthage.
          </p>
        </header>

        <div className="gallery-grid">
          {galleryProjects.map((project, index) => (
            <GalleryCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
