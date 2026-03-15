import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Flower2 } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/hobbies", label: "Hobbies" },
  { to: "/habits", label: "Habits" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
];

// 5-petal cherry blossom rendered in SVG — used in the navbar floral strip
function BlossomFlower({
  x, y, scale = 1, opacity = 0.18,
}: {
  x: number; y: number; scale?: number; opacity?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-11"
          rx="5.5"
          ry="10"
          fill="#E8679A"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="3.5" fill="#FFF0F5" />
      <circle cx="0" cy="0" r="1.5" fill="#F2A0B8" />
    </g>
  );
}

// Icon on toggle button shows what theme you'll GO TO next
function ThemeIcon({ theme }: { theme: "dark" | "light" | "sakura" }) {
  if (theme === "sakura") return <Moon size={18} />;
  if (theme === "dark")   return <Sun size={18} />;
  return <Flower2 size={18} />;
}

export default function Navbar() {
  const { theme, cycleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl shadow-sm">

      {/* Cherry blossom floral decoration — SAKURA THEME ONLY */}
      {theme === "sakura" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <svg
            width="100%"
            height="64"
            viewBox="0 0 1200 64"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <BlossomFlower x={40}   y={32} scale={0.9}  opacity={0.20} />
            <BlossomFlower x={130}  y={18} scale={0.6}  opacity={0.14} />
            <BlossomFlower x={220}  y={44} scale={0.75} opacity={0.17} />
            <BlossomFlower x={320}  y={22} scale={0.5}  opacity={0.13} />
            <BlossomFlower x={440}  y={50} scale={0.85} opacity={0.18} />
            <BlossomFlower x={570}  y={16} scale={0.65} opacity={0.15} />
            <BlossomFlower x={660}  y={46} scale={0.7}  opacity={0.16} />
            <BlossomFlower x={760}  y={20} scale={0.8}  opacity={0.18} />
            <BlossomFlower x={860}  y={48} scale={0.55} opacity={0.13} />
            <BlossomFlower x={960}  y={24} scale={0.9}  opacity={0.19} />
            <BlossomFlower x={1060} y={42} scale={0.65} opacity={0.15} />
            <BlossomFlower x={1150} y={18} scale={0.75} opacity={0.17} />
            {/* Loose single petals */}
            <ellipse cx="100"  cy="38" rx="4" ry="7" fill="#E8679A" opacity="0.10" transform="rotate(-30 100 38)"  />
            <ellipse cx="390"  cy="28" rx="3" ry="6" fill="#E8679A" opacity="0.09" transform="rotate(45 390 28)"   />
            <ellipse cx="720"  cy="54" rx="4" ry="7" fill="#E8679A" opacity="0.10" transform="rotate(20 720 54)"   />
            <ellipse cx="1000" cy="36" rx="3" ry="6" fill="#E8679A" opacity="0.09" transform="rotate(-15 1000 36)" />
          </svg>
        </div>
      )}

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
          {links.map((l) => (
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
          ))}
          <button
            onClick={cycleTheme}
            data-testid="button-toggle-theme"
            className="ml-4 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Cycle theme"
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>

        {/* Mobile: only theme toggle — bottom nav handles page links */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={cycleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Cycle theme"
          >
            <ThemeIcon theme={theme} />
          </button>
        </div>
      </div>
    </nav>
  );
}
