import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export interface TimetableEntry {
  id: string;
  classId: string;
  teacherSubjectId: string;
  dayId: string;
  periodId: number;
  class: {
    id: string;
    name: string;
  };
  teacherSubject: {
    id: string;
    teacher: {
      id: string;
      name: string;
    };
    subject: {
      id: string;
      name: string;
    };
  };
  day: {
    id: string;
    name: string;
  };
  period: {
    id: number;
    number: number;
    start_time: string | null;
    end_time: string | null;
  };
}

export interface GenerateTimetableResult {
  message: string;

  classes: number;

  totalSlots: number;

  requested: number;

  scheduled: number;

  freePeriods: number;

  unscheduled: number;

  targetShortfall: number;

  targetExcess: number;

  freePeriodsInsideDailyBlocks: number;

  optimized: boolean;

  attempts: number;
  remainingGenerations?: number;
}

export const useTimetable = () => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimetable = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<TimetableEntry[]>("/timetable");
      setTimetable(response);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch timetable";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const createTimetableEntry = async (data: {
    classId: string;
    teacherId: string;
    subjectId: string;
    dayId: string;
    periodId: string | number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch<TimetableEntry>("/timetable", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await fetchTimetable();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create timetable entry";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTimetableEntry = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await apiFetch(`/timetable/${id}`, {
        method: "DELETE",
      });
      await fetchTimetable();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to delete timetable entry";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const generateTimetable = async (): Promise<GenerateTimetableResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<GenerateTimetableResult>(
        "/timetable/generate",
        { method: "POST" },
      );
      await fetchTimetable();
      return response;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate timetable";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTimetable();
  }, []);

  const moveTimetableEntry = async (
    id: string,
    data: {
      dayId: string;
      periodId: number;
    },
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiFetch<{
        message: string;
        moved: TimetableEntry[];
        changes: number;
      }>(`/timetable/${id}/move`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      await fetchTimetable();

      return response;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to move timetable entry";

      setError(message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };
  return {
    timetable,
    loading,
    error,
    refreshTimetable: fetchTimetable,
    createTimetableEntry,
    deleteTimetableEntry,
    generateTimetable,
    moveTimetableEntry, 
  };
};
