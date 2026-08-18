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
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { useSubject } from "@/hooks/subject/use-subject";
import { toast } from "sonner";
import { User, BookOpen, Sparkles } from "lucide-react";
import { useTeacherSubject } from "@/hooks/teacher-subject/use-teacher-subject";
import { Input } from "@/components/ui/input";

interface AssignSubjectToTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTeacherId?: string;
}

export function AssignSubjectToTeacherModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTeacherId,
}: AssignSubjectToTeacherModalProps) {
  const { teachers } = useTeacher();
  const { subjects } = useSubject();
  const { createTeacherSubject } = useTeacherSubject();

  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeSubjects = Array.isArray(subjects) ? subjects : [];

  const [teacherId, setTeacherId] = React.useState<string>(
    defaultTeacherId || "",
  );
  const [subjectId, setSubjectId] = React.useState<string>("");
  const [periodsPerWeek, setPeriodsPerWeek] = React.useState<number>(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setTeacherId(defaultTeacherId || "");
  }, [defaultTeacherId]);

  React.useEffect(() => {
    if (isOpen) {
      setSubjectId("");
      setPeriodsPerWeek(1);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!teacherId?.trim() || !subjectId) {
      toast.error("Please select both a teacher and a subject");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTeacherSubject(subjectId, teacherId, periodsPerWeek);
      toast.success("Subject assigned to teacher successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(`Failed to assign subject: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Subject to Teacher"
      description="Link a faculty member to a specific academic subject."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Select Teacher
          </Label>
          <Select
            value={teacherId}
            onValueChange={setTeacherId}
          >
            <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-primary/5">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary/40" />
                <SelectValue placeholder="Choose a teacher..." />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {safeTeachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Select Subject
          </Label>
          <Select value={subjectId} onValueChange={setSubjectId}>
            <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-primary/5">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary/40" />
                <SelectValue placeholder="Choose a subject..." />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              {safeSubjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Periods Per Week
          </Label>
          <Input
            type="number"
            min={1}
            value={periodsPerWeek}
            onChange={(e) => setPeriodsPerWeek(parseInt(e.target.value) || 1)}
            className="h-14 rounded-2xl bg-background/50 border-primary/5"
          />
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
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-14 rounded-2xl glass-button-primary shadow-xl shadow-primary/20 font-bold group"
          >
            {isSubmitting ? (
              "Assigning..."
            ) : (
              <>
                Confirm Assignment
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
