import { useState } from "react";
import { motion } from "framer-motion";
import { Gamepad2, Music, BookOpen, Tv } from "lucide-react";
import anime from "@/data/anime.json";
import books from "@/data/books.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const hobbies = [
  { icon: Gamepad2, label: "Gaming", desc: "Story-driven RPGs and competitive FPS" },
  { icon: Music, label: "Music", desc: "Ambient, lo-fi, and film scores" },
  { icon: BookOpen, label: "Reading", desc: "Philosophy, systems thinking, Sufi literature" },
  { icon: Tv, label: "Anime", desc: "See the list below \u2193" },
];

const animeTabs = [
  { key: "watching" as const, label: "Watching" },
  { key: "completed" as const, label: "Completed" },
  { key: "planToWatch" as const, label: "Plan to Watch" },
  { key: "onHold" as const, label: "On Hold" },
  { key: "dropped" as const, label: "Dropped" },
];

const bookTabs = [
  { key: "reading" as const, label: "Reading" },
  { key: "completed" as const, label: "Completed" },
  { key: "onHold" as const, label: "On Hold" },
];

export default function Hobbies() {
  const [animeTab, setAnimeTab] = useState<keyof typeof anime>("watching");
  const [bookTab, setBookTab] = useState<keyof typeof books>("reading");

  return (
    <PageTransition>
      <SEO title="Hobbies" description="What Mubashir Rehman does outside of coding — gaming, music, anime watchlist, and reading philosophy and Sufi literature." />
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-24 sm:px-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Hobbies</h1>
        <p className="mt-2 text-muted-foreground">What I do when I'm not shipping code.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {hobbies.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card data-testid={`card-hobby-${h.label.toLowerCase()}`} className="transition-colors hover:border-primary/30">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 text-primary">
                    <h.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{h.label}</h3>
                    <p className="text-sm text-muted-foreground">{h.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold">Anime List</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {animeTabs.map((t) => (
              <button
                key={t.key}
                data-testid={`button-anime-tab-${t.key}`}
                onClick={() => setAnimeTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  animeTab === t.key
                    ? "border border-primary bg-primary/10 text-primary"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {anime[animeTab].map((title) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardContent className="px-4 py-3">
                    <span className="text-sm" data-testid={`text-anime-${title}`}>{title}</span>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold">Reading List</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {bookTabs.map((t) => (
              <button
                key={t.key}
                data-testid={`button-book-tab-${t.key}`}
                onClick={() => setBookTab(t.key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  bookTab === t.key
                    ? "border border-primary bg-primary/10 text-primary"
                    : "border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className="mt-4 space-y-2">
            {books[bookTab].map((title) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card>
                  <CardContent className="px-4 py-3">
                    <span className="text-sm" data-testid={`text-book-${title}`}>{title}</span>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-bold">Now Playing</h2>
          <Card className="mt-4">
            <CardContent className="flex items-center gap-4 p-5">
              <Music size={24} className="text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Spotify integration coming soon...
                </p>
                <p className="text-xs text-muted-foreground">Connect via Spotify API</p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageTransition>
  );
}
