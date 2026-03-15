# Portfolio Website — Task List for Claude Code

**Repo:** https://github.com/mubashir-rehman/mubashir-rehman.github.io  
**Live site:** https://mubashir-rehman.github.io  
**Branch:** `main` — push here, GitHub Actions deploys automatically to GitHub Pages  
**Build command:** `npm run build` (vite-react-ssg)  
**Build output:** `dist/public`

---

## Before Starting Any Task

1. Read QWEN.md
2. Read the repo structure. Key paths:
   - `src/components/ThemeProvider.tsx` — theme state and context
   - `src/components/Navbar.tsx` — top nav with theme toggle
   - `src/components/Footer.tsx` — footer with Forty Rules quote
   - `src/components/SEO.tsx` — helmet-based SEO per page
   - `src/pages/Journal.tsx` — JournalList + JournalEntry exports
   - `src/data/*.json` — ALL site content lives here, edit data files before JSX
   - `src/index.css` — all CSS custom properties (HSL-based design tokens)
   - `public/` — static assets served at root
3. After all tasks are done, run `npm run build` and confirm zero TypeScript errors before committing.

---

## Constraints (never violate these)

- The site is and will always remain **fully static** — no backend, no SSR, no API routes
- All data lives in `src/data/*.json`
- TypeScript strict mode is on — no `any` unless absolutely unavoidable
- Do not install packages unless a task explicitly instructs it
- Do not modify `sitemap.xml`, `vite.config.ts`, or `src/main.tsx` unless a task explicitly requires it
- Commit style: conventional commits, scoped — e.g. `feat(journal): add giscus comments`

---

## Task 2 — Add Sakura (Cherry Blossom) Spring Theme

### What to build
A third theme called `sakura` that becomes the **default for all new visitors**.
- Theme cycle order: **sakura → dark → light → sakura**
- Toggle button icon shows where you're *going* next (Moon when on sakura, Sun when on dark, Flower when on light)
- Sakura theme uses cherry blossom accent colors (pink/rose) throughout
- Navbar gets subtle cherry blossom flower patterns rendered in SVG — sakura theme only
- Footer gets a cherry blossom road scene (perspective road, trees both sides, pink sky) — sakura theme only
- Falling petal animation covers the full page — sakura theme only
- Dark and light themes are **visually unchanged** — zero sakura effects when those are active
- **Zero new npm packages** — all effects are pure SVG + CSS keyframes

> **Important:** Task 2 depends on Task 1 being completed first, because `Comments.tsx`
> already references the `sakura` theme value. If Task 1 is not done yet, do Task 1 first.

### Step 1 — Edit `tailwind.config.ts`

Tailwind's `darkMode` is currently `["class"]`. The sakura theme also applies via a class
on `<html>`. No change is needed here — class-based theming already supports `sakura` class
being added to the root element.

### Step 2 — Full replacement of `src/components/ThemeProvider.tsx`

```tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "dark" | "light" | "sakura";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "sakura",
  setTheme: () => {},
  cycleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "sakura";
    }
    return "sakura";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light", "sakura");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  // Cycle: sakura → dark → light → sakura
  const cycleTheme = () =>
    setThemeState((prev) =>
      prev === "sakura" ? "dark" : prev === "dark" ? "light" : "sakura"
    );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

> **Note:** The old `toggleTheme` is replaced by `cycleTheme`. Any component that was
> importing `toggleTheme` from `useTheme()` must be updated to `cycleTheme`. Search the
> codebase for `toggleTheme` and update all usages.

### Step 3 — Edit `src/index.css`

**Change 1 — Add `.sakura` theme block** immediately after the `.dark { ... }` closing brace:

```css
  .sakura {
    --background: 340 60% 97%;
    --foreground: 340 40% 18%;

    --card: 340 50% 94%;
    --card-foreground: 340 40% 18%;

    --popover: 340 60% 97%;
    --popover-foreground: 340 40% 18%;

    --primary: 340 78% 58%;
    --primary-foreground: 0 0% 100%;

    --secondary: 340 35% 90%;
    --secondary-foreground: 340 40% 18%;

    --muted: 340 28% 88%;
    --muted-foreground: 340 18% 45%;

    --accent: 340 78% 58%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 340 28% 84%;
    --input: 340 28% 84%;
    --ring: 340 78% 58%;

    --radius: 0.75rem;

    --purple: 340 78% 58%;
    --purple-foreground: 0 0% 100%;
    --purple-glow: 350 82% 68%;
    --navy: 340 40% 18%;
    --cream: 340 60% 97%;
  }
