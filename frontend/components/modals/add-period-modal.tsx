"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePeriod } from "@/hooks/period/use-period";
import { toast } from "sonner";
import { Clock, Sparkles, Timer } from "lucide-react";

interface AddPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddPeriodModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPeriodModalProps) {
  const { createPeriod, periods } = usePeriod();
  const [startTime, setStartTime] = React.useState("08:00");
  const [endTime, setEndTime] = React.useState("09:00");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const nextNumber =
        periods.length > 0 ? Math.max(...periods.map((p) => p.number)) + 1 : 1;
      await createPeriod({
        number: nextNumber,
        start_time: startTime,
        end_time: endTime,
      });
      toast.success("Period added successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to add period");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add Academic Period"
      description="Define a new time slot for your daily schedule."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="startTime"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              Start Time
            </Label>
            <div className="relative group">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="h-14 pl-12 rounded-2xl bg-background/50 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="endTime"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
            >
              End Time
            </Label>
            <div className="relative group">
              <Timer className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
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
              "Adding..."
            ) : (
              <>
                Add Period
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
