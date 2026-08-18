"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimetable } from "@/hooks/timetable/use-timetable";
import { useClass } from "@/hooks/class/use-class";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { useSubject } from "@/hooks/subject/use-subject";
import { useDay } from "@/hooks/day/use-day";
import { usePeriod } from "@/hooks/period/use-period";
import { toast } from "sonner";
import {
  Sparkles,
  Calendar,
  BookOpen,
  User,
  Clock,
  MapPin,
} from "lucide-react";

interface AddTimetableEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialClassId?: string;
}

export function AddTimetableEntryModal({
  isOpen,
  onClose,
  onSuccess,
  initialClassId,
}: AddTimetableEntryModalProps) {
  const { createTimetableEntry } = useTimetable();
  const { classes } = useClass();
  const { teachers } = useTeacher();
  const { subjects } = useSubject();
  const { days } = useDay();
  const { periods } = usePeriod();

  const [formData, setFormData] = React.useState({
    classId: initialClassId || "",
    teacherId: "",
    subjectId: "",
    dayId: "",
    periodId: "",
    roomId: "default-room", // Simplified for now
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (initialClassId) {
      setFormData((prev) => ({ ...prev, classId: initialClassId }));
    }
  }, [initialClassId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.classId ||
      !formData.teacherId ||
      !formData.subjectId ||
      !formData.dayId ||
      !formData.periodId
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTimetableEntry({
        classId: formData.classId,
        teacherId: formData.teacherId,
        subjectId: formData.subjectId,
        dayId: formData.dayId,
        periodId: formData.periodId,
      });
      toast.success("Timetable entry added successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to add timetable entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add Timetable Entry"
      description="Schedule a new session for a class group."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Class Group
            </Label>
            <Select
              value={formData.classId}
              onValueChange={(v) => setFormData({ ...formData, classId: v })}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary/40" />
                  <SelectValue placeholder="Select class" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Subject
            </Label>
            <Select
              value={formData.subjectId}
              onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary/40" />
                  <SelectValue placeholder="Select subject" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {subjects.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Teacher
            </Label>
            <Select
              value={formData.teacherId}
              onValueChange={(v) => setFormData({ ...formData, teacherId: v })}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary/40" />
                  <SelectValue placeholder="Select teacher" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Room Selection (Simplified) */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Room
            </Label>
            <Select
              value={formData.roomId}
              onValueChange={(v) => setFormData({ ...formData, roomId: v })}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary/40" />
                  <SelectValue placeholder="Select room" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="default-room">General Classroom</SelectItem>
                <SelectItem value="lab-1">Science Lab 1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Day Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Day
            </Label>
            <Select
              value={formData.dayId}
              onValueChange={(v) => setFormData({ ...formData, dayId: v })}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary/40" />
                  <SelectValue placeholder="Select day" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {days.map((day) => (
                  <SelectItem key={day.id} value={day.id}>
                    {day.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Period
            </Label>
            <Select
              value={formData.periodId}
              onValueChange={(v) => setFormData({ ...formData, periodId: v })}
            >
              <SelectTrigger className="h-12 rounded-xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary/40" />
                  <SelectValue placeholder="Select period" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {periods.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>
                    Period {p.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl font-bold hover:bg-primary/5 transition-all"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-14 rounded-2xl glass-button-primary shadow-xl shadow-primary/20 font-bold group"
          >
            {isSubmitting ? (
              "Scheduling..."
            ) : (
              <>
                Schedule Session
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
