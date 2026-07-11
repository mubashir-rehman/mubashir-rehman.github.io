import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

// Icon on toggle button shows what theme you'll GO TO next
function ThemeIcon({ theme }: { theme: "dark" | "light" }) {
  return theme === "light" ? <Moon size={18} /> : <Sun size={18} />;
}

export default function Navbar() {
  const { theme, cycleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useMobile();

  // Mobile uses bottom nav + per-page headers — no top navbar needed
  if (isMobile) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl shadow-sm">

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink
          to="/"
          className="font-heading text-xl font-bold text-primary"
          data-testid="link-home-logo"
        >
          MR<span className="text-foreground">.</span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) =>
            l.to === "/" ? (
              // Home is now a static Astro page — use a hard navigation link
              <a
                key="/"
                href="/"
                className="relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </a>
            ) : (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {l.label}
              {location.pathname === l.to && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary"
                />
              )}
            </NavLink>
            )
          )}
          <button
            onClick={cycleTheme}
            data-testid="button-toggle-theme"
            className="ml-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cycle theme"
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>

        {/* Mobile: theme toggle hidden — ThemeFAB handles it */}
        <div className="flex items-center gap-2 md:hidden">
          {/* intentionally empty — theme toggle is the FAB */}
        </div>
      </div>
    </nav>
  );
}
