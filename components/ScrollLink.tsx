"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import styles from "../styles/scroll-link.module.css";
import { scrollToAnchor, storePendingAnchor, type AnchorScrollBehavior } from "../lib/anchor-navigation";

export interface ScrollLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> {
  href: string;
  children: ReactNode;
  offset?: number;
  behavior?: AnchorScrollBehavior;
  onNavigate?: () => void;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
}

export default function ScrollLink({
  href,
  children,
  className,
  offset = 0,
  behavior = "smooth",
  onNavigate,
  onClick,
  ...anchorProps
}: ScrollLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (!url.hash) {
      onNavigate?.();
      return;
    }

    const id = decodeURIComponent(url.hash.slice(1));
    const isSamePage = normalizePath(url.pathname) === normalizePath(pathname);

    if (isSamePage && document.getElementById(id)) {
      event.preventDefault();
      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      scrollToAnchor(id, { offset, behavior });
      onNavigate?.();
      return;
    }

    storePendingAnchor({ pathname: url.pathname, id, offset, behavior });
    onNavigate?.();
  }

  const combinedClassName = [styles.link, className].filter(Boolean).join(" ");

  return (
    <Link
      {...anchorProps}
      href={href}
      className={combinedClassName}
      scroll={!href.includes("#")}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
