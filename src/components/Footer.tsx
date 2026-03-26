import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import fortyRules from "@/data/fortyRules.json";
import profile from "@/data/profile.json";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const { theme } = useTheme();
  // Randomise only after mount to avoid SSR/client content mismatch (React #425).
  // SSG renders index 0; client swaps to a random rule after hydration.
  const [ruleIndex, setRuleIndex] = useState(0);
  useEffect(() => {
    setRuleIndex(Math.floor(Math.random() * fortyRules.length));
  }, []);
  const rule = fortyRules[ruleIndex];

  return (
    <footer className="relative border-t border-border bg-card">
      {/* Cherry blossom road scene — SAKURA THEME ONLY — Background layer */}
      {theme === "sakura" && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <svg
            viewBox="0 0 1200 220"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            className="h-full w-full"
            style={{ display: "block" }}
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
            <ellipse cx="380" cy="118" rx="3" ry="6" fill="#F2A0B8" opacity="0.35" transform="rotate(15 380 118)"  />
            <ellipse cx="850" cy="112" rx="4" ry="7" fill="#F2A0B8" opacity="0.45" transform="rotate(25 850 112)"  />
            <ellipse cx="960" cy="88"  rx="5" ry="8" fill="#F2A0B8" opacity="0.5"  transform="rotate(-60 960 88)"  />
            <ellipse cx="480" cy="140" rx="3" ry="5" fill="#F2A0B8" opacity="0.35" transform="rotate(15 480 140)"  />
            <ellipse cx="750" cy="145" rx="3" ry="5" fill="#F2A0B8" opacity="0.35" transform="rotate(-25 750 145)" />
          </svg>
        </div>
      )}

      {/* Content area — text floats directly on the sakura scene */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Rule */}
        <blockquote className={`mb-10 border-l-2 border-primary pl-4 italic ${theme === "sakura" ? "text-[#2d1a1f] drop-shadow-sm" : "text-muted-foreground"}`}>
          <p className={`text-sm leading-relaxed ${theme === "sakura" ? "font-medium drop-shadow" : ""}`}>"{rule}"</p>
          <cite className={`mt-2 block text-xs not-italic ${theme === "sakura" ? "text-[#c94a74] font-semibold" : "text-primary"}`}>
            ✦ The Forty Rules of Love — Shams of Tabriz
          </cite>
        </blockquote>

        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Nav */}
          <div className="flex flex-wrap gap-4">
            {footerLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={`text-sm transition-colors ${
                  theme === "sakura"
                    ? "text-[#3d2329] hover:text-[#c94a74]"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
              className={`rounded-lg p-2 transition-colors ${
                theme === "sakura"
                  ? "text-[#3d2329] hover:bg-[#e8679a]/20 hover:text-[#c94a74]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
              className={`rounded-lg p-2 transition-colors ${
                theme === "sakura"
                  ? "text-[#3d2329] hover:bg-[#e8679a]/20 hover:text-[#c94a74]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${profile.socialLinks.email}`}
              className={`rounded-lg p-2 transition-colors ${
                theme === "sakura"
                  ? "text-[#3d2329] hover:bg-[#e8679a]/20 hover:text-[#c94a74]"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <p className={`mt-8 text-center text-xs ${theme === "sakura" ? "text-[#3d2329] drop-shadow-sm" : "text-muted-foreground"}`}>
          © 2025 Mubashir Rehman · Open Source
        </p>
      </div>
    </footer>
  );
}
