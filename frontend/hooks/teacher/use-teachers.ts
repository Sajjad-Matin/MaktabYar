"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export type Teacher = {
  id: string;
  name: string;
  subjects?: {
    id: string;
    subject: {
      id: string;
      name: string;
    };
    classes: {
      id: string;
      class: {
        id: string;
        name: string;
      };
    }[];
  }[];
};

export function useTeacher() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Initial fetch (internal)
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch<Teacher[]>("/teachers");
      setTeachers(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Create
  const createTeacher = async (name: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch("/teachers", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      await fetchTeachers();
    } catch (err: any) {
      setError(err.message || "Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update
  const updateTeacher = async (id: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/teachers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });

      // Update the teacher in local state instead of re-fetching
      setTeachers((prevTeachers) =>
        prevTeachers.map((teacher) =>
          teacher.id === id ? { ...teacher, name } : teacher
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update teacher");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete
  const deleteTeacher = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/teachers/${id}`, {
        method: "DELETE",
      });

      await fetchTeachers();
    } catch (err: any) {
      setError(err.message || "Failed to delete teacher");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete All
  const deleteAllTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch("/teachers/all", {
        method: "DELETE",
      });

      setTeachers([]);
    } catch (err: any) {
      setError(err.message || "Failed to delete all teachers");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Auto-load once
  useEffect(() => {
    fetchTeachers();
  }, []);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    deleteAllTeachers,
  };
}
