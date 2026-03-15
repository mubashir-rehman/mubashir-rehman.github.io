import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import journal from "@/data/journal.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import Comments from "@/components/Comments";

const SITE_URL = "https://mubashir-rehman.github.io";
const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];

function readingTime(content: string): number {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.26, ease: emphasized, delay },
});

// ---------------------------------------------------------------------------
// Journal List
// ---------------------------------------------------------------------------
export function MobileJournalList() {
  return (
    <PageTransition>
      <SEO
        title="Journal"
        description="Technical writing by Mubashir Rehman — articles on backend engineering, distributed systems, Python, and software architecture."
      />
      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-4">
        <div className="mx-auto max-w-lg px-4 pt-5">

          {/* Header */}
          <motion.div {...fadeUp(0)} className="mb-5">
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--m3-on-surface))]">
              Journal
            </h1>
            <p className="mt-0.5 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
              Thinking out loud about engineering and life.
            </p>
          </motion.div>

          {/* Entry cards */}
          <div className="space-y-3">
            {journal.map((entry, i) => (
              <motion.div key={entry.slug} {...fadeUp(i * 0.07)}>
                <Link
                  to={`/journal/${entry.slug}`}
                  data-testid={`link-journal-${entry.slug}`}
                >
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="rounded-[24px] bg-[hsl(var(--m3-surface-high))] p-5 shadow-sm active:bg-[hsl(var(--m3-surface-highest))]"
                  >
                    {/* Meta row */}
                    <div className="flex items-center gap-3 font-body text-[11px] text-[hsl(var(--m3-on-surface-var))]">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDateShort(entry.date)}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-[hsl(var(--m3-outline))]" />
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {readingTime(entry.content)} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-2 font-heading text-[1.05rem] font-bold leading-snug text-[hsl(var(--m3-on-surface))]">
                      {entry.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="mt-1.5 line-clamp-2 font-body text-xs leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
                      {entry.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
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
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

          {journal.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-3 text-center">
              <p className="font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
                No entries yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

// ---------------------------------------------------------------------------
// Journal Entry
// ---------------------------------------------------------------------------
export function MobileJournalEntry() {
  const { slug } = useParams();
  const entry = journal.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center">
          <p className="font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
            Entry not found.
          </p>
        </div>
      </PageTransition>
    );
  }

  const mins = readingTime(entry.content);
  const entryUrl = `${SITE_URL}/journal/${entry.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.excerpt,
    datePublished: entry.date,
    url: entryUrl,
    author: { "@type": "Person", name: "Mubashir Rehman" },
  };

  return (
    <PageTransition>
      <SEO
        title={entry.title}
        description={entry.excerpt}
        schema={articleSchema}
      />

      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-4">
        <div className="mx-auto max-w-lg px-4 pt-4">

          {/* Back button */}
          <Link
            to="/journal"
            data-testid="link-back-journal"
            className="inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--m3-outline-var))] px-3 py-1.5 font-body text-xs font-medium text-[hsl(var(--m3-on-surface-var))]"
          >
            <ArrowLeft size={13} /> Journal
          </Link>

          {/* Article header */}
          <header className="mt-5">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
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
            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-[hsl(var(--m3-on-surface))]">
              {entry.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-2 font-body text-sm leading-relaxed text-[hsl(var(--m3-on-surface-var))]">
              {entry.excerpt}
            </p>

            {/* Meta */}
            <div className="mt-3 flex items-center gap-3 font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                <time dateTime={entry.date}>{formatDate(entry.date)}</time>
              </span>
              <span className="h-1 w-1 rounded-full bg-[hsl(var(--m3-outline))]" />
              <span className="flex items-center gap-1">
                <Clock size={12} /> {mins} min read
              </span>
            </div>

            <hr className="mt-4 border-[hsl(var(--m3-outline-var))]" />
          </header>

          {/* Article body */}
          <div
            className="prose prose-sm mt-6 max-w-none font-body
              prose-headings:font-heading prose-headings:tracking-tight
              prose-h2:mt-8 prose-h2:text-xl prose-h2:font-bold
              prose-h3:mt-6 prose-h3:text-lg prose-h3:font-semibold
              prose-p:leading-7 prose-p:text-[hsl(var(--m3-on-surface-var))]
              prose-blockquote:not-italic prose-blockquote:border-l-2
              prose-blockquote:border-[hsl(var(--primary))] prose-blockquote:pl-4
              prose-blockquote:text-[hsl(var(--m3-on-surface-var))]
              prose-strong:font-semibold prose-strong:text-[hsl(var(--m3-on-surface))]
              prose-a:no-underline prose-a:font-medium prose-a:text-[hsl(var(--primary))]
              prose-li:leading-7 prose-li:text-[hsl(var(--m3-on-surface-var))]
              prose-hr:border-[hsl(var(--m3-outline-var))]
              prose-code:rounded-lg prose-code:bg-[hsl(var(--m3-surface-highest))]
              prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs
              prose-code:before:content-none prose-code:after:content-none
            "
          >
            <ReactMarkdown>{entry.content}</ReactMarkdown>
          </div>

          {/* Comments */}
          <div className="mt-12 border-t border-[hsl(var(--m3-outline-var))] pt-8">
            <Comments />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
