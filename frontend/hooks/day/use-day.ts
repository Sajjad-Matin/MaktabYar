import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export interface Day {
  id: string;
  name: string;
}

export const useDay = () => {
  const [days, setDays] = useState<Day[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDays = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Day[]>("/day");
      setDays(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const createDay = async (name: string) => {
    setLoading(true);
    try {
      await apiFetch("/day", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      await fetchDays();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDay = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/day/${id}`, {
        method: "DELETE",
      });
      await fetchDays();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const initializeDays = async (days: string[]) => {
    setLoading(true);
    try {
      await apiFetch("/day/initialize", {
        method: "POST",
        body: JSON.stringify({ days }),
      });
      await fetchDays();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDays();
  }, []);

  return {
    days,
    loading,
    error,
    createDay,
    deleteDay,
    initializeDays,
    refreshDays: fetchDays,
  };
};
