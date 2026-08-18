"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Plus,
  User,
  Trash2,
  Search,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useTeacher } from "@/hooks/teacher/use-teachers";
import { useSubject } from "@/hooks/subject/use-subject";
import { useTeacherSubject } from "@/hooks/teacher-subject/use-teacher-subject";
import { useClass } from "@/hooks/class/use-class";
import { useTeacherSubjectClass } from "@/hooks/teacher-subject-class/use-teacher-subject-class";

import { AssignSubjectToTeacherModal } from "@/components/modals/assign-subject-to-teacher-modal";
import { AssignTeacherToClassModal } from "@/components/modals/assign-teacher-to-class-modal";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n/language-context";

function AssignmentsContent() {
  const { t } = useLanguage();
  const { teachers = [], fetchTeachers } = useTeacher();
  const {
    teacherSubjects = [],
    deleteTeacherSubject,
    deleteAllTeacherSubjects,
    refreshTeacherSubjects,
  } = useTeacherSubject();
  const {
    teacherSubjectClasses = [],
    deleteAllTeacherSubjectClasses,
    refreshTeacherSubjectClasses,
  } = useTeacherSubjectClass();
  const { classes = [], unassignTeacherFromClass } = useClass();

  const safeTeachers = Array.isArray(teachers) ? teachers : [];
  const safeTeacherSubjectClasses = Array.isArray(teacherSubjectClasses) ? teacherSubjectClasses : [];
  const safeClasses = Array.isArray(classes) ? classes : [];

  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedTeachers, setExpandedTeachers] = React.useState<Set<string>>(
    new Set(),
  );

  const [isSubjectModalOpen, setIsSubjectModalOpen] = React.useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = React.useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = React.useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = React.useState<string>("");

  const toggleTeacher = (id: string) => {
    const newSet = new Set(expandedTeachers);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setExpandedTeachers(newSet);
  };

  const filteredTeachers = safeTeachers.filter((t) =>
    t && t.name ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) : false,
  );

  const hasAssignments = safeTeachers.some((t) => (t?.subjects?.length ?? 0) > 0);

  const refreshAll = async () => {
    await Promise.all([
      fetchTeachers(),
      refreshTeacherSubjects(),
      refreshTeacherSubjectClasses(),
    ]);
  };

  const deleteAllAssignments = async () => {
    await deleteAllTeacherSubjectClasses();
    await deleteAllTeacherSubjects();
    await refreshAll();
  };

  return (
    <motion.div className="space-y-8 pb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-10">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              {t("assignmentsPageTitle")} <span className="text-primary">{t("assignmentsPageTitleHighlight")}</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              {t("assignmentsPageDesc")}
            </p>
          </div>
          <Button
            onClick={() => setIsDeleteAllModalOpen(true)}
            disabled={!hasAssignments}
            className="glass-button-primary h-14 px-8 rounded-2xl border-destructive/20 text-destructive bg-destructive text-white hover:bg-destructive/80 transition-all duration-300 group"
          >
            <Trash2 className="mr-2 h-4 w-4" /> {t("assignmentsDeleteAll")}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("assignmentsSearchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-14 pl-12 pr-4 rounded-2xl bg-background/40 border-primary/5"
        />
      </div>

      {/* Teacher List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredTeachers.map((teacher) => {
            const isExpanded = expandedTeachers.has(teacher.id);
            const teacherSubjectsList = Array.isArray(teacher.subjects) ? teacher.subjects : [];

            return (
              <motion.div
                key={teacher.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card
                  className={cn(
                    "overflow-hidden rounded-2xl border-primary/5 bg-card/50",
                    isExpanded
                      ? "ring-1 ring-primary/20 shadow-xl"
                      : "hover:bg-card/80 hover:shadow-md",
                  )}
                >
                  <div
                    className="p-6 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleTeacher(teacher.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <h3 className="font-bold text-lg">{teacher.name}</h3>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-primary/5 space-y-6">
                      {/* Subjects */}
                      <div className="flex flex-wrap gap-2">
                        {teacherSubjectsList.map((ts) => (
                          <Badge
                            key={ts.id}
                            className="bg-background/50 border-primary/10 flex items-center gap-2 text-black dark:text-white"
                          >
                            {ts.subject?.name}
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm(`Unassign ${ts.subject?.name}?`)) {
                                  await deleteTeacherSubject(ts.id);
                                  fetchTeachers();
                                }
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeacherId(teacher.id);
                            setIsSubjectModalOpen(true);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/5"
                        >
                          <Plus className="h-3 w-3 mr-1" /> {t("assignmentsAddSubject")}
                        </Button>
                      </div>

                      <div>
                        {teacherSubjectsList.map((ts) => {
                          const assignedClasses = safeTeacherSubjectClasses.filter(
                            (tsc) => tsc && tsc.teacherSubjectId === ts.id,
                          );
                          return (
                            <div key={ts.id} className="mb-4">
                              <h4 className="font-semibold text-sm mb-2">
                                {ts.subject?.name} - {t("assignmentsAssignedClasses")}
                              </h4>
                              {assignedClasses.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {assignedClasses.map((tsc) => {
                                    const cls = safeClasses.find(
                                      (c) => c && c.id === tsc.classId,
                                    );
                                    return cls ? (
                                      <Badge
                                        key={tsc.id}
                                        className="bg-background/50 border-primary/10 flex items-center gap-2 text-black dark:text-white"
                                      >
                                        {cls.name}
                                        <button
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            if (
                                              confirm(
                                                `Unassign ${teacher.name} from ${cls.name}?`,
                                              )
                                            ) {
                                              await unassignTeacherFromClass(
                                                tsc.id,
                                              );
                                              fetchTeachers();
                                            }
                                          }}
                                          className="text-muted-foreground hover:text-destructive"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground">
                                  {t("assignmentsNoClasses")}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Classes */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <Button
                          disabled={
                            !teacherSubjectsList || teacherSubjectsList.length === 0
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTeacherId(teacher.id);
                            setIsClassModalOpen(true);
                          }}
                          variant="outline"
                          className="h-auto py-3 rounded-xl border-dashed border-primary/10 bg-transparent hover:bg-primary/5 text-xs font-bold text-primary"
                        >
                          <Plus className="h-3 w-3 mr-2" /> {t("assignmentsAssignClass")}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-xl font-bold mb-2">{t("assignmentsEmpty")}</h3>
          <p className="text-muted-foreground max-w-xs">
            {t("assignmentsEmptyDesc")}
          </p>
        </div>
      )}

      {/* Modals */}
      <ConfirmationModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        title="Delete All Assignments"
        description="Are you sure you want to delete all assignments?"
        onConfirm={() => {
          deleteAllAssignments();
          setIsDeleteAllModalOpen(false);
        }}
      />

      <AssignSubjectToTeacherModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSuccess={refreshAll}
        defaultTeacherId={selectedTeacherId}
      />

      <AssignTeacherToClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        onSuccess={refreshAll}
        defaultTeacherId={selectedTeacherId}
      />
    </motion.div>
  );
}

export default function AssignmentsPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground font-medium">Loading faculty assignments...</div>}>
      <AssignmentsContent />
    </React.Suspense>
  );
}
