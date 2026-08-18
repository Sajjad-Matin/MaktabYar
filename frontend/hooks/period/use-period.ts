import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export interface Period {
  id: number;
  number: number;
  start_time: string | null;
  end_time: string | null;
}

export const usePeriod = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Period[]>("/period");
      setPeriods(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const createPeriod = async (data: {
    number: number;
    start_time?: string;
    end_time?: string;
  }) => {
    setLoading(true);
    try {
      await apiFetch("/period", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await fetchPeriods();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePeriod = async (id: number) => {
    setLoading(true);
    try {
      await apiFetch(`/period/${id}`, {
        method: "DELETE",
      });
      await fetchPeriods();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  return {
    periods,
    loading,
    error,
    createPeriod,
    deletePeriod,
    fetchPeriods,
    refreshPeriods: fetchPeriods,
  };
};