```

**Change 2 — Add petal CSS keyframes** at the very bottom of `src/index.css`,
after all `@layer` blocks:

```css
@keyframes petal-fall {
  0% {
    transform: translateY(-60px) translateX(0px) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 0.6; }
  100% {
    transform: translateY(110vh) translateX(var(--drift)) rotate(720deg);
    opacity: 0;
  }
}

@keyframes petal-sway {
  0%, 100% { margin-left: 0; }
  25%       { margin-left: 20px; }
  75%       { margin-left: -20px; }
}
```

### Step 4 — Create `src/components/SakuraPetals.tsx`

18 falling petals — each is an inline SVG ellipse driven by the CSS keyframes above.
The component returns `null` for dark and light themes — it only renders in sakura.
Petal positions are hardcoded (not random) to avoid hydration mismatches with SSG.

```tsx
import { useTheme } from "@/components/ThemeProvider";

const PETALS = [
  { id: 0,  left: 27,  size: 17.2, duration: 9.9,  delay: 7.7,  drift: 97,  rotate: 185, opacity: 0.64 },
  { id: 1,  left: 86,  size: 8.3,  duration: 9.7,  delay: 4.9,  drift: 85,  rotate: 192, opacity: 0.55 },
  { id: 2,  left: 95,  size: 9.1,  duration: 14.4, delay: 2.0,  drift: 86,  rotate: 15,  opacity: 0.54 },
  { id: 3,  left: 46,  size: 12.1, duration: 9.8,  delay: 3.9,  drift: 123, rotate: 231, opacity: 0.60 },
  { id: 4,  left: 93,  size: 14.9, duration: 10.0, delay: 0.8,  drift: 41,  rotate: 66,  opacity: 0.71 },
  { id: 5,  left: 47,  size: 12.6, duration: 12.4, delay: 2.9,  drift: 52,  rotate: 169, opacity: 0.71 },
  { id: 6,  left: 41,  size: 10.4, duration: 14.3, delay: 8.5,  drift: 102, rotate: 153, opacity: 0.69 },
  { id: 7,  left: 76,  size: 13.4, duration: 8.8,  delay: 2.9,  drift: 44,  rotate: 188, opacity: 0.74 },
  { id: 8,  left: 81,  size: 12.0, duration: 11.2, delay: 4.3,  drift: 124, rotate: 197, opacity: 0.60 },
  { id: 9,  left: 12,  size: 11.6, duration: 15.5, delay: 7.0,  drift: 98,  rotate: 237, opacity: 0.75 },
  { id: 10, left: 79,  size: 14.0, duration: 14.0, delay: 2.5,  drift: 129, rotate: 167, opacity: 0.74 },
  { id: 11, left: 77,  size: 17.6, duration: 15.7, delay: 1.1,  drift: 46,  rotate: 206, opacity: 0.66 },
  { id: 12, left: 33,  size: 13.3, duration: 12.6, delay: 9.0,  drift: 144, rotate: 154, opacity: 0.58 },
  { id: 13, left: 63,  size: 12.3, duration: 8.9,  delay: 3.0,  drift: 130, rotate: 347, opacity: 0.52 },
  { id: 14, left: 49,  size: 11.4, duration: 10.0, delay: 3.0,  drift: 64,  rotate: 312, opacity: 0.69 },
  { id: 15, left: 100, size: 14.9, duration: 15.8, delay: 2.6,  drift: 111, rotate: 45,  opacity: 0.59 },
  { id: 16, left: 5,   size: 17.2, duration: 11.9, delay: 3.4,  drift: 67,  rotate: 64,  opacity: 0.78 },
  { id: 17, left: 99,  size: 16.6, duration: 15.6, delay: 6.5,  drift: 93,  rotate: 150, opacity: 0.50 },
];

