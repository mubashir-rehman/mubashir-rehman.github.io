import { useMemo } from "react";
import { motion } from "framer-motion";
import habits from "@/data/habits.json";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";

function getWeeks(): string[][] {
  const weeks: string[][] = [];
  const today = new Date();
  for (let w = 51; w >= 0; w--) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (w * 7 + (6 - d)));
      week.push(date.toISOString().split("T")[0]);
    }
    weeks.push(week);
  }
  return weeks;
}

export default function Habits() {
  const weeks = useMemo(() => getWeeks(), []);

  return (
    <PageTransition>
      <SEO title="Habits" description="Tracking daily habits with a GitHub-style contribution grid." />
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Habit Tracker</h1>
        <p className="mt-2 text-muted-foreground">
          Systems beat motivation. Update via <code className="rounded border border-border bg-secondary px-1 text-xs">habits.json</code>.
        </p>

        <div className="mt-8 space-y-10">
          {habits.map((habit, hi) => (
            <motion.div
              key={habit.habit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: hi * 0.08 }}
              data-testid={`card-habit-${hi}`}
            >
              <h3 className="mb-3 text-lg font-semibold">
                <span className="mr-2">{habit.emoji}</span>
                {habit.habit}
              </h3>
              <Card>
                <CardContent className="overflow-x-auto p-3">
                  <div className="flex gap-[3px]">
                    {weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[3px]">
                        {week.map((day) => {
                          const done = (habit.log as Record<string, boolean>)[day];
                          return (
                            <div
                              key={day}
                              title={day}
                              className={`h-3 w-3 rounded-sm ${
                                done
                                  ? "bg-primary"
                                  : "bg-secondary"
                              }`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
