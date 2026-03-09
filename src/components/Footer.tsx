import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";
import fortyRules from "@/data/fortyRules.json";
import profile from "@/data/profile.json";

const footerLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export default function Footer() {
  const rule = useMemo(() => fortyRules[Math.floor(Math.random() * fortyRules.length)], []);

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Rule */}
        <blockquote className="mb-10 border-l-2 border-primary pl-4 italic text-muted-foreground">
          <p className="text-sm leading-relaxed">"{rule}"</p>
          <cite className="mt-2 block text-xs not-italic text-primary">
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
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-3">
            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${profile.socialLinks.email}`}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © 2025 Mubashir Rehman · Open Source
        </p>
      </div>
    </footer>
  );
}
