"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export interface Subject {
  id: string;
  name: string;
  teachers?: {
    id: string;
    teacher: {
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
}

export const useSubject = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<Subject[]>("/subjects");
      setSubjects(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subject: {
    name: string;
    teacherIds?: string[];
  }) => {
    setLoading(true);
    try {
      await apiFetch("/subjects", {
        method: "POST",
        body: JSON.stringify(subject),
      });
      await fetchSubjects();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const updateSubject = async (id: string, subject: Subject) => {
    setLoading(true);
    try {
      await apiFetch(`/subjects/${id}`, {
        method: "PUT",
        body: JSON.stringify(subject),
      });

      setSubjects((prevSubjects) =>
        prevSubjects.map((s) =>
          s.id === id ? { ...s, name: subject.name } : s
        )
      );
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubject = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/subjects/${id}`, {
        method: "DELETE",
      });
      await fetchSubjects();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllSubjects = async () => {
    setLoading(true);
    try {
      await apiFetch("/subjects", {
        method: "DELETE",
      });
      await fetchSubjects();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    deleteAllSubjects,
  };
};
