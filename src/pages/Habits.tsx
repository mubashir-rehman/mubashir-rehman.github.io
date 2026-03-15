import { useMemo } from "react";
import { motion } from "framer-motion";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import habits from "@/data/habits.json";
import journal from "@/data/journal.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Get 52 weeks of dates (Sunday-Saturday), ending today
function getWeeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  // Align to Sunday of the current week
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek; // Days since Sunday
  const totalDays = 52 * 7 + mondayOffset;

  for (let w = 51; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (totalDays - (w * 7 + d)));
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }
  return weeks;
}

// Get month labels for the top row
function getMonthLabels(weeks: string[][]): (string | null)[] {
  const labels: (string | null)[] = [];
  let lastMonth = -1;

  for (let w = 0; w < 52; w++) {
    // Use the first day of the week (Sunday) to determine the month
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

  // Current streak - consecutive days ending today or yesterday
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
      let checkDate = new Date(mostRecent);
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

  // Longest streak
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

// Check if a date is today
function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  return dateStr === today;
}

// Check if a date is within the last 30 days
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
    });
  }, [journalLog]);

  return (
    <PageTransition>
      <SEO title="Habits" description="Mubashir Rehman's daily habit tracker — GitHub-style contribution grids for coding, reading, exercise, and personal routines." />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Habit Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Systems beat motivation. Update via <code className="rounded border border-border bg-secondary px-1 text-xs">habits.json</code>.
        </p>

        {/* Radar chart section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8"
        >
          <p className="mb-3 text-sm text-muted-foreground">Habit Balance — last 30 days</p>
          <Card>
            <CardContent className="p-4">
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="currentColor" className="opacity-20" />
                    <PolarAngleAxis
                      dataKey="habit"
                      tick={{ fill: "currentColor", fontSize: 12 }}
                      style={{ color: "hsl(var(--foreground))" }}
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
                  <CardContent className="overflow-x-auto p-3">
                    <div className="inline-flex">
                      {/* Day labels on the left */}
                      <div className="mr-2 flex flex-col gap-[3px] pt-5">
                        {DAY_LABELS.map((label, i) => (
                          <div key={label} className="h-3 text-[10px] text-muted-foreground">
                            {i === 1 || i === 3 || i === 5 ? label : ""}
                          </div>
                        ))}
                      </div>

                      {/* Grid with month labels */}
                      <div>
                        {/* Month labels */}
                        <div className="mb-1 flex gap-[3px]">
                          {monthLabels.map((label, i) => (
                            <div key={i} className="w-3 text-[10px] text-muted-foreground">
                              {label}
                            </div>
                          ))}
                        </div>

                        {/* Contribution grid */}
                        <div className="flex gap-[3px]">
                          {weeks.map((week, wi) => (
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
