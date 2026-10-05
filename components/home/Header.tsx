"use client";

import { useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import ScrollLink from "../ScrollLink";
import { navItems } from "./content";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuOrigin, setMenuOrigin] = useState({ x: "18px", y: "44px" });
  const [isCompact, setIsCompact] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Check reduced motion preference on mount
  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Compute the initial state on mount, before the first scroll.
  // Interior pages are always compact; on the home page the big white state
  // only applies while the video (and its trailing sentinel) is still below
  // the fold. A page restored mid-video must not flash the compact state.
  useEffect(() => {
    if (!isHomePage) {
      setIsCompact(true);
      return;
    }

    const sentinel = document.getElementById("video-end-sentinel");
    if (!sentinel) return;

    // Compact once the sentinel's top has passed above the header line.
    const compactCutoff = 120;
    const isInitiallyCompact = sentinel.getBoundingClientRect().top <= compactCutoff;
    setIsCompact(isInitiallyCompact);
  }, [isHomePage]);

  // Observe the sentinel at the end of the video section to flip between the
  // big white "over video" state and the compact dark state.
  useEffect(() => {
    if (!isHomePage) return undefined;

    const sentinel = document.getElementById("video-end-sentinel");
    if (!sentinel) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!menuOpen) {
          // Sentinel below the header line => video still ahead of us => big state.
          setIsCompact(entry.boundingClientRect.top <= 120);
        }
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHomePage, menuOpen]);

  // Scroll lock when menu is open
  useEffect(() => {
    if (!menuMounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.paddingRight = "";
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuMounted]);

  // Focus trap - return focus to menu button when menu closes
  useEffect(() => {
    if (!menuOpen && !menuMounted) {
      menuButtonRef.current?.focus();
    }
  }, [menuOpen, menuMounted]);

  function closeMenu() {
    setMenuOpen(false);
    if (reducedMotion) {
      setMenuMounted(false);
    }
  }

  function closeMenuImmediately() {
    setMenuOpen(false);
    setMenuMounted(false);
  }

  function handleMenuAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (
      event.target === event.currentTarget &&
      event.animationName === "menu-circle-close" &&
      !menuOpen
    ) {
      setMenuMounted(false);
    }
  }

  function handleOpenMenu(event: React.MouseEvent<HTMLButtonElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setMenuOrigin({
      x: `${bounds.left + bounds.width / 2}px`,
      y: `${bounds.top + bounds.height / 2}px`,
    });
    setMenuMounted(true);
    setMenuOpen(true);
  }

  return (
    <>
      <header
        className={`site-header ${isHomePage ? "site-header--home" : "site-header--interior"} ${isCompact ? "site-header--scrolled" : ""} ${menuOpen ? "site-header--menu-open" : ""}`}
        aria-label="Navigation principale"
      >
        <div className="hero-gradient" aria-hidden="true"></div>
        <div className="header-grid">
          <button
            type="button"
            ref={menuButtonRef}
            className={`menu-toggle ${menuOpen ? "menu-toggle--open" : ""}`}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            aria-controls="fullscreen-menu"
            onClick={menuOpen ? closeMenu : handleOpenMenu}
          >
            <span className="menu-toggle-icon">
              <span className="menu-line"></span>
              <span className="menu-line"></span>
              <span className="menu-line"></span>
            </span>
          </button>
          <div className={`logo ${isCompact ? "logo--compact" : ""}`}>
            <img src="/images/logoava.avif" alt="AVA Tunis" width={540} height={180} loading="eager" fetchPriority="high" />
          </div>
          <div className="header-right" />
        </div>
      </header>

      {menuMounted && createPortal(
        <div
          className={`fullscreen-menu ${menuOpen ? "is-open" : "is-closing"}`}
          id="fullscreen-menu"
          role="dialog"
          aria-hidden={!menuOpen}
          aria-label="Menu de navigation"
          style={{
            "--menu-origin-x": menuOrigin.x,
            "--menu-origin-y": menuOrigin.y,
          } as CSSProperties}
          onAnimationEnd={handleMenuAnimationEnd}
          onClick={closeMenu}
        >
          <button
            type="button"
            className="menu-close-btn"
            aria-label="Fermer le menu"
            onClick={closeMenu}
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
          <nav className="fullscreen-menu-content" aria-label="Navigation principale" onClick={(event) => event.stopPropagation()}>
            <ul>
              {navItems.map((item, index) => (
                <li key={item.href} style={{ animationDelay: `${index * 60}ms` }}>
                  <ScrollLink
                    href={isHomePage ? item.href : `/${item.href}`}
                    behavior="smooth"
                    onNavigate={closeMenuImmediately}
                  >
                    <span className="fullscreen-menu-number">0{index + 1}</span>
                    <span>{item.label}</span>
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <a className="fullscreen-menu-email" href="mailto:commercial@promed.tn">
              commercial@promed.tn
            </a>
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}