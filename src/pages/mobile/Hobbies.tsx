import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Music, BookOpen, Tv } from "lucide-react";
import anime from "@/data/anime.json";
import books from "@/data/books.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.26, ease: emphasized, delay },
});

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const hobbies = [
  { Icon: Gamepad2, label: "Gaming",   desc: "Story-driven RPGs and competitive FPS" },
  { Icon: Music,    label: "Music",    desc: "Ambient, lo-fi, and film scores" },
  { Icon: BookOpen, label: "Reading",  desc: "Philosophy, systems thinking, Sufi literature" },
  { Icon: Tv,       label: "Anime",    desc: "See the list below" },
];

const animeTabs = [
  { key: "watching"    as const, label: "Watching"      },
  { key: "completed"   as const, label: "Completed"     },
  { key: "planToWatch" as const, label: "Plan to Watch" },
  { key: "dropped"     as const, label: "Dropped"       },
];

const bookTabs = [
  { key: "reading"   as const, label: "Reading"   },
  { key: "completed" as const, label: "Completed" },
  { key: "onHold"    as const, label: "On Hold"   },
];

// Top-level toggle
const topTabs = ["Anime", "Books"] as const;
type TopTab = typeof topTabs[number];

// ---------------------------------------------------------------------------
// Chip tabs row
// ---------------------------------------------------------------------------
function ChipTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: T; label: string }[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={[
            "shrink-0 rounded-full border px-4 py-1.5 font-body text-xs font-medium transition-all",
            active === key
              ? "border-[hsl(var(--primary))] bg-[hsl(var(--m3-primary-container))] text-[hsl(var(--m3-on-primary-container))]"
              : "border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface-high))] text-[hsl(var(--m3-on-surface-var))]",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// List item
// ---------------------------------------------------------------------------
function ListItem({ title, index }: { title: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, ease: emphasized, delay: index * 0.04 }}
      className="flex items-center gap-3 rounded-[16px] bg-[hsl(var(--m3-surface-high))] px-4 py-3"
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: "hsl(var(--primary))" }}
      />
      <span className="font-body text-sm text-[hsl(var(--m3-on-surface))]">
        {title}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MobileHobbies() {
  const [topTab, setTopTab] = useState<TopTab>("Anime");
  const [animeTab, setAnimeTab] = useState<keyof typeof anime>("watching");
  const [bookTab, setBookTab] = useState<keyof typeof books>("reading");

  const animeList = anime[animeTab] ?? [];
  const bookList  = books[bookTab]  ?? [];

  return (
    <PageTransition>
      <SEO
        title="Hobbies"
        description="What Mubashir Rehman does outside of coding — gaming, music, anime watchlist, and reading philosophy and Sufi literature."
      />

      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-4">
        <div className="mx-auto max-w-lg space-y-4 px-4 pt-5">

          {/* Header */}
          <motion.div {...fadeUp(0)}>
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--m3-on-surface))]">
              Hobbies
            </h1>
            <p className="mt-0.5 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
              What I do when I'm not shipping code.
            </p>
          </motion.div>

          {/* Hobby tiles — 2×2 compact grid */}
          <motion.div {...fadeUp(0.06)} className="grid grid-cols-2 gap-2">
            {hobbies.map(({ Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-[20px] bg-[hsl(var(--m3-surface-high))] p-4"
                data-testid={`card-hobby-${label.toLowerCase()}`}
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
                >
                  <Icon size={20} style={{ color: "hsl(var(--m3-on-primary-container))" }} />
                </span>
                <p className="mt-2.5 font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]">
                  {label}
                </p>
                <p className="mt-0.5 font-body text-[11px] leading-snug text-[hsl(var(--m3-on-surface-var))]">
                  {desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Now Playing placeholder */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex items-center gap-4 rounded-[20px] bg-[hsl(var(--m3-surface-high))] px-5 py-4"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: "hsl(var(--m3-primary-container))" }}
            >
              <Music size={18} style={{ color: "hsl(var(--m3-on-primary-container))" }} />
            </span>
            <div>
              <p className="font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]">
                Now Playing
              </p>
              <p className="font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
                Spotify integration coming soon…
              </p>
            </div>
          </motion.div>

          {/* Anime / Books unified section */}
          <motion.div {...fadeUp(0.14)} className="space-y-3">
            {/* Top-level toggle */}
            <div className="flex rounded-full border border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface-high))] p-1">
              {topTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTopTab(tab)}
                  className={[
                    "flex-1 rounded-full py-1.5 font-body text-xs font-semibold transition-all",
                    topTab === tab
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "text-[hsl(var(--m3-on-surface-var))]",
                  ].join(" ")}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Anime section */}
            <AnimatePresence mode="wait">
              {topTab === "Anime" && (
                <motion.div
                  key="anime"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: emphasized }}
                  className="space-y-3"
                >
                  <ChipTabs
                    tabs={animeTabs}
                    active={animeTab}
                    onChange={setAnimeTab}
                  />
                  <div className="space-y-2">
                    {animeList.length > 0 ? (
                      animeList.map((title, i) => (
                        <ListItem key={title} title={title} index={i} data-testid={`text-anime-${title}`} />
                      ))
                    ) : (
                      <p className="px-1 font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
                        Nothing here yet.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Books section */}
              {topTab === "Books" && (
                <motion.div
                  key="books"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: emphasized }}
                  className="space-y-3"
                >
                  <ChipTabs
                    tabs={bookTabs}
                    active={bookTab}
                    onChange={setBookTab}
                  />
                  <div className="space-y-2">
                    {bookList.length > 0 ? (
                      bookList.map((title, i) => (
                        <ListItem key={title} title={title} index={i} data-testid={`text-book-${title}`} />
                      ))
                    ) : (
                      <p className="px-1 font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
                        Nothing here yet.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}
