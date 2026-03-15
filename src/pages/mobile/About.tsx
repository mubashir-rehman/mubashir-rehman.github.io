import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ExternalLink, Briefcase, GraduationCap, BookOpen } from "lucide-react";
import profile from "@/data/profile.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

// ---------------------------------------------------------------------------
// M3 motion tokens
// ---------------------------------------------------------------------------
const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];
const emphasizedDecel = [0.05, 0.7, 0.1, 1.0] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: emphasized, delay },
});

// ---------------------------------------------------------------------------
// Expansion panel — M3 pattern
// ---------------------------------------------------------------------------
function ExpansionPanel({
  title,
  subtitle,
  meta,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle: string;
  meta: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-[20px] bg-[hsl(var(--m3-surface-high))]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-3 px-4 py-4 text-left active:bg-[hsl(var(--m3-on-surface)/0.08)]"
      >
        {/* Left accent dot */}
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: "hsl(var(--primary))" }}
        />

        <div className="flex-1 min-w-0">
          <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">
            {meta}
          </p>
          <h3 className="mt-0.5 font-heading text-[0.95rem] font-bold leading-snug text-[hsl(var(--m3-on-surface))]">
            {title}
          </h3>
          <p className="mt-0.5 font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
            {subtitle}
          </p>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22, ease: emphasized }}
          className="mt-1 shrink-0 text-[hsl(var(--m3-on-surface-var))]"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: emphasizedDecel }}
            className="overflow-hidden"
          >
            <div className="border-t border-[hsl(var(--m3-outline-var))] px-4 pb-4 pt-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MobileAbout() {
  const [bioExpanded, setBioExpanded] = useState(false);

  return (
    <PageTransition>
      <SEO
        title="About"
        description="Mubashir Rehman — Backend Engineer in Lahore, Pakistan. Python, Django, FastAPI, AWS, Docker."
      />

      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-16">
        <div className="mx-auto max-w-lg space-y-3 px-4 pt-5">

          {/* ---------------------------------------------------------------- */}
          {/* Profile header card                                              */}
          {/* ---------------------------------------------------------------- */}
          <motion.div
            {...fadeUp(0)}
            className="rounded-[28px] bg-[hsl(var(--m3-surface-high))] p-5 shadow-sm"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--primary)/0.35)] bg-[hsl(var(--m3-primary-container))] font-heading text-xl font-bold text-[hsl(var(--m3-on-primary-container))]">
                MR
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="font-heading text-xl font-bold leading-tight text-[hsl(var(--m3-on-surface))]">
                  {profile.name}
                </h1>
                <p className="mt-0.5 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
                  {profile.tagline}
                </p>
                <div className="mt-1.5 flex items-center gap-1 font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
                  <MapPin size={11} />
                  {profile.location}
                </div>
              </div>
            </div>

            {/* Availability badge */}
            {profile.available && (
              <div className="mt-3 flex">
                <span
                  className="rounded-full px-3 py-1 font-body text-xs font-semibold"
                  style={{
                    backgroundColor: "hsl(var(--m3-primary-container))",
                    color: "hsl(var(--m3-on-primary-container))",
                  }}
                  data-testid="badge-availability"
                >
                  ✦ {profile.availabilityNote}
                </span>
              </div>
            )}
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Bio card with expand                                             */}
          {/* ---------------------------------------------------------------- */}
          <motion.div
            {...fadeUp(0.06)}
            className="rounded-[20px] bg-[hsl(var(--m3-surface-low))] px-5 py-4"
          >
            <p
              className={[
                "font-body text-sm leading-relaxed text-[hsl(var(--m3-on-surface-var))]",
                !bioExpanded ? "line-clamp-3" : "",
              ].join(" ")}
            >
              {profile.bio}
            </p>
            <button
              onClick={() => setBioExpanded((v) => !v)}
              className="mt-2 font-body text-xs font-semibold text-[hsl(var(--primary))]"
            >
              {bioExpanded ? "Show less" : "Read more"}
            </button>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Skills — horizontal scroll chips per category                   */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.1)} className="space-y-2">
            <p className="px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              Skills
            </p>

            {Object.entries(profile.skills).map(([cat, skills]) => (
              <div
                key={cat}
                className="rounded-[20px] bg-[hsl(var(--m3-surface-high))] px-4 py-3"
              >
                <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--primary))]">
                  {cat}
                </p>
                <div
                  className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="shrink-0 rounded-full border border-[hsl(var(--m3-outline-var))] px-3 py-1 font-body text-[11px] text-[hsl(var(--m3-on-surface))]"
                      data-testid={`badge-skill-${s}`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Publication — promoted above experience                         */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.14)}>
            <p className="mb-2 px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              <BookOpen size={11} className="mr-1 inline" />
              Publication
            </p>

            {profile.publications.map((pub, i) => (
              <div
                key={i}
                className="rounded-[20px] p-5 shadow-sm"
                style={{
                  backgroundColor: "hsl(var(--m3-surface-high))",
                  borderLeft: "3px solid hsl(var(--primary))",
                }}
                data-testid={`card-publication-${i}`}
              >
                <span
                  className="inline-block rounded-full px-2.5 py-0.5 font-body text-[10px] font-semibold"
                  style={{
                    backgroundColor: "hsl(var(--m3-primary-container))",
                    color: "hsl(var(--m3-on-primary-container))",
                  }}
                >
                  {pub.journal.split(" ").slice(-1)[0]} · {pub.date.split(" ").slice(-1)[0]}
                </span>
                <h3 className="mt-2 font-heading text-sm font-bold leading-snug text-[hsl(var(--m3-on-surface))]">
                  {pub.title}
                </h3>
                <p className="mt-1.5 font-body text-[11px] leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
                  {pub.authors.split(";").slice(0, 3).join(" ·")}
                  {pub.authors.split(";").length > 3 ? " · et al." : ""}
                </p>
                <a
                  href={pub.arxiv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-body text-xs font-semibold text-[hsl(var(--primary))]"
                  data-testid={`link-publication-${i}`}
                >
                  <ExternalLink size={12} /> {pub.doi}
                </a>
              </div>
            ))}
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Experience — expansion panels                                   */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.18)} className="space-y-2">
            <p className="px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              <Briefcase size={11} className="mr-1 inline" />
              Experience
            </p>

            {profile.experience.map((exp, i) => (
              <ExpansionPanel
                key={i}
                title={exp.role}
                subtitle={`${exp.company} · ${exp.location}`}
                meta={exp.period}
                defaultOpen={i === 0}
              >
                <ul className="space-y-2">
                  {exp.highlights.map((h, j) => (
                    <li
                      key={j}
                      className="flex gap-2 font-body text-xs leading-relaxed text-[hsl(var(--m3-on-surface-var))]"
                      data-testid={i === 0 ? `card-experience-${i}` : undefined}
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--primary)/0.5)]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </ExpansionPanel>
            ))}
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Education — expansion panels                                    */}
          {/* ---------------------------------------------------------------- */}
          <motion.div {...fadeUp(0.22)} className="space-y-2">
            <p className="px-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              <GraduationCap size={11} className="mr-1 inline" />
              Education
            </p>

            {profile.education.map((edu, i) => (
              <ExpansionPanel
                key={i}
                title={edu.degree}
                subtitle={`${edu.institution} · ${edu.location}`}
                meta={edu.period}
                defaultOpen={false}
              >
                {edu.note && (
                  <span
                    className="inline-block rounded-full px-3 py-1 font-body text-xs font-medium"
                    style={{
                      backgroundColor: "hsl(var(--m3-primary-container))",
                      color: "hsl(var(--m3-on-primary-container))",
                    }}
                    data-testid={`card-education-${i}`}
                  >
                    🎓 {edu.note}
                  </span>
                )}
              </ExpansionPanel>
            ))}
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
