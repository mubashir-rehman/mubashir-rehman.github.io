import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import habits from "@/data/habits.json";
import journal from "@/data/journal.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";

const emphasized = [0.2, 0, 0, 1.0] as [number, number, number, number];

const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getDatesInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    days.push(`${year}-${mm}-${dd}`);
  }
  return days;
}

function calculateStats(log: Record<string, boolean>) {
  const dates = Object.entries(log)
    .filter(([, done]) => done)
    .map(([date]) => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  const total = dates.length;
  if (total === 0) return { total: 0, currentStreak: 0, longestStreak: 0 };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);

  let currentStreak = 0;
  const sorted = [...dates];
  if (sorted.length > 0) {
    const mostRecent = new Date(sorted[0]); mostRecent.setHours(0, 0, 0, 0);
    if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      const checkDate = new Date(mostRecent);
      for (let i = 1; i < sorted.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const next = new Date(sorted[i]); next.setHours(0, 0, 0, 0);
        if (next.getTime() === checkDate.getTime()) currentStreak++;
        else break;
      }
    }
  }

  let longestStreak = 1; let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (sorted[i-1].getTime() - sorted[i].getTime()) / 86400000;
    if (diff === 1) { streak++; longestStreak = Math.max(longestStreak, streak); }
    else streak = 1;
  }

  return { total, currentStreak, longestStreak };
}

