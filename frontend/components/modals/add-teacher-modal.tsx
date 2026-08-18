"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { toast } from "sonner";
import { User, Mail, Phone, Sparkles } from "lucide-react";

interface AddTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddTeacherModal({
  isOpen,
  onClose,
  onSuccess,
}: AddTeacherModalProps) {
  const { createTeacher } = useTeacher();
  const [name, setName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createTeacher(name);
      toast.success("Teacher added successfully");
      setName("");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to add teacher");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Teacher"
      description="Register a new faculty member to the system."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              Full Name
            </Label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="name"
                placeholder="e.g., Prof. John Smith"
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
              "Registering..."
            ) : (
              <>
                Register Teacher
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
