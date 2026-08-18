"use client";

import * as React from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import { useTimetable } from "@/hooks/timetable/use-timetable";
import { useDay } from "@/hooks/day/use-day";
import { usePeriod } from "@/hooks/period/use-period";
import { cn } from "@/lib/utils";

interface TeacherTimetableGridProps {
  teacherId: string;
}

const COLORS = [
  "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  "bg-pink-500/20 text-pink-400 border-pink-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "bg-lime-500/20 text-lime-400 border-lime-500/30",
  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
  "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "bg-slate-500/20 text-slate-400 border-slate-500/30",
];

function classColor(name: string) {
  let hash = 5381;
  const value = name.trim().toLowerCase();
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) + hash) + value.charCodeAt(i);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function TeacherTimetableGrid({ teacherId }: TeacherTimetableGridProps) {
  const { timetable, loading: timetableLoading } = useTimetable();
  const { days, loading: daysLoading } = useDay();
  const { periods, loading: periodsLoading } = usePeriod();
  const loading = timetableLoading || daysLoading || periodsLoading;

  if (loading) {
    return <div className="h-96 rounded-[2.5rem] bg-primary/5 animate-pulse" />;
  }

  if (!teacherId) {
    return (
      <div className="rounded-[2rem] border-2 border-dashed border-primary/10 bg-transparent py-20 text-center text-muted-foreground">
        Please select a teacher to view their weekly timetable.
      </div>
    );
  }

  const entries = timetable.filter((entry) => entry.teacherSubject?.teacher?.id === teacherId);
  const sortedDays = [...days].sort((a, b) => {
    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
  const sortedPeriods = [...periods].sort((a, b) => a.number - b.number);

  return (
    <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="min-w-[1000px] overflow-hidden rounded-[2.5rem] border border-primary/10 bg-card/30 shadow-2xl backdrop-blur-xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-primary/10">
              <th className="w-40 bg-primary/5 p-6 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">Time / Day</th>
              {sortedDays.map((day) => (
                <th key={day.id} className="border-l border-primary/10 p-6 text-center text-xs font-bold uppercase tracking-widest">{day.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPeriods.map((period) => (
              <tr key={period.id} className="border-b border-primary/5 last:border-0">
                <td className="bg-primary/5 p-6"><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Period {period.number}</span></td>
                {sortedDays.map((day) => {
                  const entry = entries.find((e) => e.dayId === day.id && e.periodId === period.id);
                  return (
                    <td key={`${day.id}-${period.id}`} className="min-w-[180px] border-l border-primary/5 p-3">
                      {entry ? (
                        <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} className={cn("relative rounded-2xl border p-4", classColor(entry.class?.name || ""))}>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold leading-tight">{entry.teacherSubject?.subject?.name}</h4>
                            <div className="flex items-center text-[10px] font-medium opacity-80">
                              <User className="mr-1.5 h-3 w-3" />
                              <span className="truncate">{entry.class?.name}</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="flex min-h-[80px] items-center justify-center rounded-2xl border border-dashed border-primary/5">
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Free</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
