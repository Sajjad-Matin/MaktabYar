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
import { useClass } from "@/hooks/class/use-class";
import { useSubject } from "@/hooks/subject/use-subject";
import { toast } from "sonner";
import {
  User,
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignTeacherToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultTeacherId?: string;
}

export function AssignTeacherToClassModal({
  isOpen,
  onClose,
  onSuccess,
  defaultTeacherId,
}: AssignTeacherToClassModalProps) {
  const { teachers } = useTeacher();
  const { classes, assignTeacherToClass } = useClass();
  const { subjects } = useSubject();

  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeClasses = Array.isArray(classes) ? classes : [];

  const [teacherId, setTeacherId] = React.useState(defaultTeacherId || "");
  const [subjectId, setSubjectId] = React.useState("");
  const [selectedClassIds, setSelectedClassIds] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (defaultTeacherId) {
      setTeacherId(defaultTeacherId);
    }
  }, [defaultTeacherId]);

  React.useEffect(() => {
    setSubjectId("");
  }, [teacherId]);

  const selectedTeacher = safeTeachers.find((t) => t && t.id === teacherId);
  const availableSubjects = selectedTeacher
    ? Array.isArray(selectedTeacher.subjects) ? selectedTeacher.subjects.map((ts) => ts.subject).filter(Boolean) : []
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !subjectId || selectedClassIds.length === 0) {
      toast.error("Please select a teacher, a subject, and at least one class");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const classId of selectedClassIds) {
        await assignTeacherToClass(teacherId, classId, subjectId);
      }
      toast.success("Teacher assigned to classes successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to assign teacher to classes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClass = (id: string) => {
    setSelectedClassIds((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Teacher to Class"
      description="Link a faculty member and their subject to student groups."
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
              Faculty Member
            </Label>
            <Select
              value={teacherId}
              onValueChange={setTeacherId}
            >
              <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary/40" />
                  <SelectValue placeholder="Select teacher" />
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
              Subject
            </Label>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
              disabled={!teacherId}
            >
              <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-primary/5">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary/40" />
                  <SelectValue
                    placeholder={
                      teacherId ? "Select subject" : "Select teacher first"
                    }
                  />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {availableSubjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Target Class Groups
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {safeClasses.map((cls) => {
              const isSelected = selectedClassIds.includes(cls.id);
              return (
                <div
                  key={cls.id}
                  onClick={() => toggleClass(cls.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer group",
                    isSelected
                      ? "bg-primary/10 border-primary/20 shadow-sm"
                      : "bg-background/50 border-primary/5 hover:border-primary/20 hover:bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-primary text-white"
                          : "bg-primary/5 text-primary/40 group-hover:text-primary"
                      )}
                    >
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold">{cls.name}</span>
                  </div>
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-primary/20 group-hover:border-primary/40"
                    )}
                  >
                    {isSelected && (
                      <CheckCircle2 className="h-3 w-3 text-white" />
                    )}
                  </div>
                </div>
              );
            })}
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
              "Assigning..."
            ) : (
              <>
                Confirm Assignments
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
