import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, PenLine } from "lucide-react";
import journal from "@/data/journal.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Comments from "@/components/Comments";

function JournalList() {
  return (
    <PageTransition>
      <SEO title="Journal" description="Technical writing by Mubashir Rehman — articles on backend engineering, distributed systems, Python, and software architecture." />
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
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      {entry.date}
                    </div>
                    <h2 className="mt-2 font-heading text-xl font-bold">{entry.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{entry.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        {entry.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
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

  return (
    <PageTransition>
      <SEO
        title={entry.title}
        description={entry.excerpt}
        canonicalUrl={`https://mubashir-rehman.github.io/journal/${entry.slug}`}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6">
        <Link
          to="/journal"
          className="mb-8 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          data-testid="link-back-journal"
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar size={12} />
              {entry.date}
            </div>
            <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">{entry.title}</h1>
            <div className="mt-3 flex gap-2">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs font-normal">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-8 border-t border-border pt-8 prose prose-sm max-w-none text-foreground prose-headings:font-heading prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground prose-a:text-primary">
              <ReactMarkdown>{entry.content}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>

        <Comments />
      </article>
    </PageTransition>
  );
}

export { JournalList, JournalEntry };
