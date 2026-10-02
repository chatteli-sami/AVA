"use client";

import { useEffect, useState, type AnimationEvent, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import ScrollLink from "../ScrollLink";
import { navItems } from "./content";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuOrigin, setMenuOrigin] = useState({ x: "18px", y: "44px" });
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    if (!menuMounted) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setMenuMounted(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuMounted]);

  function closeMenu() {
    setMenuOpen(false);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  return (
    <header className={isHomePage ? "site-header" : "site-header site-header--interior"}>
      <div className="container header-container">
        <div className="logo">
          <img src="/images/logoava.avif" alt="Logo AVA Tunis" className="logo-avif" width={540} height={180} loading="eager" fetchPriority="high" />
        </div>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="fullscreen-menu"
          onClick={(event) => {
            if (menuOpen) {
              closeMenu();
              return;
            }

            const bounds = event.currentTarget.getBoundingClientRect();
            setMenuOrigin({
              x: `${bounds.left + bounds.width / 2}px`,
              y: `${bounds.top + bounds.height / 2}px`,
            });
            setMenuMounted(true);
            setMenuOpen(true);
          }}
        >
          <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars"}`} aria-hidden="true"></i>
        </button>
      </div>

      {menuMounted && (
        <div
          className={`fullscreen-menu ${menuOpen ? "is-open" : "is-closing"}`}
          id="fullscreen-menu"
          style={{
            "--menu-origin-x": menuOrigin.x,
            "--menu-origin-y": menuOrigin.y,
          } as CSSProperties}
          onAnimationEnd={handleMenuAnimationEnd}
          onClick={closeMenu}
        >
          <nav className="fullscreen-menu-content" aria-label="Navigation principale" onClick={(event) => event.stopPropagation()}>
            <p className="fullscreen-menu-kicker">Explorer AVA</p>
            <ul>
              {navItems.map((item, index) => (
                <li key={item.href} style={{ animationDelay: `${index * 100}ms` }}>
                  <ScrollLink
                    href={isHomePage ? item.href : `/${item.href}`}
                    behavior="smooth"
                    onNavigate={closeMenuImmediately}
                  >
                    <span className="fullscreen-menu-number">0{index + 1}</span>
                    <span>{item.label}</span>
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <a className="fullscreen-menu-email" href="mailto:commercial@promed.tn">
              commercial@promed.tn
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
