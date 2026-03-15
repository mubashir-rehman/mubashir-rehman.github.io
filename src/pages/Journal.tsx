import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, PenLine } from "lucide-react";
import journal from "@/data/journal.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Comments from "@/components/Comments";

const SITE_URL = "https://mubashir-rehman.github.io";

function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function JournalList() {
  return (
    <PageTransition>
      <SEO
        title="Journal"
        description="Technical writing by Mubashir Rehman — articles on backend engineering, distributed systems, Python, and software architecture."
      />
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 text-primary">
            <PenLine size={20} />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">Journal</h1>
            <p className="text-muted-foreground">Thinking out loud about engineering and life.</p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {journal.map((entry, i) => (
            <motion.div
              key={entry.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/journal/${entry.slug}`} data-testid={`link-journal-${entry.slug}`}>
                <Card className="group transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(entry.date)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} />
                        {readingTime(entry.content)} min read
                      </span>
                    </div>
                    <h2 className="mt-2 font-heading text-xl font-bold">{entry.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.excerpt}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-y-2">
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {journal.length === 0 && (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-center justify-center p-10 text-center">
              <PenLine size={32} className="text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">No entries yet. Check back soon.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}

function JournalEntry() {
  const { slug } = useParams();
  const entry = journal.find((e) => e.slug === slug);

  if (!entry) {
    return (
      <PageTransition>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">Entry not found.</p>
        </div>
      </PageTransition>
    );
  }

  const mins = readingTime(entry.content);
  const wordCount = entry.content.trim().split(/\s+/).length;
  const entryUrl = `${SITE_URL}/journal/${entry.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: entry.title,
    description: entry.excerpt,
    datePublished: entry.date,
    dateModified: entry.date,
    wordCount,
    url: entryUrl,
    image: `${SITE_URL}/og-image.png`,
    inLanguage: "en",
    keywords: entry.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Mubashir Rehman",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Mubashir Rehman",
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "Blog",
      name: "Mubashir Rehman — Journal",
      url: `${SITE_URL}/journal`,
    },
  };

  return (
    <PageTransition>
      <SEO
        title={entry.title}
        description={entry.excerpt}
        canonicalUrl={entryUrl}
        schema={articleSchema}
        articleMeta={{
          publishedTime: entry.date,
          author: "Mubashir Rehman",
          tags: entry.tags,
        }}
      />

      <article className="mx-auto max-w-2xl px-4 pb-24 pt-24 sm:px-6">

        {/* Back link */}
        <Link
          to="/journal"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          data-testid="link-back-journal"
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        {/* Article header */}
        <header className="mt-10">
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {entry.title}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {entry.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} />
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {mins} min read
            </span>
          </div>

          <hr className="mt-8 border-border" />
        </header>

        {/* Article body */}
        <div className="prose prose-base mt-10 max-w-none font-body
          prose-headings:font-heading prose-headings:tracking-tight
          prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-bold
          prose-h3:mt-8 prose-h3:text-xl prose-h3:font-semibold
          prose-p:leading-8
          prose-blockquote:not-italic prose-blockquote:border-l-2 prose-blockquote:border-primary prose-blockquote:pl-5 prose-blockquote:text-muted-foreground
          prose-strong:font-semibold
          prose-a:no-underline prose-a:font-medium hover:prose-a:underline
          prose-li:leading-7
          prose-hr:border-border
          prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
        ">
          <ReactMarkdown>{entry.content}</ReactMarkdown>
        </div>

        {/* Comments */}
        <div className="mt-16 border-t border-border pt-10">
          <Comments />
        </div>

      </article>
    </PageTransition>
  );
}

export { JournalList, JournalEntry };