// ---------------------------------------------------------------------------
// Dot grid — 7 cols × N rows showing days of selected month
// ---------------------------------------------------------------------------
function DotGrid({
  log,
  year,
  month,
}: {
  log: Record<string, boolean>;
  year: number;
  month: number;
}) {
  const days = useMemo(() => getDatesInMonth(year, month), [year, month]);
  const today = new Date().toISOString().split("T")[0];

  // Pad to start on correct weekday (0=Sun)
  const firstDow = new Date(year, month, 1).getDay();
  const padded = [...Array(firstDow).fill(null), ...days];

  const rows: (string | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    rows.push(padded.slice(i, i + 7));
  }

  return (
    <div className="mt-3">
      {/* Day labels */}
      <div className="mb-1 grid grid-cols-7 gap-1">
        {["S","M","T","W","T","F","S"].map((d, i) => (
          <span key={i} className="text-center font-body text-[9px] text-[hsl(var(--m3-on-surface-var))]">
            {d}
          </span>
        ))}
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className="mb-1 grid grid-cols-7 gap-1">
          {row.map((date, di) => {
            if (!date) return <span key={di} />;
            const done = log[date];
            const isToday = date === today;
            const isFuture = date > today;
            return (
              <span
                key={date}
                className="aspect-square rounded-md"
                style={{
                  backgroundColor: done
                    ? "hsl(var(--primary))"
                    : isFuture
                    ? "hsl(var(--m3-surface-highest))"
                    : "hsl(var(--m3-surface-highest))",
                  opacity: isFuture ? 0.3 : 1,
                  outline: isToday ? "2px solid hsl(var(--primary))" : undefined,
                  outlineOffset: "1px",
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Streak card
// ---------------------------------------------------------------------------
function StreakCard({
  habit,
  year,
  month,
  index,
}: {
  habit: typeof habits[0];
  year: number;
  month: number;
  index: number;
}) {
  // Merge journal dates for Journal entry habit
  const effectiveLog = useMemo(() => {
    const log = { ...habit.log } as Record<string, boolean>;
    if (habit.habit === "Journal entry") {
      journal.forEach((e) => { log[e.date] = true; });
    }
    return log;
  }, [habit]);

  const stats = useMemo(() => calculateStats(effectiveLog), [effectiveLog]);

  // Completions in selected month
  const monthCompletions = useMemo(() => {
    const days = getDatesInMonth(year, month);
    return days.filter((d) => effectiveLog[d]).length;
  }, [effectiveLog, year, month]);

  const hasData = stats.total > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: emphasized, delay: index * 0.06 }}
      className="rounded-[24px] bg-[hsl(var(--m3-surface-high))] p-5 shadow-sm"
    >
      {/* Habit name + emoji */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{habit.emoji}</span>
          <h3 className="font-body text-sm font-semibold text-[hsl(var(--m3-on-surface))]">
            {habit.habit}
          </h3>
        </div>
        {/* Month completions badge */}
        <span
          className="rounded-full px-2.5 py-0.5 font-body text-[10px] font-semibold"
          style={{
            backgroundColor: monthCompletions > 0
              ? "hsl(var(--m3-primary-container))"
              : "hsl(var(--m3-surface-highest))",
            color: monthCompletions > 0
              ? "hsl(var(--m3-on-primary-container))"
              : "hsl(var(--m3-on-surface-var))",
          }}
        >
          {monthCompletions}/{getDatesInMonth(year, month).length}
        </span>
      </div>

      {!hasData ? (
        <p className="mt-3 font-body text-xs text-[hsl(var(--m3-on-surface-var))]">
          No data yet — start tracking!
        </p>
      ) : (
        <>
          {/* Stats row */}
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { label: "Current", value: stats.currentStreak, unit: "day streak" },
              { label: "Longest", value: stats.longestStreak, unit: "day streak" },
              { label: "Total",   value: stats.total,         unit: "completions" },
            ].map(({ label, value, unit }) => (
              <div
                key={label}
                className="rounded-[14px] px-3 py-2.5 text-center"
                style={{ backgroundColor: "hsl(var(--m3-surface-highest))" }}
              >
                <p
                  className="font-heading text-lg font-bold"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {value}
                </p>
                <p className="font-body text-[9px] leading-tight text-[hsl(var(--m3-on-surface-var))]">
                  {unit}
                </p>
              </div>
            ))}
          </div>

          {/* Dot grid for selected month */}
          <DotGrid log={effectiveLog} year={year} month={month} />
        </>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Radar chart tick (reused from desktop)
// ---------------------------------------------------------------------------
interface TickProps { x?: number; y?: number; cx?: number; cy?: number; payload?: { value: string }; }
function RadarTick({ x = 0, y = 0, cx = 0, cy = 0, payload }: TickProps) {
  if (!payload) return null;
  const raw = payload.value.replace(/^\S+\s/, "");
  const words = raw.split(" ");
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ") || null;
  const anchor = x < cx - 5 ? "end" : x > cx + 5 ? "start" : "middle";
  return (
    <text x={x} y={y} textAnchor={anchor} dominantBaseline="central" fill="currentColor" fontSize={10}>
      <tspan x={x} dy={line2 ? -6 : 0}>{line1}</tspan>
      {line2 && <tspan x={x} dy={13}>{line2}</tspan>}
    </text>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MobileHabits() {
  const today = new Date();
  const currentYear  = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedYear,  setSelectedYear]  = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Available years: current + last 2
  const years = [currentYear - 1, currentYear];

  // Only show habits that have any data at all
  const habitsWithData = useMemo(() => {
    return habits.filter((h) => {
      const log = { ...h.log } as Record<string, boolean>;
      if (h.habit === "Journal entry") journal.forEach((e) => { log[e.date] = true; });
      return Object.values(log).some(Boolean);
    });
  }, []);

  // Radar data — last 30 days completion % per habit
  const radarData = useMemo(() => {
    const thirtyAgo = new Date();
    thirtyAgo.setDate(thirtyAgo.getDate() - 30);
    const days30 = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(thirtyAgo);
      d.setDate(thirtyAgo.getDate() + i);
      return d.toISOString().split("T")[0];
    });
    return habits.map((h) => {
      const log = { ...h.log } as Record<string, boolean>;
      if (h.habit === "Journal entry") journal.forEach((e) => { log[e.date] = true; });
      const done = days30.filter((d) => log[d]).length;
      return { subject: `${h.emoji} ${h.habit}`, value: Math.round((done / 30) * 100) };
    }).sort((a, b) => b.value - a.value);
  }, []);

  return (
    <PageTransition>
      <SEO title="Habits" description="Mubashir Rehman's habit tracker — daily consistency across reading, exercise, deep work, and more." />

      <div className="min-h-screen bg-[hsl(var(--m3-surface))] pb-28 pt-4">
        <div className="mx-auto max-w-lg px-4 pt-5">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, ease: emphasized }}
            className="mb-4"
          >
            <h1 className="font-heading text-2xl font-bold text-[hsl(var(--m3-on-surface))]">
              Habit Tracker
            </h1>
            <p className="mt-0.5 font-body text-sm text-[hsl(var(--m3-on-surface-var))]">
              Systems beat motivation.
            </p>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Year filter pills                                                */}
          {/* ---------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: emphasized, delay: 0.05 }}
            className="mb-3 flex gap-2"
          >
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setSelectedYear(y)}
                className={[
                  "rounded-full border px-4 py-1.5 font-body text-xs font-semibold transition-all",
                  selectedYear === y
                    ? "border-[hsl(var(--primary))] bg-[hsl(var(--m3-primary-container))] text-[hsl(var(--m3-on-primary-container))]"
                    : "border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface-high))] text-[hsl(var(--m3-on-surface-var))]",
                ].join(" ")}
              >
                {y}
              </button>
            ))}
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Month filter pills — horizontal scroll                          */}
          {/* ---------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: emphasized, delay: 0.08 }}
            className="mb-5"
          >
            <div
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {MONTH_NAMES.map((name, i) => {
                // Disable future months in current year
                const isFuture = selectedYear === currentYear && i > currentMonth;
                return (
                  <button
                    key={name}
                    onClick={() => !isFuture && setSelectedMonth(i)}
                    disabled={isFuture}
                    className={[
                      "shrink-0 rounded-full border px-3 py-1.5 font-body text-xs font-medium transition-all",
                      selectedMonth === i && selectedYear <= currentYear && !isFuture
                        ? "border-[hsl(var(--primary))] bg-[hsl(var(--m3-primary-container))] text-[hsl(var(--m3-on-primary-container))]"
                        : isFuture
                        ? "border-[hsl(var(--m3-outline-var))] bg-transparent text-[hsl(var(--m3-on-surface-var))] opacity-30 cursor-not-allowed"
                        : "border-[hsl(var(--m3-outline-var))] bg-[hsl(var(--m3-surface-high))] text-[hsl(var(--m3-on-surface-var))]",
                    ].join(" ")}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Radar chart overview                                            */}
          {/* ---------------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: emphasized, delay: 0.1 }}
            className="mb-4 rounded-[24px] bg-[hsl(var(--m3-surface-high))] p-4 shadow-sm"
          >
            <p className="mb-1 font-body text-xs font-semibold uppercase tracking-widest text-[hsl(var(--m3-on-surface-var))]">
              Balance — last 30 days
            </p>
            <div className="h-52 text-[hsl(var(--m3-on-surface-var))]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 16, right: 24, bottom: 16, left: 24 }}>
                  <PolarGrid stroke="hsl(var(--m3-outline-var))" />
                  <PolarAngleAxis dataKey="subject" tick={<RadarTick />} />
                  <Radar
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.18}
                    strokeWidth={1.5}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* ---------------------------------------------------------------- */}
          {/* Streak cards — habits with data first, empty below              */}
          {/* ---------------------------------------------------------------- */}
          <AnimatePresence mode="wait">
            <div key={`${selectedYear}-${selectedMonth}`} className="space-y-3">
              {habitsWithData.map((habit, i) => (
                <StreakCard
                  key={habit.habit}
                  habit={habit}
                  year={selectedYear}
                  month={selectedMonth}
                  index={i}
                />
              ))}

              {/* Empty habits — minimal */}
              {habits
                .filter((h) => !habitsWithData.includes(h))
                .map((habit, i) => (
                  <StreakCard
                    key={habit.habit}
                    habit={habit}
                    year={selectedYear}
                    month={selectedMonth}
                    index={habitsWithData.length + i}
                  />
                ))}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
