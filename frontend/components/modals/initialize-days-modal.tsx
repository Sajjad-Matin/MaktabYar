"use client";

import * as React from "react";
import { ModalWrapper } from "./modal-wrapper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useDay } from "@/hooks/day/use-day";
import { toast } from "sonner";
import { Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface InitializeDaysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function InitializeDaysModal({
  isOpen,
  onClose,
  onSuccess,
}: InitializeDaysModalProps) {
  const { initializeDays } = useDay();
  const [selectedDays, setSelectedDays] = React.useState<string[]>([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0) {
      toast.error("Please select at least one day");
      return;
    }

    setIsSubmitting(true);
    try {
      await initializeDays(selectedDays);
      toast.success("Academic days initialized successfully");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to initialize days");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Academic Days"
      description="Select the days of the week that will be active in your timetable."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-3">
          {ALL_DAYS.map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <div
                key={day}
                onClick={() => toggleDay(day)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer group",
                  isSelected
                    ? "bg-primary/10 border-primary/20 shadow-sm"
                    : "bg-background/50 border-primary/5 hover:border-primary/20 hover:bg-primary/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-primary/5 text-primary/40 group-hover:text-primary"
                    )}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                  <Label className="text-base font-bold cursor-pointer">
                    {day}
                  </Label>
                </div>
                <div
                  className={cn(
                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-primary border-primary scale-110"
                      : "border-primary/20 group-hover:border-primary/40"
                  )}
                >
                  {isSelected && (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>
            );
          })}
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
              "Saving..."
            ) : (
              <>
                Save Configuration
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:scale-125" />
              </>
            )}
          </Button>
        </div>
      </form>
    </ModalWrapper>
  );
}
