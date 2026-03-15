import { useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderOpen, Flame, Heart, BookOpen, ArrowRight } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";
import fortyRules from "@/data/fortyRules.json";
import PageTransition from "@/components/PageTransition";
import SEO from "@/components/SEO";

// ---------------------------------------------------------------------------
// M3 design tokens as Tailwind-compatible inline values
// ---------------------------------------------------------------------------
const M3 = {
  // Easing
  emphasizedEasing: [0.2, 0, 0, 1.0] as [number, number, number, number],
  // Durations
  medium2: 0.3,
  long2: 0.5,
};

// ---------------------------------------------------------------------------
// Quick nav tiles (Bookme-style)
// ---------------------------------------------------------------------------
const quickLinks = [
  { to: "/projects", Icon: FolderOpen, label: "Projects", color: "hsl(var(--m3-primary-container))", onColor: "hsl(var(--m3-on-primary-container))" },
  { to: "/habits",   Icon: Flame,      label: "Habits",   color: "hsl(var(--m3-primary-container))", onColor: "hsl(var(--m3-on-primary-container))" },
  { to: "/hobbies",  Icon: Heart,      label: "Hobbies",  color: "hsl(var(--m3-primary-container))", onColor: "hsl(var(--m3-on-primary-container))" },
  { to: "/journal",  Icon: BookOpen,   label: "Journal",  color: "hsl(var(--m3-primary-container))", onColor: "hsl(var(--m3-on-primary-container))" },
];

// ---------------------------------------------------------------------------
// Featured projects only
// ---------------------------------------------------------------------------
const featuredProjects = projects.filter((p) => p.featured);

// ---------------------------------------------------------------------------
// Stagger children animation
// ---------------------------------------------------------------------------
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: M3.medium2,
      ease: M3.emphasizedEasing,
      delay: i * 0.06,
    },
  }),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function MobileLanding() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const quote = useMemo(
    () => fortyRules[Math.floor(Math.random() * fortyRules.length)],
    [],
  );

  return (
    <PageTransition>
      <SEO />
      <div
        className="min-h-screen bg-[hsl(var(--m3-surface))] pb-24 pt-16"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Header — avatar | name + typewriter + tagline                    */}
        {/* ---------------------------------------------------------------- */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-lg px-4 pt-5"
        >
          <motion.div
            variants={fadeSlideUp}
            className="flex items-center gap-4 rounded-[28px] bg-[hsl(var(--m3-surface-high))] px-4 py-4 shadow-sm"
          >
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--m3-primary-container))] font-heading text-lg font-bold text-[hsl(var(--m3-on-primary-container))]">
              MR
            </div>

            {/* Text */}
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-[1.25rem] font-bold leading-tight text-[hsl(var(--m3-on-surface))]">
                {profile.name}
              </h1>
              {/* Typewriter — inherits existing component */}
              <div className="mt-0.5 h-5 text-sm text-[hsl(var(--primary))]">
                <Typewriter />
              </div>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
                Building production systems — from drone swarms to AI‑powered SaaS at scale.
              </p>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Quick nav tiles                                                  */}
          {/* ---------------------------------------------------------------- */}
          <motion.div variants={fadeSlideUp} className="mt-5">
            <p className="mb-3 px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              Explore
            </p>
            <div className="grid grid-cols-4 gap-3">
              {quickLinks.map(({ to, Icon, label }, i) => (
                <motion.div
                  key={to}
                  custom={i}
                  variants={fadeSlideUp}
                  whileTap={{ scale: 0.93 }}
                >
                  <Link
                    to={to}
                    className="flex flex-col items-center gap-2 rounded-[20px] bg-[hsl(var(--m3-surface-highest))] py-4 transition-colors active:bg-[hsl(var(--m3-primary-container)/0.6)]"
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full"
                      style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
                    >
                      <Icon
                        size={22}
                        style={{ color: "hsl(var(--m3-on-primary-container))" }}
                      />
                    </span>
                    <span className="font-body text-[11px] font-medium text-[hsl(var(--m3-on-surface))]">
                      {label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Projects carousel                                                */}
          {/* ---------------------------------------------------------------- */}
          <motion.div variants={fadeSlideUp} className="mt-6">
            <div className="mb-3 flex items-center justify-between px-1">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
                Featured Projects
              </p>
              <Link
                to="/projects"
                className="flex items-center gap-1 font-body text-xs font-semibold text-[hsl(var(--primary))]"
              >
                See all <ArrowRight size={12} />
              </Link>
            </div>

            {/* Horizontal scroll container */}
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-none"
              style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
            >
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  custom={i}
                  variants={fadeSlideUp}
                  className="w-[72vw] max-w-[280px] shrink-0"
                  style={{ scrollSnapAlign: "start" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex h-full flex-col rounded-[28px] bg-[hsl(var(--m3-surface-high))] p-5 shadow-sm">
                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-0.5 font-body text-[10px] font-medium"
                          style={{
                            backgroundColor: "hsl(var(--m3-primary-container))",
                            color: "hsl(var(--m3-on-primary-container))",
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 font-heading text-sm font-bold leading-snug text-[hsl(var(--m3-on-surface))]">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-2 line-clamp-3 flex-1 font-body text-xs leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
                      {project.description}
                    </p>

                    {/* Metrics */}
                    {project.metrics.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.metrics.slice(0, 2).map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-[hsl(var(--m3-outline-var))] px-2.5 py-0.5 font-body text-[10px] text-[hsl(var(--m3-on-surface-var))]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Quote card                                                       */}
          {/* ---------------------------------------------------------------- */}
          <motion.div variants={fadeSlideUp} className="mt-5">
            <div className="rounded-[28px] bg-[hsl(var(--m3-primary-container))] px-6 py-6">
              <p className="font-heading text-sm italic leading-relaxed text-[hsl(var(--m3-on-primary-container))]">
                &ldquo;{quote}&rdquo;
              </p>
              <cite className="mt-3 block font-body text-[11px] font-semibold not-italic text-[hsl(var(--m3-on-primary-container)/0.7)]">
                ✦ The Forty Rules of Love — Shams of Tabriz
              </cite>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
