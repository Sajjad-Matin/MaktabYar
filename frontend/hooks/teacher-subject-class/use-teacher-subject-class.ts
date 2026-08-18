import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { TeacherSubject } from "../teacher-subject/use-teacher-subject";
import { Class } from "../class/use-class";

export interface TeacherSubjectClass {
  id: string;
  teacherSubjectId: string;
  classId: string;
  createdAt: string;
  teacherSubject: TeacherSubject;
  class: Class;
}

export const useTeacherSubjectClass = () => {
  const [teacherSubjectClasses, setTeacherSubjectClasses] = useState<
    TeacherSubjectClass[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacherSubjectClasses = async () => {
    setLoading(true);
    try {
      const response = await apiFetch<TeacherSubjectClass[]>(
        "/teacherSubjectClasses"
      );
      setTeacherSubjectClasses(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const assignTeacherSubjectToClass = async (data: {
    teacherSubjectId: string;
    classId?: string;
    classIds?: string[];
  }) => {
    setLoading(true);
    try {
      await apiFetch("/teacherSubjectClasses", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await fetchTeacherSubjectClasses();
    } catch (error) {
      setError(error as string);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeTeacherSubjectFromClass = async (id: string) => {
    setLoading(true);
    try {
      await apiFetch(`/teacherSubjectClasses/${id}`, {
        method: "DELETE",
      });
      await fetchTeacherSubjectClasses();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllTeacherSubjectClasses = async () => {
    setLoading(true);
    try {
      await apiFetch("/teacherSubjectClasses/all", {
        method: "DELETE",
      });
      await fetchTeacherSubjectClasses();
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherSubjectClasses();
  }, []);

  return {
    teacherSubjectClasses,
    loading,
    error,
    assignTeacherSubjectToClass,
    removeTeacherSubjectFromClass,
    deleteAllTeacherSubjectClasses,
    refreshTeacherSubjectClasses: fetchTeacherSubjectClasses,
  };
};
