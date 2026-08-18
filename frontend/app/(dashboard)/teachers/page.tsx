"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { AddTeacherModal } from "@/components/modals/add-teacher-modal";
import { GeneralModal } from "@/components/modals/general-modal";
import { toast } from "sonner";
import { ConfirmationModal } from "@/components/modals/confirmation-modal";
import { useLanguage } from "@/lib/i18n/language-context";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function TeachersContent() {
  const { t } = useLanguage();
  const {
    teachers,
    loading,
    deleteTeacher,
    updateTeacher,
    fetchTeachers,
    deleteAllTeachers,
  } = useTeacher();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingTeacher, setEditingTeacher] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const safeTeachers = Array.isArray(teachers) ? teachers : [];

  const filteredTeachers = safeTeachers.filter((teacher) =>
    teacher && teacher.name ? teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteTeacher(id);
      toast.success("Teacher deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teacher");
    }
  };

  const handleUpdate = async (name: string) => {
    if (!editingTeacher) return;
    try {
      await updateTeacher(editingTeacher.id, name);
      toast.success("Teacher updated successfully");
      setEditingTeacher(null);
    } catch (error) {
      toast.error("Failed to update teacher");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllTeachers();
      toast.success("All teachers deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teachers");
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Header Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">
                {t("teachersPageBadge")}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {t("teachersPageTitle")} <span className="text-primary">{t("teachersPageTitleHighlight")}</span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              {t("teachersPageDesc")}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={safeTeachers.length === 0}
              variant="outline"
              className="h-14 px-8 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-destructive"
            >
              <Trash2 className="mr-2 h-5 w-5" />
              {t("teachersDeleteAll")}
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="glass-button-danger h-14 px-8 rounded-2xl shadow-xl shadow-primary/20 group"
            >
              <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              {t("teachersAddNew")}
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Search and Filters */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder={t("teachersSearchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-4 rounded-2xl bg-background/40 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all duration-300"
          />
        </div>
      </motion.div>

      {/* Teachers Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="group relative overflow-hidden rounded-[2rem] border-primary/5 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <User className="h-8 w-8" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTeacher(teacher)}
                        className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                        title="Edit Teacher"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(teacher.id)}
                        className="h-10 w-10 rounded-xl hover:bg-destructive/5 hover:text-destructive transition-colors"
                        title="Delete Teacher"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
                      {teacher.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTeachers.length === 0 && !loading && (
        <motion.div
          variants={item}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-primary/20" />
          </div>
          <h3 className="text-xl font-bold mb-2">{t("teachersEmpty")}</h3>
          <p className="text-muted-foreground max-w-xs">
            {t("teachersEmptyDesc")}
          </p>
        </motion.div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Teacher"
        description="Are you sure you want to delete this teacher?"
        onConfirm={() => handleDeleteAll()}
      />

      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchTeachers}
      />

      <GeneralModal
        isOpen={!!editingTeacher}
        onClose={() => setEditingTeacher(null)}
        title="Edit Teacher"
        description="Update the teacher's profile information."
        defaultValue={editingTeacher?.name || ""}
        onSubmit={handleUpdate}
      />
    </motion.div>
  );
}

export default function TeachersPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground font-medium">Loading faculty members...</div>}>
      <TeachersContent />
    </React.Suspense>
  );
}
