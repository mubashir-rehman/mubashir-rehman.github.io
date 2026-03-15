import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import projects from "@/data/projects.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

// ---------------------------------------------------------------------------
// M3 motion
// ---------------------------------------------------------------------------
const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: emphasized, delay: i * 0.055 },
  }),
  exit: { opacity: 0, y: 8, transition: { duration: 0.18 } },
};

// ---------------------------------------------------------------------------
// Derive unique tags for filter chips
// ---------------------------------------------------------------------------
function getTopTags(limit = 12): string[] {
  const freq: Record<string, number> = {};
  projects.forEach((p) => p.tags.forEach((t) => { freq[t] = (freq[t] ?? 0) + 1; }));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

// ---------------------------------------------------------------------------
// Shimmer skeleton for loading state
// ---------------------------------------------------------------------------
function Skeleton() {
  return (
    <div className="animate-pulse rounded-[24px] bg-[hsl(var(--m3-surface-high))] p-5">
      <div className="flex gap-2">
        <div className="h-5 w-16 rounded-full bg-[hsl(var(--m3-surface-highest))]" />
        <div className="h-5 w-12 rounded-full bg-[hsl(var(--m3-surface-highest))]" />
      </div>
      <div className="mt-3 h-5 w-3/4 rounded-lg bg-[hsl(var(--m3-surface-highest))]" />
      <div className="mt-2 h-3 w-full rounded bg-[hsl(var(--m3-surface-highest))]" />
      <div className="mt-1.5 h-3 w-5/6 rounded bg-[hsl(var(--m3-surface-highest))]" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-20 rounded-full bg-[hsl(var(--m3-surface-highest))]" />
        <div className="h-5 w-16 rounded-full bg-[hsl(var(--m3-surface-highest))]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Single project card
// ---------------------------------------------------------------------------
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string;
  featured: boolean;
  metrics: string[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const isFeatured = project.featured;

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
      data-testid={`card-project-${project.id}`}
    >
      <div
        className={[
          "relative flex flex-col rounded-[24px] p-5 transition-shadow active:scale-[0.985]",
          isFeatured
            ? "bg-[hsl(var(--m3-surface-high))] shadow-md shadow-black/5"
            : "bg-[hsl(var(--m3-surface-low))]",
        ].join(" ")}
        style={isFeatured ? {
          borderLeft: "3px solid hsl(var(--primary))",
        } : undefined}
      >
        {/* Featured label */}
        {isFeatured && (
          <span
            className="mb-3 self-start rounded-full px-2.5 py-0.5 font-body text-[10px] font-semibold"
            style={{
              backgroundColor: "hsl(var(--m3-primary-container))",
              color: "hsl(var(--m3-on-primary-container))",
            }}
          >
            ✦ Featured
          </span>
        )}

        {/* Tech tag chips */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[hsl(var(--m3-outline-var))] px-2.5 py-0.5 font-body text-[10px] text-[hsl(var(--m3-on-surface-var))]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="mt-3 font-heading text-[0.95rem] font-bold leading-snug text-[hsl(var(--m3-on-surface))]">
          {project.title}
        </h3>

        {/* Description — 3 lines max */}
        <p className="mt-1.5 line-clamp-3 font-body text-xs leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
          {project.description}
        </p>

        {/* Metrics */}
        {project.metrics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.metrics.slice(0, 3).map((m) => (
              <span
                key={m}
                className="rounded-full px-2.5 py-0.5 font-body text-[10px] font-medium"
                style={{
                  backgroundColor: "hsl(var(--m3-primary-container))",
                  color: "hsl(var(--m3-on-primary-container))",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Links */}
        {(project.github || project.demo) && (
          <div className="mt-4 flex gap-4 border-t border-[hsl(var(--m3-outline-var))] pt-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-github-${project.id}`}
                className="inline-flex items-center gap-1.5 font-body text-xs font-medium text-[hsl(var(--m3-on-surface-var))] active:opacity-70"
              >
                <Github size={14} /> Code
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-demo-${project.id}`}
                className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-[hsl(var(--primary))] active:opacity-70"
              >
                <ExternalLink size={14} /> Live
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MobileProjects() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const topTags = useMemo(() => getTopTags(12), []);

  // Slight delay so skeletons flash briefly — feels more native
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 180);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const list = activeTag
      ? projects.filter((p) => p.tags.includes(activeTag))
      : projects;
    return [...list].sort((a, b) =>
      a.featured === b.featured ? 0 : a.featured ? -1 : 1,
    );
  }, [activeTag]);

  // Scroll active chip into view
  const handleChipClick = (tag: string | null) => {
    setActiveTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <PageTransition>
      <SEO
        title="Projects"
        description="Production projects by Mubashir Rehman — AI-powered SaaS, drone swarm systems, microservices, and full-stack apps with real metrics."
      />

      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-4">

        {/* Page header */}
        <div className="px-4 pt-5">
          <h1 className="font-heading text-2xl font-bold text-[hsl(var(--m3-on-surface))]">
            Projects
          </h1>
          <p className="mt-0.5 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
            Production systems with real metrics.
          </p>
        </div>

        {/* Filter chips — horizontal scroll, sticky */}
        <div className="sticky top-16 z-10 bg-[hsl(var(--m3-surface))]/95 backdrop-blur-sm pt-3 pb-2">
          <div
            ref={chipsRef}
            className="flex gap-2 overflow-x-auto px-4 scrollbar-none"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {/* All chip */}
            <button
              onClick={() => handleChipClick(null)}
              data-testid="button-filter-all"
              className={[
                "shrink-0 rounded-full border px-4 py-1.5 font-body text-xs font-medium transition-all",
                !activeTag
                  ? "border-[hsl(var(--primary))] bg-[hsl(var(--m3-primary-container))] text-[hsl(var(--m3-on-primary-container))]"
                  : "border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface-high))] text-[hsl(var(--m3-on-surface-var))]",
              ].join(" ")}
            >
              All ({projects.length})
            </button>

            {topTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleChipClick(tag)}
                data-testid={`button-filter-${tag}`}
                className={[
                  "shrink-0 rounded-full border px-4 py-1.5 font-body text-xs font-medium transition-all",
                  activeTag === tag
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--m3-primary-container))] text-[hsl(var(--m3-on-primary-container))]"
                    : "border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface-high))] text-[hsl(var(--m3-on-surface-var))]",
                ].join(" ")}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Result count */}
        <div className="px-4 pt-3 pb-1">
          <p className="font-body text-[11px] text-[hsl(var(--m3-on-surface-var))]">
            {activeTag
              ? `${filtered.length} project${filtered.length !== 1 ? "s" : ""} with ${activeTag}`
              : `${filtered.length} projects`}
          </p>
        </div>

        {/* Card list */}
        <div className="space-y-3 px-4 pt-1">
          {!ready ? (
            // Shimmer skeletons
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
