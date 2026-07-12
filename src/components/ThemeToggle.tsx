/**
 * ThemeToggle.tsx
 *
 * Standalone React island for the theme-toggle button used in the Astro Navbar.
 * Does NOT depend on ThemeProvider — reads/writes localStorage directly and
 * dispatches a custom "themechange" event so other islands can react.
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

/** Shows the icon for the NEXT theme */
function ThemeIcon({ theme }: { theme: Theme }) {
  return theme === "light" ? <Moon size={18} /> : <Sun size={18} />;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Sync with whatever the FOUC script applied
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
    const root = document.documentElement;
    root.classList.remove(...THEMES);
    root.classList.add(next);
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
  };

  return (
    <button
      onClick={handleClick}
      data-testid="button-toggle-theme"
      aria-label={`Switch to ${nextTheme(theme)} theme`}
      className="ml-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}
