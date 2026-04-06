import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from "framer-motion";
import { ExternalLink, Github, X } from "lucide-react";
import projects from "@/data/projects.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

const emphasized     = [0.2, 0, 0, 1.0]   as [number,number,number,number];
const emphasizedDecel = [0.05, 0.7, 0.1, 1.0] as [number,number,number,number];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Project {
  id: string; title: string; description: string;
  tags: string[]; github: string; demo: string;
  featured: boolean; metrics: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getTopTags(limit = 12): string[] {
  const freq: Record<string, number> = {};
  projects.forEach((p) => p.tags.forEach((t) => { freq[t] = (freq[t] ?? 0) + 1; }));
  return Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,limit).map(([t]) => t);
}

// ---------------------------------------------------------------------------
// Shimmer skeleton
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// M3 Bottom Sheet
// ---------------------------------------------------------------------------
function BottomSheet({ project, onClose }: { project: Project; onClose: () => void }) {
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 300], [1, 0]);
  const scrimOpacity = useTransform(y, [0, 300], [0.5, 0]);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while sheet is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleDragEnd = useCallback((_: unknown, info: { offset: { y: number }; velocity: { y: number } }) => {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
    else y.set(0);
  }, [onClose, y]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        {/* Scrim */}
        <motion.div
          style={{ opacity: scrimOpacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 bg-black"
          onClick={onClose}
        />

        {/* Sheet */}
        <motion.div
          ref={sheetRef}
          style={{ y, opacity }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 40 }}
          drag="y"
          dragControls={dragControls}
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.3 }}
          onDragEnd={handleDragEnd}
          className="relative z-10 flex max-h-[82vh] flex-col rounded-t-[28px] bg-[hsl(var(--m3-surface))] shadow-2xl"
        >
          {/* Drag handle */}
          <div
            className="flex cursor-grab items-center justify-center pb-2 pt-3 active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <div className="h-1 w-10 rounded-full bg-[hsl(var(--m3-outline-var))]" />
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto overscroll-contain px-5 pb-10 pt-1">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                {project.featured && (
                  <span
                    className="mb-2 inline-block rounded-full px-2.5 py-0.5 font-body text-[10px] font-semibold"
                    style={{
                      backgroundColor: "hsl(var(--m3-primary-container))",
                      color: "hsl(var(--m3-on-primary-container))",
                    }}
                  >
                    ✦ Featured
                  </span>
                )}
                <h2 className="font-heading text-xl font-bold leading-tight text-[hsl(var(--m3-on-surface))]">
                  {project.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--m3-surface-highest))]"
              >
                <X size={16} className="text-[hsl(var(--m3-on-surface-var))]" />
              </button>
            </div>

            {/* Tech tags */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[hsl(var(--m3-outline-var))] px-2.5 py-0.5 font-body text-[10px] text-[hsl(var(--m3-on-surface-var))]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Full description */}
            <p className="mt-4 font-body text-sm leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
              {project.description}
            </p>

            {/* All metrics */}
            {project.metrics.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 font-body text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
                  Key Metrics
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-full px-3 py-1 font-body text-xs font-medium"
                      style={{
                        backgroundColor: "hsl(var(--m3-primary-container))",
                        color: "hsl(var(--m3-on-primary-container))",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(project.github || project.demo) && (
              <div className="mt-6 flex gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-github-${project.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[hsl(var(--m3-outline-var))] py-3 font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]"
                  >
                    <Github size={16} /> Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-demo-${project.id}`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-full py-3 font-body text-sm font-semibold"
                    style={{
                      backgroundColor: "hsl(var(--primary))",
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    <ExternalLink size={16} /> Live Demo
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ---------------------------------------------------------------------------
// Project card — tappable, opens sheet
// ---------------------------------------------------------------------------
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.28, ease: emphasized, delay: i * 0.055 },
  }),
  exit: { opacity: 0, y: 8, transition: { duration: 0.18 } },
};

function ProjectCard({
  project, index, onTap,
}: { project: Project; index: number; onTap: (p: Project) => void }) {
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
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onTap(project)}
        className={[
          "relative flex w-full flex-col rounded-[24px] p-5 text-left transition-shadow",
          isFeatured
            ? "bg-[hsl(var(--m3-surface-high))] shadow-md shadow-black/5"
            : "bg-[hsl(var(--m3-surface-low))]",
        ].join(" ")}
        style={isFeatured ? { borderLeft: "3px solid hsl(var(--primary))" } : undefined}
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

        {/* Tags — first 4 only */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[hsl(var(--m3-outline-var))] px-2.5 py-0.5 font-body text-[10px] text-[hsl(var(--m3-on-surface-var))]"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 4 && (
            <span className="rounded-full border border-[hsl(var(--m3-outline-var))] px-2.5 py-0.5 font-body text-[10px] text-[hsl(var(--m3-on-surface-var))]">
              +{project.tags.length - 4}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 font-heading text-[0.95rem] font-bold leading-snug text-[hsl(var(--m3-on-surface))]">
          {project.title}
        </h3>

        {/* Description — 2 lines, tap for more */}
        <p className="mt-1.5 line-clamp-2 font-body text-xs leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
          {project.description}
        </p>

        {/* Metrics — first 2 */}
        {project.metrics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.metrics.slice(0, 2).map((m) => (
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
            {project.metrics.length > 2 && (
              <span className="rounded-full border border-[hsl(var(--m3-outline-var))] px-2.5 py-0.5 font-body text-[10px] text-[hsl(var(--m3-on-surface-var))]">
                +{project.metrics.length - 2} more
              </span>
            )}
          </div>
        )}

        {/* Tap hint */}
        <p className="mt-3 font-body text-[10px] text-[hsl(var(--m3-outline))]">
          Tap for details
        </p>
      </motion.button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MobileProjects() {
  const [activeTag,  setActiveTag]  = useState<string | null>(null);
  const [selected,   setSelected]   = useState<Project | null>(null);
  const [ready,      setReady]      = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);
  const topTags  = useMemo(() => getTopTags(12), []);

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

        {/* Filter chips — sticky */}
        <div className="sticky top-0 z-10 bg-[hsl(var(--m3-surface))]/95 backdrop-blur-sm pt-3 pb-2">
          <div
            ref={chipsRef}
            className="flex gap-2 overflow-x-auto px-4 scrollbar-none"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <button
              onClick={() => setActiveTag(null)}
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
                onClick={() => setActiveTag((prev) => prev === tag ? null : tag)}
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
        <div className="px-4 pb-1 pt-3">
          <p className="font-body text-[11px] text-[hsl(var(--m3-on-surface-var))]">
            {activeTag
              ? `${filtered.length} project${filtered.length !== 1 ? "s" : ""} with ${activeTag}`
              : `${filtered.length} projects`}
          </p>
        </div>

        {/* Card list */}
        <div className="space-y-3 px-4 pt-1">
          {!ready ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={i}
                  onTap={setSelected}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        {selected && (
          <BottomSheet
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
