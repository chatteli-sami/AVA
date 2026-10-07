"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribeToTheme(onChange: () => void): () => void {
  const onThemeChange = () => onChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key !== "ava-theme" && event.key !== null) return;
    const preference = event.newValue;
    const nextTheme =
      preference === "light" || preference === "dark"
        ? preference
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = nextTheme;
    onChange();
  };
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemThemeChange = () => {
    try {
      if (window.localStorage.getItem("ava-theme")) return;
    } catch (error) {
      console.error("Unable to read the saved color theme.", error);
    }
    document.documentElement.dataset.theme = media.matches ? "dark" : "light";
    onChange();
  };

  window.addEventListener("ava-theme-change", onThemeChange);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", onSystemThemeChange);
  return () => {
    window.removeEventListener("ava-theme-change", onThemeChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", onSystemThemeChange);
  };
}

function getServerTheme(): Theme {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new Event("ava-theme-change"));
    try {
      window.localStorage.setItem("ava-theme", nextTheme);
    } catch (error) {
      console.error("Unable to save the selected color theme.", error);
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Activer le thème ${isDark ? "clair" : "sombre"}`}
      aria-pressed={isDark}
      title={`Thème ${isDark ? "sombre" : "clair"}`}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z" />
        </svg>
      )}
    </button>
  );
}
