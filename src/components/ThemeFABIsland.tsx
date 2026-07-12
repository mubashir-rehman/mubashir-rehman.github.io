/**
 * ThemeFABIsland.tsx
 *
 * Standalone floating action button for theme toggling on mobile,
 * for use in Astro pages. Does NOT depend on ThemeProvider.
 * Stacked above AskMe button (same positioning as original ThemeFAB).
 *
 * Toggle: light ↔ dark
 */

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";
const THEMES: Theme[] = ["light", "dark"];

function normalize(value: string | null): Theme {
  return value === "dark" ? "dark" : "light";
}

function nextTheme(current: Theme): Theme {
  return current === "light" ? "dark" : "light";
}

function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "light" ? <Moon size={16} /> : <Sun size={16} />;
}

export default function ThemeFABIsland() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(normalize(localStorage.getItem("theme")));
    const handler = (e: Event) => {
      setTheme((e as CustomEvent<{ theme: Theme }>).detail.theme);
    };
    window.addEventListener("themechange", handler);
    return () => window.removeEventListener("themechange", handler);
  }, []);

  const handleClick = () => {
    const next = nextTheme(theme);
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.remove(...THEMES);
    document.documentElement.classList.add(next);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  };

  return (
    <button
      onClick={handleClick}
      aria-label={`Switch to ${nextTheme(theme)} theme`}
      data-testid="button-toggle-theme"
      className={[
        "fixed right-4 z-50",
        // Stacked above AskMe button
        "bottom-[9.5rem] sm:hidden",
        "flex h-10 w-10 items-center justify-center rounded-full",
        "bg-[hsl(var(--m3-surface-highest))] text-[hsl(var(--primary))]",
        "shadow-md shadow-black/10",
        "border border-[hsl(var(--m3-outline-var))]",
        "transition-colors active:bg-[hsl(var(--m3-primary-container))]",
      ].join(" ")}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}
