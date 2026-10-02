"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { galleryProjects } from "../../data/gallery";
import { consumeGalleryReturn, rememberGalleryScroll } from "../../lib/gallery-scroll";
import { scrollToAnchor } from "../../lib/anchor-navigation";

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

    // The document is still settling when this mounts, so a single scroll gets
    // clamped against a shorter page. Re-apply across the first few frames.
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
    <section className="gallery" id="gallery">
      <div className="container">
        <div className="section-header">
          <h2>Galerie</h2>
          <div className="gold-line" />
          <p className="section-subtitle">
            Une sélection de projets d’intérieur et d’architecture livrés entre Tunis et les Jardins de Carthage.
          </p>
        </div>

        <div className="gallery-grid">
          {galleryProjects.map((project, index) => (
            <article className="gallery-card" key={project.slug}>
              <Link
                href={`/gallery/${project.slug}`}
                className="gallery-card-link"
                aria-label={`${project.title} — voir le projet`}
                onClick={rememberGalleryScroll}
              >
                <span className="gallery-card-media">
                  <Image
                    className="gallery-card-image"
                    src={project.cover}
                    alt={project.summary}
                    fill
                    sizes="(min-width: 900px) 46vw, 100vw"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </span>

                <span className="gallery-card-text">
                  <span className="gallery-card-meta">
                    {project.category} • {project.year}
                  </span>
                  <span className="gallery-card-title">{project.title}</span>
                  <span className="gallery-card-area">{project.area}</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}