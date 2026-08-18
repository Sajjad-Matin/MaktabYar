"use client";

import React, { forwardRef } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

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

function createTeacherColorMap(entries: any[]) {
  const cache = new Map<string, string>();
  const used = new Set<string>();
  const names = [...new Set(entries.map((entry) => String(entry.teacherSubject?.teacher?.name || "").trim().toLowerCase()).filter(Boolean))];

  names.forEach((normalizedName) => {
    let hash = 5381;
    for (let i = 0; i < normalizedName.length; i++) {
      hash = ((hash << 5) + hash) + normalizedName.charCodeAt(i);
    }

    let index = Math.abs(hash) % COLORS.length;
    while (used.has(COLORS[index])) {
      index = (index + 1) % COLORS.length;
    }

    cache.set(normalizedName, COLORS[index]);
    used.add(COLORS[index]);
  });

  return cache;
}

export const TimetableExportDocument = forwardRef<HTMLDivElement, {
  classData: any;
  timetable: any[];
  days: any[];
  periods: any[];
}>(({ classData, timetable, days, periods }, ref) => {
  const sortedDays = [...days].sort((a, b) => {
    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
  const sortedPeriods = [...periods].sort((a, b) => a.number - b.number);
  const entries = timetable.filter((e) => e.classId === classData.id);
  const teacherColors = createTeacherColorMap(entries);

  return (
    <div ref={ref} className="w-[1200px] bg-background p-8 text-foreground">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-primary">TimeTable Generator</div>
        <h2 className="mt-1 text-3xl font-bold">{classData.name}</h2>
      </div>

      <div className="overflow-hidden rounded-[2.5rem] border border-primary/10 bg-card/30 shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-primary/10">
              <th className="w-40 bg-primary/5 p-6 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Time / Day
              </th>
              {sortedDays.map((day) => (
                <th key={day.id} className="border-l border-primary/10 p-6 text-center text-xs font-bold uppercase tracking-widest">
                  {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPeriods.map((period) => (
              <tr key={period.id} className="border-b border-primary/5 last:border-0">
                <td className="bg-primary/5 p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Period {period.number}
                  </span>
                </td>
                {sortedDays.map((day) => {
                  const entry = entries.find((e) => e.dayId === day.id && e.periodId === period.id);
                  const color = entry ? (teacherColors.get(String(entry.teacherSubject?.teacher?.name || "").trim().toLowerCase()) || COLORS[0]) : "";
                  return (
                    <td key={`${day.id}-${period.id}`} className="min-w-[180px] border-l border-primary/5 p-3">
                      {entry ? (
                        <div className={cn("relative rounded-2xl border p-4", color)}>
                          <div className="space-y-2">
                            <h4 className="text-sm font-bold leading-tight">
                              {entry.teacherSubject?.subject?.name}
                            </h4>
                            <div className="flex items-center text-[10px] font-medium opacity-80">
                              <User className="mr-1.5 h-3 w-3" />
                              <span className="truncate">{entry.teacherSubject?.teacher?.name}</span>
                            </div>
                          </div>
                        </div>
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
});

TimetableExportDocument.displayName = "TimetableExportDocument";
