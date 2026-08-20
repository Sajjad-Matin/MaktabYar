"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  Settings2,
  Sparkles,
  Download,
  Share2,
  Printer,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClass } from "@/hooks/class/use-class";
import { useTimetable } from "@/hooks/timetable/use-timetable";
import { useDay } from "@/hooks/day/use-day";
import { usePeriod } from "@/hooks/period/use-period";
import { TimetableGrid } from "@/components/timetable/timetable-grid";
import { InitializeDaysModal } from "@/components/modals/initialize-days-modal";
import { AddPeriodModal } from "@/components/modals/add-period-modal";
import { AddTimetableEntryModal } from "@/components/modals/add-timetable-entry-modal";
import TimetableHistory from "@/components/timetable/timetable-history";
import TimetableComparison from "@/components/timetable/timetable-comparison";
import TimetableHistoryView from "@/components/timetable/timetable-history-view";
import { TimetableExportDocument } from "@/components/timetable/timetable-export-document";
import { useLanguage } from "@/lib/i18n/language-context";
import { apiFetch } from "@/lib/api";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

function TimetableContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const { classes } = useClass();
  const { timetable, refreshTimetable } = useTimetable();
  const { days, refreshDays } = useDay();
  const { periods, refreshPeriods } = usePeriod();
  const [selectedClassId, setSelectedClassId] = React.useState<string>(
    searchParams.get("classId") || "",
  );
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<"xlsx" | "pdf">(
    "xlsx",
  );

  const [isInitModalOpen, setIsInitModalOpen] = React.useState(false);
  const [isPeriodModalOpen, setIsPeriodModalOpen] = React.useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = React.useState(false);

  // History state
  const [showHistory, setShowHistory] = React.useState(false);
  const [compareHistoryIds, setCompareHistoryIds] = React.useState<{
    id1: string;
    id2: string;
  } | null>(null);
  const [viewHistoryId, setViewHistoryId] = React.useState<string | null>(null);
  const exportRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());

  React.useEffect(() => {
    const classId = searchParams.get("classId");
    if (classId) {
      setSelectedClassId(classId);
    }
  }, [searchParams]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API
      )?.replace(/\/$/, "");
      if (!baseUrl) throw new Error("Frontend API URL is not configured.");
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const formatQuery = exportFormat === "xlsx" ? "xlsx" : "pdf";
      const response = await fetch(
        `${baseUrl}/timetable/export?format=${formatQuery}&view=class`,
        {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

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

      const contentType = response.headers.get("content-type") || "";
      if (
        !contentType.includes("application/pdf") &&
        !contentType.includes(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
      ) {
        const raw = await response.text().catch(() => "");
        let message = "Export failed";
        try {
          const body = raw ? JSON.parse(raw) : null;
          message = body?.message || message;
        } catch {
          message = raw || message;
        }
        throw new Error(message);
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `timetable-all-${Date.now()}.${formatQuery === "pdf" ? "pdf" : "xlsx"}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown export error";
      console.error("Export failed:", error);
      alert(message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewHistory = () => {
    if (selectedClassId) {
      setShowHistory(true);
    }
  };

  const handleBackFromHistory = () => {
    setShowHistory(false);
    setViewHistoryId(null);
  };

  const handleViewHistoryItem = (historyId: string) => {
    setViewHistoryId(historyId);
    setShowHistory(false);
  };

  const handleCompareHistory = (id1: string, id2: string) => {
    setCompareHistoryIds({ id1, id2 });
    setShowHistory(false);
  };

  const handleBackFromComparison = () => {
    setCompareHistoryIds(null);
    setShowHistory(true);
  };

  const handleBackFromHistoryView = () => {
    setViewHistoryId(null);
    setShowHistory(true);
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  // Show a read-only snapshot of a generated version.
  if (viewHistoryId) {
    return (
      <TimetableHistoryView
        historyId={viewHistoryId}
        onBack={handleBackFromHistoryView}
      />
    );
  }

  // Show comparison view
  if (compareHistoryIds) {
    return (
      <TimetableComparison
        historyId1={compareHistoryIds.id1}
        historyId2={compareHistoryIds.id2}
        onBack={handleBackFromComparison}
      />
    );
  }

  // Show history view
  if (showHistory && selectedClassId) {
    return (
      <TimetableHistory
        classId={selectedClassId}
        className={selectedClass?.name || "Unknown Class"}
        onBack={handleBackFromHistory}
        onViewHistory={handleViewHistoryItem}
        onCompare={handleCompareHistory}
      />
    );
  }

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
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-bold tracking-widest uppercase">
                {t("timetablePageBadge")}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {t("timetablePageTitle")}{" "}
              <span className="text-primary">
                {t("timetablePageTitleHighlight")}
              </span>
            </h1>
            <p className="text-muted-foreground max-w-md">
              {t("timetablePageDesc")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={exportFormat}
              onValueChange={(value: "xlsx" | "pdf") => setExportFormat(value)}
            >
              <SelectTrigger className="h-12 w-[100px] rounded-xl bg-background/50 border-primary/5 focus:ring-primary/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-primary/10">
                <SelectItem value="xlsx" className="rounded-lg">
                  XLSX
                </SelectItem>
                <SelectItem value="pdf" className="rounded-lg">
                  PDF
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-primary/10 hover:bg-primary/5"
              onClick={handleViewHistory}
              disabled={!selectedClassId}
              title="View History"
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-primary/10 hover:bg-primary/5"
            >
              <Printer className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-primary/10 hover:bg-primary/5"
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-xl border-primary/10 hover:bg-primary/5"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </motion.div>

      {/* Controls Section */}
      <motion.div
        variants={item}
        className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border border-primary/5 shadow-sm"
      >
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">
              {t("timetableClassLabel")}
            </span>
          </div>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger className="w-full md:w-[280px] h-12 rounded-xl bg-background/50 border-primary/5 focus:ring-primary/10">
              <SelectValue placeholder={t("timetableSelectClass")} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-primary/10">
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id} className="rounded-lg">
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Timetable Grid */}
      <motion.div variants={item} className="relative">
        <div className="absolute -inset-4 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-[2.5rem] blur-2xl -z-10" />
        <TimetableGrid classId={selectedClassId} />
      </motion.div>

      {/* Off-screen copies of the exact timetable presentation used for PDF export. */}
      <div className="fixed left-[-100000px] top-0 pointer-events-none">
        {classes.map((cls) => (
          <TimetableExportDocument
            key={cls.id}
            classData={cls}
            timetable={timetable}
            days={days}
            periods={periods}
            ref={(node) => {
              if (node) {
                exportRefs.current.set(cls.id, node);
              } else {
                exportRefs.current.delete(cls.id);
              }
            }}
          />
        ))}
      </div>

      <InitializeDaysModal
        isOpen={isInitModalOpen}
        onClose={() => setIsInitModalOpen(false)}
        onSuccess={refreshDays}
      />
      <AddPeriodModal
        isOpen={isPeriodModalOpen}
        onClose={() => setIsPeriodModalOpen(false)}
        onSuccess={refreshPeriods}
      />
      <AddTimetableEntryModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSuccess={refreshTimetable}
        initialClassId={selectedClassId}
      />
    </motion.div>
  );
}

export default function TimetablePage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground font-medium">
          Loading schedule planner...
        </div>
      }
    >
      <TimetableContent />
    </React.Suspense>
  );
}
