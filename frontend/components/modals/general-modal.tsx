"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Edit3 } from "lucide-react";

interface GeneralModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  defaultValue: string;
  onSubmit: (value: string) => void;
}

export function GeneralModal({
  isOpen,
  onClose,
  title,
  description,
  defaultValue,
  onSubmit,
}: GeneralModalProps) {
  const [value, setValue] = React.useState(defaultValue);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(value);
      onClose();
    } catch (error) {
      // Error handling is usually done in the parent's onSubmit
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="generalInput"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
          >
            Update Information
          </Label>
          <div className="relative group">
            <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              id="generalInput"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
              className="h-14 pl-12 rounded-2xl bg-background/50 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all"
            />
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
              "Updating..."
            ) : (
              <>
                Save Changes
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
