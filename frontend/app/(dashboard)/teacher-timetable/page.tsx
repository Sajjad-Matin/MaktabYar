"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Download, FileSpreadsheet, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { useTimetable } from "@/hooks/timetable/use-timetable";
import { useDay } from "@/hooks/day/use-day";
import { usePeriod } from "@/hooks/period/use-period";
import { TeacherTimetableGrid } from "@/components/timetable/teacher-timetable-grid";
import { TeacherTimetableExportDocument } from "@/components/timetable/teacher-timetable-export-document";
import { useLanguage } from "@/lib/i18n/language-context";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } };

export default function TeacherTimetablePage() {
  const { t } = useLanguage();
  const { teachers } = useTeacher();
  const { timetable } = useTimetable();
  const { days } = useDay();
  const { periods } = usePeriod();
  const [selectedTeacherId, setSelectedTeacherId] = React.useState("");
  const [format, setFormat] = React.useState<"xlsx" | "pdf">("pdf");
  const [exporting, setExporting] = React.useState(false);
  const exportRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  React.useEffect(() => {
    if (!selectedTeacherId && teachers.length)
      setSelectedTeacherId(teachers[0].id);
  }, [teachers, selectedTeacherId]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
        "http://localhost:5000/api";
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }
      const formatQuery = format === "xlsx" ? "xlsx" : "pdf";
      const url = `${baseUrl}/timetable/export?format=${formatQuery}&view=teacher`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const raw = await response.text().catch(() => "");
        let message = "Export failed";
        try {
          const body = raw ? JSON.parse(raw) : null;
          message = body?.message || message;
        } catch {
          message = raw || message;
        }
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          return;
        }
        throw new Error(message);
      }
      const blob = await response.blob();
      const urlObj = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObj;
      link.download = `teacher-timetables-${Date.now()}.${formatQuery === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(urlObj);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown export error";
      console.error("Teacher timetable export failed:", error);
      alert(message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/10 via-primary/5 to-background p-8 md:p-10"
      >
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">
                {t("teacherTimetablePageBadge")}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              {t("teacherTimetablePageTitle")}{" "}
              <span className="text-primary">
                {t("teacherTimetablePageTitleHighlight")}
              </span>
            </h1>
            <p className="max-w-xl text-muted-foreground">
              {t("teacherTimetablePageDesc")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={format}
              onValueChange={(v: "xlsx" | "pdf") => setFormat(v)}
            >
              <SelectTrigger className="h-12 w-[105px] rounded-xl bg-background/50 border-primary/5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="xlsx">XLSX</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-primary/10"
              onClick={() => window.print()}
              title="Print"
            >
              <Printer className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-primary/10"
              onClick={handleExport}
              disabled={exporting}
              title={t("teacherTimetableExport")}
            >
              {exporting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/4 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </motion.div>

      <motion.div
        variants={item}
        className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2rem] border border-primary/5 bg-card/40 p-6 shadow-sm backdrop-blur-md"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-bold uppercase tracking-wider text-primary">
            {t("teacherTimetableLabel")}
          </div>
          <Select
            value={selectedTeacherId}
            onValueChange={setSelectedTeacherId}
          >
            <SelectTrigger className="h-12 w-full md:w-[320px] rounded-xl bg-background/50 border-primary/5">
              <SelectValue placeholder={t("teacherTimetableSelect")} />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileSpreadsheet className="h-4 w-4" /> Export includes every teacher.
        </div>
      </motion.div>

      <motion.div variants={item} className="relative">
        <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-2xl" />
        <TeacherTimetableGrid teacherId={selectedTeacherId} />
      </motion.div>

      <div className="fixed left-[-100000px] top-0 pointer-events-none">
        {teachers.map((teacher) => (
          <TeacherTimetableExportDocument
            key={teacher.id}
            teacher={teacher}
            timetable={timetable}
            days={days}
            periods={periods}
            ref={(node) => {
              if (node) exportRefs.current.set(teacher.id, node);
              else exportRefs.current.delete(teacher.id);
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
