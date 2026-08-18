"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClass } from "@/hooks/class/use-class";
import { toast } from "sonner";
import {
  GraduationCap,
  Users,
  Sparkles,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddClassModal({
  isOpen,
  onClose,
  onSuccess,
}: AddClassModalProps) {
  const { createClass } = useClass();
  const [name, setName] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await createClass(name);
      toast.success("Class group created successfully");
      setName("");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to create class group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Create Class Group"
      description="Define a new student group for scheduling and management."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          {/* Class Name Input */}
          <div className="space-y-3">
            <Label
              htmlFor="className"
              className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground ml-1"
            >
              Class Name / Identifier
            </Label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40 group-focus-within:text-primary group-focus-within:bg-primary/10 transition-all duration-300">
                <GraduationCap className="h-5 w-5" />
              </div>
              <Input
                id="className"
                placeholder="e.g., Grade 11-B (Science)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-16 pl-16 rounded-[1.25rem] bg-background/50 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all text-lg font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl font-bold hover:bg-primary/5 transition-all text-muted-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-[2] h-14 rounded-2xl glass-button-primary shadow-xl shadow-primary/20 font-bold group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                "Creating Group..."
              ) : (
                <>
                  Create Class Group
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:animate-shimmer" />
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
