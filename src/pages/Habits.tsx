import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import habits from "@/data/habits.json";
import journal from "@/data/journal.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Wrap a string at the last space before maxLen, returning [line1, line2|null]
function wrapLabel(text: string, maxLen = 13): [string, string | null] {
  if (text.length <= maxLen) return [text, null];
  const breakAt = text.lastIndexOf(" ", maxLen);
  if (breakAt <= 0) return [text.slice(0, maxLen), text.slice(maxLen).trim() || null];
  return [text.slice(0, breakAt), text.slice(breakAt + 1) || null];
}

// Custom SVG tick for PolarAngleAxis — renders up to two lines so long labels
// don't overflow the chart container on narrow screens.
interface TickProps {
  x?: number;
  y?: number;
  cx?: number;
  cy?: number;
  payload?: { value: string };
}
function RadarTick({ x = 0, y = 0, cx = 0, cy = 0, payload }: TickProps) {
  if (!payload) return null;
  // Strip the leading emoji + space — decorative at this scale
  const raw = payload.value.replace(/^\S+\s/, "");
  const [line1, line2] = wrapLabel(raw, 13);

  const isLeft = x < cx - 5;
  const isRight = x > cx + 5;
  const anchor = isLeft ? "end" : isRight ? "start" : "middle";
  const lineHeight = 13;
  const offset = line2 ? -(lineHeight / 2) : 0;

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      dominantBaseline="central"
      fill="currentColor"
      fontSize={11}
    >
      <tspan x={x} dy={offset}>{line1}</tspan>
      {line2 && <tspan x={x} dy={lineHeight}>{line2}</tspan>}
    </text>
  );
}

// Get 52 weeks of dates (Sunday-Saturday), ending today
function getWeeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - (52 * 7 - 1));

  for (let w = 0; w < 52; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (w * 7 + d));
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }
  return weeks;
}

// Get 52 weeks of dates ending at the end of the given year (Dec 31)
function getWeeksForYear(year: number): string[][] {
  const weeks: string[][] = [];
  const endDate = new Date(year, 11, 31);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - (52 * 7 - 1));

  for (let w = 0; w < 52; w++) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + (w * 7 + d));
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }
  return weeks;
}

// Get available years for a habit (from current year down to earliest data year)
function getAvailableYears(log: Record<string, boolean>): number[] {
  const currentYear = new Date().getFullYear();
  const years = new Set<number>();
  years.add(currentYear);
  years.add(currentYear - 1);

  Object.keys(log).forEach((date) => {
    const year = new Date(date).getFullYear();
    years.add(year);
  });

  return Array.from(years).sort((a, b) => b - a);
}

// Get month labels for the top row
function getMonthLabels(weeks: string[][]): (string | null)[] {
  const labels: (string | null)[] = [];
  let lastMonth = -1;

  for (let w = 0; w < 52; w++) {
    const date = new Date(weeks[w][0]);
    const month = date.getMonth();
    if (month !== lastMonth) {
      labels.push(MONTH_LABELS[month]);
      lastMonth = month;
    } else {
      labels.push(null);
    }
  }
  return labels;
}

