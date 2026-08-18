"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";

interface SnapshotEntry {
  id: string;
  classId: string;
  dayId: string;
  periodId: number;
  teacherSubject?: {
    teacher?: { name: string };
    subject?: { name: string };
  };
}

interface HistoryViewProps {
  historyId: string;
  onBack: () => void;
}

export default function TimetableHistoryView({ historyId, onBack }: HistoryViewProps) {
  const [history, setHistory] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [periods, setPeriods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [snapshot, dayData, periodData] = await Promise.all([
          apiFetch<any>(`/timetable-history/history/${historyId}`),
          apiFetch<any[]>("/day"),
          apiFetch<any[]>("/period"),
        ]);
        setHistory(snapshot);
        setDays(dayData);
        setPeriods(periodData);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load timetable version");
      } finally {
        setLoading(false);
      }
    })();
  }, [historyId]);

  if (loading) return <div className="p-10 text-center text-muted-foreground">Loading timetable version...</div>;
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 p-10">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
      </div>
    );
  }

  const entries: SnapshotEntry[] = Array.isArray(history?.data) ? history.data : [];
  const snapshotDays = entries
    .map((entry: any) => entry.day)
    .filter(Boolean)
    .filter((day: any, index: number, arr: any[]) => arr.findIndex((item) => item.id === day.id) === index);
  const snapshotPeriods = entries
    .map((entry: any) => entry.period)
    .filter(Boolean)
    .filter((period: any, index: number, arr: any[]) => arr.findIndex((item) => item.id === period.id) === index);
  const displayDays = snapshotDays.length ? snapshotDays : days;
  const displayPeriods = snapshotPeriods.length ? snapshotPeriods : periods;

  const sortedDays = [...displayDays].sort((a, b) => {
    const order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return order.indexOf(a.name) - order.indexOf(b.name);
  });
  const sortedPeriods = [...displayPeriods].sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Version {history.version}</h2>
            <p className="text-muted-foreground">{history.class?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(history.generatedAt).toLocaleString()}
        </div>
      </div>

      <Card className="overflow-hidden rounded-[2.5rem] border border-primary/10 bg-card/30 shadow-2xl">
        <div className="overflow-x-auto p-3 md:p-5">
          <table className="w-full min-w-[1000px] border-collapse">
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
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Period {period.number}
                      </span>
                    </div>
                  </td>
                  {sortedDays.map((day) => {
                    const entry = entries.find((e) => e.dayId === day.id && e.periodId === period.id);
                    return (
                      <td key={`${day.id}-${period.id}`} className="min-w-[180px] border-l border-primary/5 p-3">
                        {entry ? (
                          <div className="relative rounded-2xl border border-primary/10 bg-primary/10 p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-bold leading-tight">
                                {entry.teacherSubject?.subject?.name || "Unknown Subject"}
                              </h4>
                              <div className="flex items-center text-[10px] font-medium text-muted-foreground">
                                <span className="mr-1.5"><Clock className="h-3 w-3" /></span>
                                <span className="truncate">{entry.teacherSubject?.teacher?.name || "Unknown Teacher"}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex min-h-[80px] items-center justify-center rounded-2xl border border-dashed border-primary/5">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Free</span>
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
      </Card>
    </div>
  );
}
