"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  MapPin,
  User,
  BookOpen,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useTimetable } from "@/hooks/timetable/use-timetable";
import { useDay } from "@/hooks/day/use-day";
import { usePeriod } from "@/hooks/period/use-period";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimetableGridProps {
  classId: string;
}

export function TimetableGrid({ classId }: TimetableGridProps) {
  const {
    timetable,
    loading: timetableLoading,
    deleteTimetableEntry,
    moveTimetableEntry,
  } = useTimetable();
  const { days, loading: daysLoading } = useDay();
  const { periods, loading: periodsLoading } = usePeriod();

  const loading = timetableLoading || daysLoading || periodsLoading;

  const [draggedEntryId, setDraggedEntryId] = React.useState<string | null>(
    null,
  );

  const [dragOverSlot, setDragOverSlot] = React.useState<{
    dayId: string;
    periodId: number;
  } | null>(null);

  const [movingEntryId, setMovingEntryId] = React.useState<string | null>(null);

  // Color mapping for teachers - using cache to ensure uniqueness
  const teacherColorCache = React.useRef<Map<string, string>>(new Map());
  const usedColors = React.useRef<Set<string>>(new Set());

  const getTeacherColor = (teacherName: string) => {
    const colors = [
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
    
    // Normalize teacher name
    const normalizedName = teacherName.trim().toLowerCase();
    
    // Check cache first
    if (teacherColorCache.current.has(normalizedName)) {
      return teacherColorCache.current.get(normalizedName)!;
    }
    
    // Use hash to get initial color
    let hash = 5381;
    for (let i = 0; i < normalizedName.length; i++) {
      hash = ((hash << 5) + hash) + normalizedName.charCodeAt(i);
    }
    let colorIndex = Math.abs(hash) % colors.length;
    
    // If color is already used, find next available
    while (usedColors.current.has(colors[colorIndex])) {
      colorIndex = (colorIndex + 1) % colors.length;
    }
    
    // Assign and cache the color
    const assignedColor = colors[colorIndex];
    teacherColorCache.current.set(normalizedName, assignedColor);
    usedColors.current.add(assignedColor);
    
    return assignedColor;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-64 rounded-[2rem] bg-primary/5 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!classId) {
    return (
      <Card className="flex flex-col items-center justify-center py-20 text-center rounded-[2rem] border-dashed border-2 border-primary/10 bg-transparent">
        <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
          <CalendarIcon className="h-10 w-10 text-primary/20" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">
          No Class Selected
        </h3>
        <p className="text-muted-foreground max-w-xs">
          Please select a class group from the dropdown above to view its weekly
          schedule.
        </p>
      </Card>
    );
  }

  const classEntries = timetable.filter((entry) => entry.classId === classId);

  // Sort days and periods
  const sortedDays = [...days].sort((a, b) => {
    const order = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
  const sortedPeriods = [...periods].sort((a, b) => a.number - b.number);

  return (
    <div className="overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="min-w-[1000px] bg-card/30 backdrop-blur-xl rounded-[2.5rem] border border-primary/10 overflow-hidden shadow-2xl">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-primary/10">
              <th className="p-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-widest bg-primary/5 w-40">
                Time / Day
              </th>
              {sortedDays.map((day) => (
                <th
                  key={day.id}
                  className="p-6 text-center text-xs font-bold text-foreground uppercase tracking-widest border-l border-primary/10"
                >
                  {day.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedPeriods.map((period) => (
              <tr
                key={period.id}
                className="border-b border-primary/5 last:border-0 group"
              >
                <td className="p-6 bg-primary/5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Period {period.number}
                    </span>
                  </div>
                </td>
                {sortedDays.map((day) => {
                  const entry = classEntries.find(
                    (e) => e.dayId === day.id && e.periodId === period.id,
                  );

                  return (
                    <td
                      key={`${day.id}-${period.id}`}
                      className={cn(
                        "p-3 border-l border-primary/5 min-w-[180px] transition-all duration-200",
                        dragOverSlot?.dayId === day.id &&
                          dragOverSlot?.periodId === period.id &&
                          "bg-primary/10",
                      )}
                      onDragOver={(event) => {
                        event.preventDefault();

                        event.dataTransfer.dropEffect = "move";

                        setDragOverSlot({
                          dayId: day.id,
                          periodId: period.id,
                        });
                      }}
                      onDragLeave={() => {
                        setDragOverSlot(null);
                      }}
                      onDrop={async (event) => {
                        event.preventDefault();

                        const entryId =
                          event.dataTransfer.getData("text/plain");

                        if (!entryId) {
                          return;
                        }

                        const entry = classEntries.find(
                          (item) => item.id === entryId,
                        );

                        if (!entry) {
                          return;
                        }

                        /**
                         * Already here.
                         */
                        if (
                          entry.dayId === day.id &&
                          entry.periodId === period.id
                        ) {
                          setDragOverSlot(null);
                          return;
                        }

                        try {
                          setMovingEntryId(entryId);

                          await moveTimetableEntry(entryId, {
                            dayId: day.id,
                            periodId: period.id,
                          });
                        } catch (error) {
                          console.error(
                            "Failed to move timetable entry:",
                            error,
                          );

                          const message =
                            error instanceof Error
                              ? error.message
                              : "Failed to move lesson.";

                          toast.error(message);
                        } finally {
                          setMovingEntryId(null);
                          setDraggedEntryId(null);
                          setDragOverSlot(null);
                        }
                      }}
                    >
                      {entry ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", entry.id);

                            setDraggedEntryId(entry.id);
                          }}
                          onDragEnd={() => {
                            setDraggedEntryId(null);
                            setDragOverSlot(null);
                          }}
                          className={cn(
                            "relative p-4 rounded-2xl border transition-all duration-300 group/item cursor-grab active:cursor-grabbing",
                            getTeacherColor(
                              entry.teacherSubject?.teacher?.name || "",
                            ),
                            draggedEntryId === entry.id &&
                              "opacity-40 scale-95",
                          )}
                          animate={{
                            opacity: movingEntryId === entry.id ? 0.5 : 1,
                            scale: movingEntryId === entry.id ? 0.97 : 1,
                          }}
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-bold text-sm leading-tight">
                                {entry.teacherSubject?.subject?.name}
                              </h4>
                            </div>
                            <div className="flex items-center text-[10px] font-medium opacity-80">
                              <User className="h-3 w-3 mr-1.5" />
                              <span className="truncate">
                                {entry.teacherSubject?.teacher?.name}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full min-h-[80px] flex items-center justify-center rounded-2xl border border-dashed border-primary/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group/empty">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-30 group-hover/empty:opacity-100 transition-opacity">
                            Free
                          </span>
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
