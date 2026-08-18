"use client";

import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export interface Class {
  id: string;
  name: string;
  teacherSubjects?: {
    id: string;
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
  }[];
}

export function useClass() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiFetch<Class[]>("/classes");
      setClasses(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch classes");
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (name: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch("/classes", {
        method: "POST",
        body: JSON.stringify({ name }),
      });

      await fetchClasses();
    } catch (err: any) {
      setError(err.message || "Failed to create class");
    } finally {
      setLoading(false);
    }
  };

  const updateClass = async (id: string, name: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/classes/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });

      setClasses((prevClasses) =>
        prevClasses.map((cls) => (cls.id === id ? { ...cls, name } : cls))
      );
    } catch (err: any) {
      setError(err.message || "Failed to update class");
    } finally {
      setLoading(false);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/classes/${id}`, {
        method: "DELETE",
      });

      await fetchClasses();
    } catch (err: any) {
      setError(err.message || "Failed to delete class");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllClasses = async () => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch("/classes", {
        method: "DELETE",
      });

      await fetchClasses();
    } catch (err: any) {
      setError(err.message || "Failed to delete all classes");
    } finally {
      setLoading(false);
    }
  };

  const assignTeacherToClass = async (
    teacherId: string,
    classId: string,
    subjectId: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // First, get or create the teacher-subject link
      const teacherSubjects = await apiFetch<any[]>("/teacherSubjects");
      let ts = teacherSubjects.find(
        (item) => item.teacherId === teacherId && item.subjectId === subjectId
      );

      if (!ts) {
        ts = await apiFetch("/teacherSubjects", {
          method: "POST",
          body: JSON.stringify({ teacherId, subjectId, periodsPerWeek: 1 }),
        });
      }

      // Then, link it to the class
      await apiFetch("/teacherSubjectClasses", {
        method: "POST",
        body: JSON.stringify({ teacherSubjectId: ts.id, classId }),
      });

      await fetchClasses();
    } catch (err: any) {
      setError(err.message || "Failed to assign teacher to class");
    } finally {
      setLoading(false);
    }
  };

  const unassignTeacherFromClass = async (assignmentId: string) => {
    try {
      setLoading(true);
      setError(null);

      await apiFetch(`/teacherSubjectClasses/${assignmentId}`, {
        method: "DELETE",
      });

      await fetchClasses();
    } catch (err: any) {
      setError(err.message || "Failed to unassign teacher from class");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return {
    classes,
    loading,
    error,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    deleteAllClasses,
    assignTeacherToClass,
    unassignTeacherFromClass,
  };
}
