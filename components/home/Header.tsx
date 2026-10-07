"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type AnimationEvent, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import ScrollLink from "../ScrollLink";
import ThemeToggle from "../ThemeToggle";
import { lockPageScroll } from "../../lib/scroll-lock";
import { navItems } from "./content";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuOrigin, setMenuOrigin] = useState({ x: "18px", y: "44px" });
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // `prefers-reduced-motion` is read once, before the first effect, so there is no
  // synchronous setState on mount. The header is static once mounted; a mid-session
  // change of the system preference is not something the top bar needs to live-update.
  const [reducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Interior pages are always compact; on the home page the compact state is driven
  // by the video sentinel (see the observer below). Deriving the non-home case keeps
  // the route-change reset out of an effect body.
  const [compactFromScroll, setCompactFromScroll] = useState(() => {
    if (typeof window === "undefined" || !isHomePage) return false;
    const sentinel = document.getElementById("video-end-sentinel");
    if (!sentinel) return false;
    const compactCutoff = 120;
    return sentinel.getBoundingClientRect().top <= compactCutoff;
  });
  const isCompact = !isHomePage || compactFromScroll;
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    if (reducedMotion) {
      setMenuMounted(false);
    }
  }, [reducedMotion]);

  // Observe the sentinel at the end of the video section to flip between the
  // big white "over video" state and the compact dark state.
  useEffect(() => {
    if (!isHomePage) return undefined;

    const sentinel = document.getElementById("video-end-sentinel");
    if (!sentinel) return undefined;

    const compactCutoff = 120;

    // Re-base the scroll-derived compact flag when the route changes. Done in a
    // rAF callback so the read still happens before paint, but never as a
    // synchronous setState whose cascade the linter rightly flags.
    const frame = window.requestAnimationFrame(() => {
      setCompactFromScroll(sentinel.getBoundingClientRect().top <= compactCutoff);
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!menuOpen) {
          // Sentinel below the header line => video still ahead of us => big state.
          setCompactFromScroll(entry.boundingClientRect.top <= compactCutoff);
        }
      },
      { threshold: 0 }
    );
    observer.observe(sentinel);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [isHomePage, menuOpen]);

  // Scroll lock when menu is open
  useEffect(() => {
    if (!menuMounted) return undefined;

    const releaseScroll = lockPageScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      releaseScroll();
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, menuMounted]);

  // Focus trap - return focus to menu button when menu closes
  useEffect(() => {
    if (!menuOpen && !menuMounted) {
      menuButtonRef.current?.focus();
    }
  }, [menuOpen, menuMounted]);

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
            <Image
              src="/images/logoava.avif"
              alt="AVA Tunis"
              width={540}
              height={180}
              sizes="(max-width: 768px) 220px, 300px"
              priority
            />
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
            <div className="fullscreen-menu-appearance">
              <span>Apparence</span>
              <ThemeToggle />
            </div>
          </nav>
        </div>,
        document.body
      )}
    </>
  );
}