// Calculate stats for a habit log
function calculateStats(log: Record<string, boolean>) {
  const dates = Object.entries(log)
    .filter(([, done]) => done)
    .map(([date]) => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());

  const total = dates.length;

  if (total === 0) {
    return { total: 0, currentStreak: 0, longestStreak: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let currentStreak = 0;
  const sortedDates = [...dates].sort((a, b) => b.getTime() - a.getTime());

  if (sortedDates.length > 0) {
    const mostRecent = sortedDates[0];
    mostRecent.setHours(0, 0, 0, 0);

    if (mostRecent.getTime() === today.getTime() || mostRecent.getTime() === yesterday.getTime()) {
      currentStreak = 1;
      const checkDate = new Date(mostRecent);
      for (let i = 1; i < sortedDates.length; i++) {
        checkDate.setDate(checkDate.getDate() - 1);
        const nextDate = sortedDates[i];
        nextDate.setHours(0, 0, 0, 0);
        if (nextDate.getTime() === checkDate.getTime()) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
  }

  let longestStreak = 1;
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = sortedDates[i - 1];
    const curr = sortedDates[i];
    const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
      longestStreak = Math.max(longestStreak, streak);
    } else {
      streak = 1;
    }
  }

  return { total, currentStreak, longestStreak };
}

function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

function isRecent(dateStr: string): boolean {
  const date = new Date(dateStr);
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return date >= thirtyDaysAgo;
}

export default function Habits() {
  const weeks = useMemo(() => getWeeks(), []);
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks]);
  const journalLog = useMemo(() => Object.fromEntries(journal.map((e) => [e.date, true])), []);

  const [selectedYears, setSelectedYears] = useState<Record<string, number>>(() =>
    Object.fromEntries(habits.map((h) => [h.habit, new Date().getFullYear()]))
  );

  const radarData = useMemo(() => {
    const today = new Date();
    return habits.map((habit) => {
      const log = habit.habit === "Journal entry"
        ? { ...habit.log, ...journalLog }
        : (habit.log as Record<string, boolean>);
      let count = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().split("T")[0];
        if (log[key]) count++;
      }
      return {
        habit: `${habit.emoji} ${habit.habit}`,
        score: Math.round((count / 30) * 100),
      };
    }).sort((a, b) => b.score - a.score);
  }, [journalLog]);

  return (
    <PageTransition>
      <SEO title="Habits" description="Mubashir Rehman's daily habit tracker — GitHub-style contribution grids for coding, reading, exercise, and personal routines." />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Habit Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Systems beat motivation. Update via <code className="rounded border border-border bg-secondary px-1 text-xs">habits.json</code>.
        </p>

        {/* Radar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <p className="mb-3 text-sm text-muted-foreground">Habit Balance — last 30 days</p>
          <Card>
            <CardContent className="p-2 sm:p-4">
              {/*
                outerRadius="52%" shrinks the data polygon so PolarAngleAxis
                labels (which sit outside it) have room on narrow screens.
                margin adds extra breathing room on all four sides.
              */}
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <RadarChart
                    data={radarData}
                    outerRadius="52%"
                    margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                  >
                    <PolarGrid stroke="currentColor" className="opacity-20" />
                    <PolarAngleAxis
                      dataKey="habit"
                      tick={(props: TickProps) => <RadarTick {...props} />}
                    />
                    <Radar
                      dataKey="score"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.25}
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 space-y-10">
          {habits.map((habit, hi) => {
            const log = habit.habit === "Journal entry"
              ? { ...habit.log, ...journalLog }
              : (habit.log as Record<string, boolean>);
            const stats = calculateStats(log);
            const hasData = stats.total > 0;
            const selectedYear = selectedYears[habit.habit];
            const habitWeeks = selectedYear === new Date().getFullYear()
              ? getWeeks()
              : getWeeksForYear(selectedYear);
            const habitMonthLabels = getMonthLabels(habitWeeks);

            return (
              <motion.div
                key={habit.habit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: hi * 0.08 }}
                data-testid={`card-habit-${hi}`}
              >
                <div className="mb-3">
                  <h3 className="text-lg font-semibold">
                    <span className="mr-2">{habit.emoji}</span>
                    {habit.habit}
                  </h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {hasData ? (
                      <span>
                        <span className="font-medium text-primary">{stats.total}</span> completions
                        {stats.currentStreak > 0 && (
                          <>
                            {" · "}🔥{" "}
                            <span className="font-medium text-primary">{stats.currentStreak}</span> day streak
                          </>
                        )}
                        {" · "}best: <span className="font-medium text-primary">{stats.longestStreak}</span> days
                      </span>
                    ) : (
                      <span>No data yet — start tracking in habits.json</span>
                    )}
                  </div>
                </div>

                <Card>
                  <CardContent className="flex gap-0 p-0 overflow-hidden">
                    {/*
                      min-w-0 is required: without it a flex child ignores
                      overflow-x-auto and expands to its intrinsic scroll width,
                      pushing the year selector off-screen on mobile.
                    */}
                    <div className="flex-1 min-w-0 overflow-x-auto p-3">
                      <div className="inline-flex">
                        {/* Day labels */}
                        <div className="mr-2 flex flex-col gap-[3px] pt-5">
                          {DAY_LABELS.map((label, i) => (
                            <div key={label} className="h-3 text-[10px] text-muted-foreground">
                              {i === 1 || i === 3 || i === 5 ? label : ""}
                            </div>
                          ))}
                        </div>

                        {/* Grid + month labels */}
                        <div>
                          <div className="mb-1 flex gap-[3px]">
                            {habitMonthLabels.map((label, i) => (
                              <div key={i} className="w-3 text-[10px] text-muted-foreground">
                                {label}
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-[3px]">
                            {habitWeeks.map((week, wi) => (
                              <div key={wi} className="flex flex-col gap-[3px]">
                                {week.map((day) => {
                                  const done = log[day];
                                  const today = isToday(day);
                                  const recent = isRecent(day);
                                  let cellClass = "bg-secondary";
                                  if (done) {
                                    cellClass = hasData && recent ? "bg-primary" : "bg-primary/60";
                                  }
                                  return (
                                    <div
                                      key={day}
                                      title={day}
                                      className={`h-3 w-3 rounded-sm ${cellClass}${
                                        today ? " ring-1 ring-primary" : ""
                                      }`}
                                    />
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Year selector */}
                    <div className="flex flex-col items-center justify-center gap-1 border-l border-border px-3 py-3">
                      {getAvailableYears(log).map((year) => (
                        <button
                          key={year}
                          onClick={() => setSelectedYears((prev) => ({ ...prev, [habit.habit]: year }))}
                          className={`text-xs transition-colors ${
                            selectedYears[habit.habit] === year
                              ? "font-medium text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