export default function SakuraPetals() {
  const { theme } = useTheme();
  if (theme !== "sakura") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      {PETALS.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: "-60px",
            left: `${p.left}%`,
            opacity: p.opacity,
            animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite,
                        petal-sway ${p.duration * 0.6}s ease-in-out ${p.delay}s infinite`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        >
          <svg
            width={p.size}
            height={p.size * 1.5}
            viewBox="0 0 20 28"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transform: `rotate(${p.rotate}deg)` }}
          >
            <ellipse cx="10" cy="14" rx="8"  ry="13" fill="#F2A0B8" opacity="0.9" />
            <ellipse cx="8"  cy="10" rx="3"  ry="6"  fill="#FDD0DF" opacity="0.5" />
            <line x1="10" y1="3" x2="10" y2="25"
                  stroke="#E8759A" strokeWidth="0.5" opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );
}
```

### Step 5 — Edit `src/App.tsx`

**Change 1 — Add SakuraPetals import** after the `Footer` import:

```tsx
import SakuraPetals from "@/components/SakuraPetals";
```

**Change 2 — Mount `<SakuraPetals />`** inside the fragment, right before `<Navbar />`:

```tsx
          <SakuraPetals />
          <Navbar />
```

### Step 6 — Full replacement of `src/components/Navbar.tsx`

Key changes from current file:
- `toggleTheme` → `cycleTheme` (ThemeProvider API change)
- Import `Flower2` from lucide-react (falls back to a custom SVG if unavailable — see note)
- Toggle icon reflects the *next* theme, not the current one
- Sakura-only floral decoration SVG rendered as absolutely positioned overlay behind nav content

```tsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Flower2, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { to: "/",          label: "Home"     },
  { to: "/about",     label: "About"    },
  { to: "/projects",  label: "Projects" },
  { to: "/hobbies",   label: "Hobbies"  },
  { to: "/habits",    label: "Habits"   },
  { to: "/journal",   label: "Journal"  },
  { to: "/contact",   label: "Contact"  },
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
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">

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

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={cycleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Cycle theme"
          >
            <ThemeIcon theme={theme} />
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
```

> **Note on `Flower2`:** This icon exists in lucide-react >= 0.307. The project uses
> `lucide-react@^0.462.0` so it will be available. If the build fails with a missing
> export error anyway, replace `Flower2` with `Flower` or use this inline SVG fallback:
> ```tsx
> const FlowerIcon = () => (
>   <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
>        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
>     {[0,60,120,180,240,300].map(a => (
>       <ellipse key={a} cx="12" cy="7" rx="3" ry="5"
>                transform={`rotate(${a} 12 12)`} />
>     ))}
>     <circle cx="12" cy="12" r="2" fill="currentColor" />
>   </svg>
> );
> ```

### Step 7 — Edit `src/components/Footer.tsx`

**Change 1 — Add `useTheme` import** (add to existing import line from ThemeProvider):

```tsx
import { useTheme } from "@/components/ThemeProvider";
```

**Change 2 — Destructure `theme`** inside the Footer function, after the `rule` line:

```tsx
  const { theme } = useTheme();
```

**Change 3 — Add sakura SVG scene** at the very top of the `<footer>` JSX return,
before the `<div className="mx-auto ...">` wrapper. Insert this entire block:

```tsx
      {/* Cherry blossom road scene — SAKURA THEME ONLY */}
      {theme === "sakura" && (
        <div aria-hidden="true" className="w-full overflow-hidden">
          <svg
            viewBox="0 0 1200 220"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="w-full"
            style={{ display: "block", maxHeight: "220px" }}
          >
            <defs>
              <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#FBCFE0" />
                <stop offset="60%"  stopColor="#FDE8EF" />
                <stop offset="100%" stopColor="#FFF5F8" />
              </linearGradient>
              <linearGradient id="road-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D6C9B8" />
                <stop offset="100%" stopColor="#C4B49E" />
              </linearGradient>
              <linearGradient id="grass-l" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#A8D8A8" />
                <stop offset="100%" stopColor="#C8E6C8" />
              </linearGradient>
              <linearGradient id="grass-r" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"   stopColor="#C8E6C8" />
                <stop offset="100%" stopColor="#A8D8A8" />
              </linearGradient>
            </defs>

            {/* Sky */}
            <rect x="0" y="0" width="1200" height="220" fill="url(#sky-grad)" />

            {/* Distant soft hills */}
            <ellipse cx="300" cy="145" rx="320" ry="50" fill="#F5C2D4" opacity="0.25" />
            <ellipse cx="900" cy="145" rx="280" ry="45" fill="#F5C2D4" opacity="0.22" />

            {/* Grass — left */}
            <polygon points="0,155 480,130 480,220 0,220" fill="url(#grass-l)" opacity="0.8" />
            {/* Grass — right */}
            <polygon points="720,130 1200,155 1200,220 720,220" fill="url(#grass-r)" opacity="0.8" />

            {/* Road (perspective trapezoid) */}
            <polygon points="200,220 1000,220 665,128 535,128" fill="url(#road-grad)" />
            <polygon points="200,220 250,220 595,128 535,128"  fill="#BBA88A" opacity="0.4" />
            <polygon points="950,220 1000,220 665,128 615,128" fill="#BBA88A" opacity="0.4" />

            {/* Road center dashes — perspective-scaled */}
            {[130, 145, 160, 175, 192, 210].map((y, i) => {
              const progress = (y - 128) / 92;
              const halfW = 2 + progress * 3;
              const h = 8 + progress * 4;
              return (
                <rect
                  key={i}
                  x={600 - halfW}
                  y={y}
                  width={halfW * 2}
                  height={h}
                  rx="1"
                  fill="#E8DCCA"
                  opacity="0.7"
                />
              );
            })}

            {/* LEFT TREE 1 — distant, small */}
            <rect x="448" y="85" width="8"  height="50"  rx="3" fill="#7A4E2D" />
            <circle cx="452" cy="72" r="22" fill="#FFACC7" opacity="0.9" />
            <circle cx="436" cy="82" r="16" fill="#FF8FAD" opacity="0.8" />
            <circle cx="468" cy="80" r="16" fill="#FF8FAD" opacity="0.8" />
            <circle cx="452" cy="55" r="14" fill="#FFCCD8" opacity="0.85" />
            <circle cx="440" cy="62" r="10" fill="#FFCCD8" opacity="0.7" />
            <circle cx="464" cy="60" r="10" fill="#FFCCD8" opacity="0.7" />

            {/* LEFT TREE 2 — medium */}
            <rect x="328" y="70" width="12" height="72"  rx="4" fill="#7A4E2D" />
            <circle cx="334" cy="52" r="32" fill="#FFACC7" opacity="0.9" />
            <circle cx="308" cy="66" r="22" fill="#FF8FAD" opacity="0.8" />
            <circle cx="360" cy="64" r="22" fill="#FF8FAD" opacity="0.8" />
            <circle cx="334" cy="30" r="20" fill="#FFCCD8" opacity="0.85" />
            <circle cx="318" cy="40" r="14" fill="#FFCCD8" opacity="0.7" />
            <circle cx="350" cy="38" r="14" fill="#FFCCD8" opacity="0.7" />

            {/* LEFT TREE 3 — large, close */}
            <rect x="128" y="45" width="18" height="110" rx="5" fill="#7A4E2D" />
            <circle cx="137" cy="22" r="46" fill="#FFACC7" opacity="0.9" />
            <circle cx="100" cy="42" r="32" fill="#FF8FAD" opacity="0.8" />
            <circle cx="174" cy="40" r="32" fill="#FF8FAD" opacity="0.8" />
            <circle cx="137" cy="-8" r="28" fill="#FFCCD8" opacity="0.88" />
            <circle cx="112" cy="8"  r="20" fill="#FFCCD8" opacity="0.72" />
            <circle cx="162" cy="6"  r="20" fill="#FFCCD8" opacity="0.72" />

            {/* RIGHT TREE 1 — distant, small */}
            <rect x="744" y="85" width="8"  height="50"  rx="3" fill="#7A4E2D" />
            <circle cx="748" cy="72" r="22" fill="#FFACC7" opacity="0.9" />
            <circle cx="732" cy="82" r="16" fill="#FF8FAD" opacity="0.8" />
            <circle cx="764" cy="80" r="16" fill="#FF8FAD" opacity="0.8" />
            <circle cx="748" cy="55" r="14" fill="#FFCCD8" opacity="0.85" />
            <circle cx="736" cy="62" r="10" fill="#FFCCD8" opacity="0.7" />
            <circle cx="760" cy="60" r="10" fill="#FFCCD8" opacity="0.7" />

            {/* RIGHT TREE 2 — medium */}
            <rect x="860" y="70" width="12" height="72"  rx="4" fill="#7A4E2D" />
            <circle cx="866" cy="52" r="32" fill="#FFACC7" opacity="0.9" />
            <circle cx="840" cy="66" r="22" fill="#FF8FAD" opacity="0.8" />
            <circle cx="892" cy="64" r="22" fill="#FF8FAD" opacity="0.8" />
            <circle cx="866" cy="30" r="20" fill="#FFCCD8" opacity="0.85" />
            <circle cx="850" cy="40" r="14" fill="#FFCCD8" opacity="0.7" />
            <circle cx="882" cy="38" r="14" fill="#FFCCD8" opacity="0.7" />

            {/* RIGHT TREE 3 — large, close */}
            <rect x="1054" y="45" width="18" height="110" rx="5" fill="#7A4E2D" />
            <circle cx="1063" cy="22" r="46" fill="#FFACC7" opacity="0.9" />
            <circle cx="1026" cy="42" r="32" fill="#FF8FAD" opacity="0.8" />
            <circle cx="1100" cy="40" r="32" fill="#FF8FAD" opacity="0.8" />
            <circle cx="1063" cy="-8" r="28" fill="#FFCCD8" opacity="0.88" />
            <circle cx="1038" cy="8"  r="20" fill="#FFCCD8" opacity="0.72" />
            <circle cx="1088" cy="6"  r="20" fill="#FFCCD8" opacity="0.72" />

            {/* Airborne petals */}
            <ellipse cx="200" cy="95"  rx="5" ry="8" fill="#F2A0B8" opacity="0.5"  transform="rotate(35 200 95)"   />
            <ellipse cx="580" cy="108" rx="4" ry="7" fill="#F2A0B8" opacity="0.45" transform="rotate(-20 580 108)" />
            <ellipse cx="690" cy="100" rx="5" ry="8" fill="#F2A0B8" opacity="0.5"  transform="rotate(55 690 100)"  />
            <ellipse cx="380" cy="118" rx="3" ry="6" fill="#F2A0B8" opacity="0.4"  transform="rotate(-40 380 118)" />
            <ellipse cx="850" cy="112" rx="4" ry="7" fill="#F2A0B8" opacity="0.45" transform="rotate(25 850 112)"  />
            <ellipse cx="960" cy="88"  rx="5" ry="8" fill="#F2A0B8" opacity="0.5"  transform="rotate(-60 960 88)"  />
            <ellipse cx="480" cy="140" rx="3" ry="5" fill="#F2A0B8" opacity="0.35" transform="rotate(15 480 140)"  />
            <ellipse cx="750" cy="145" rx="3" ry="5" fill="#F2A0B8" opacity="0.35" transform="rotate(-25 750 145)" />
          </svg>
        </div>
      )}
```

### Verification checklist for Task 2
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] Default theme for a new visitor (no localStorage) is `sakura`
- [ ] Cycling dark → light → sakura → dark works correctly
- [ ] Toggle icon correctly previews next theme (Moon on sakura, Sun on dark, Flower on light)
- [ ] Cherry blossom flowers appear in navbar ONLY in sakura theme
- [ ] Falling petals appear ONLY in sakura theme
- [ ] Footer road scene appears ONLY in sakura theme
- [ ] Dark and light themes look exactly as before — no pink bleed-through
- [ ] No hydration warnings in browser console (petal positions are static, not Math.random())

### Commit message
```
feat(theme): add sakura spring theme with falling petals, floral navbar, and cherry blossom footer
```

---

## Final Steps (after both tasks)

```bash
# Verify full build
npm run build

# Confirm output
ls dist/public/giscus-*.css   # should show 3 files

# Stage everything
git add -A

# Commit
git commit -m "feat: add giscus comments and sakura spring theme"

# Push
git push origin main
```

GitHub Actions will automatically build and deploy to GitHub Pages on push to `main`.
Deployment takes ~2 minutes. Check https://mubashir-rehman.github.io after that.