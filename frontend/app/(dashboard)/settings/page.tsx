"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Sparkles,
  Calendar,
  Clock,
  Trash2,
  Plus,
  Play,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { usePeriod } from "@/hooks/period/use-period";
import { useDay } from "@/hooks/day/use-day";
import { useTimetable } from "@/hooks/timetable/use-timetable";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function SettingsPage() {
  const {
    periods,
    createPeriod,
    deletePeriod,
    loading: periodsLoading,
  } = usePeriod();
  const { days, createDay, deleteDay, loading: daysLoading } = useDay();
  const { generateTimetable, loading: genLoading } = useTimetable();
  const { user, refreshMe } = useAuth();

  const [newPeriodNumber, setNewPeriodNumber] = React.useState("");
  const [newPeriodStart, setNewPeriodStart] = React.useState("");
  const [newPeriodEnd, setNewPeriodEnd] = React.useState("");
  const [newDayName, setNewDayName] = React.useState("");

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPeriodNumber) return;
    try {
      await createPeriod({
        number: parseInt(newPeriodNumber),
        start_time: newPeriodStart || undefined,
        end_time: newPeriodEnd || undefined,
      });
      setNewPeriodNumber("");
      setNewPeriodStart("");
      setNewPeriodEnd("");
      toast.success("Period added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add period");
    }
  };

  const handleAddDay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayName) return;
    try {
      await createDay(newDayName);
      setNewDayName("");
      toast.success("Day added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add day");
    }
  };

  const handleGenerate = async () => {
    try {
      const result = await generateTimetable();
      await refreshMe();

      if (result.unscheduled > 0) {
        toast.warning(
          `Generated ${result.scheduled}/${result.requested} lessons. ${result.unscheduled} could not be scheduled.`,
        );
      } else {
        toast.success(
          `Timetable generated successfully with ${result.freePeriodsInsideDailyBlocks} internal free periods.`,
        );
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate timetable");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Header Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">
                System Configuration
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              App <span className="text-primary">Settings</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              Configure your academic structure and generate optimized
              timetables.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </motion.div>

      <Card className="rounded-[2rem] border-primary/10 bg-primary/5 overflow-hidden">
        <CardContent className="p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Package</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{user?.packageName || "Trial"}</div>
            <p className="text-sm text-muted-foreground">
              {user?.remainingGenerations === -1
                ? "Unlimited timetable generations"
                : `${user?.remainingGenerations ?? 0} generation${(user?.remainingGenerations ?? 0) === 1 ? "" : "s"} remaining`}
            </p>
          </div>
          <div className="rounded-2xl bg-background/70 px-5 py-3 text-center border border-primary/10">
            <div className="text-2xl font-extrabold text-primary">
              {user?.remainingGenerations === -1 ? "∞" : user?.remainingGenerations ?? 0}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Credits</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Periods Management */}
        <motion.div variants={item} className="space-y-6">
          <Card className="rounded-[2rem] border-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl font-bold">Periods</CardTitle>
              </div>
              <CardDescription>
                Define the time slots for your daily schedule.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <form
                onSubmit={handleAddPeriod}
                className="grid grid-cols-3 gap-3"
              >
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Number
                  </Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={newPeriodNumber}
                    onChange={(e) => setNewPeriodNumber(e.target.value)}
                    className="h-11 rounded-xl bg-background/50 border-primary/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Start
                  </Label>
                  <Input
                    type="text"
                    placeholder="08:00"
                    value={newPeriodStart}
                    onChange={(e) => setNewPeriodStart(e.target.value)}
                    className="h-11 rounded-xl bg-background/50 border-primary/5"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    End
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="09:00"
                      value={newPeriodEnd}
                      onChange={(e) => setNewPeriodEnd(e.target.value)}
                      className="h-11 rounded-xl bg-background/50 border-primary/5"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="h-11 w-11 shrink-0 rounded-xl"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </form>

              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {periods.map((period) => (
                    <motion.div
                      key={period.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-primary/5 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {period.number}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">
                            Period {period.number}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {period.start_time || "--:--"} -{" "}
                            {period.end_time || "--:--"}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePeriod(period.id)}
                        className="h-9 w-9 rounded-xl opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {periods.length === 0 && !periodsLoading && (
                  <div className="text-center py-8 text-muted-foreground italic text-sm">
                    No periods defined yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Days Management */}
        <motion.div variants={item} className="space-y-6">
          <Card className="rounded-[2rem] border-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Days of Week
                </CardTitle>
              </div>
              <CardDescription>
                Select the days when classes are held.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <form onSubmit={handleAddDay} className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Day Name
                  </Label>
                  <Input
                    placeholder="e.g. Monday"
                    value={newDayName}
                    onChange={(e) => setNewDayName(e.target.value)}
                    className="h-11 rounded-xl bg-background/50 border-primary/5"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="submit"
                    size="icon"
                    className="h-11 w-11 rounded-xl"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                  {days.map((day) => (
                    <motion.div
                      key={day.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-background/40 border border-primary/5 group"
                    >
                      <span className="text-sm font-bold">{day.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteDay(day.id)}
                        className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {days.length === 0 && !daysLoading && (
                  <div className="col-span-full text-center py-8 text-muted-foreground italic text-sm">
                    No days added yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timetable Generation */}
          <Card className="rounded-[2rem] border-primary/10 bg-primary/5 overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Play className="h-5 w-5" />
                </div>
                <CardTitle className="text-2xl font-bold">Generation</CardTitle>
              </div>
              <CardDescription>
                Run the AI engine to generate the optimal timetable.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4">
              <div className="p-6 rounded-2xl bg-background/60 border border-primary/10 space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Ready to Generate?</h4>
                  <p className="text-xs text-muted-foreground">
                    This will overwrite any existing timetable data. Make sure
                    all teachers, subjects, and classes are correctly assigned.
                  </p>
                </div>
                <Button
                  onClick={handleGenerate}
                  disabled={genLoading}
                  className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-[0.98]"
                >
                  {genLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Timetable...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate New Timetable
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
