"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useSubject } from "@/hooks/subject/use-subject";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { toast } from "sonner";
import { BookOpen, Plus, X, Sparkles, User, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddSubjectModal({
  isOpen,
  onClose,
  onSuccess,
}: AddSubjectModalProps) {
  const { createSubject } = useSubject();
  const { teachers } = useTeacher();
  const [name, setName] = React.useState("");
  const [selectedTeacherIds, setSelectedTeacherIds] = React.useState<string[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [teacherSearch, setTeacherSearch] = React.useState("");

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) &&
      !selectedTeacherIds.includes(t.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createSubject({ name, teacherIds: selectedTeacherIds });
      toast.success("Subject added successfully");
      setName("");
      setSelectedTeacherIds([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to add subject");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTeacher = (id: string) => {
    setSelectedTeacherIds((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Subject"
      description="Create a new subject and assign faculty members."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="subjectName"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              Subject Name
            </Label>
            <div className="relative group">
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="subjectName"
                placeholder="e.g., Advanced Mathematics"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-14 pl-12 rounded-2xl bg-background/50 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all"
              />
            </div>
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
              "Creating..."
            ) : (
              <>
                Create Subject
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
