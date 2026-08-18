"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Users,
  BookOpen,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { useTeacher } from "@/hooks/teacher/use-teachers";
import { useClass } from "@/hooks/class/use-class";
import { useSubject } from "@/hooks/subject/use-subject";
import { useLanguage } from "@/lib/i18n/language-context";

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

export default function DashboardPage() {
  const { teachers } = useTeacher();
  const { classes } = useClass();
  const { subjects } = useSubject();
  const { t } = useLanguage();

  const stats = [
    {
      title: t("statClassesTitle"),
      value: classes.length,
      icon: Calendar,
      description: t("statClassesDesc"),
      color: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: t("statTeachersTitle"),
      value: teachers.length,
      icon: Users,
      description: t("statTeachersDesc"),
      color: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: t("statSubjectsTitle"),
      value: subjects.length,
      icon: BookOpen,
      description: t("statSubjectsDesc"),
      color: "from-orange-500/20 to-yellow-500/20",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8"
    >
      {/* Welcome Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-12"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold tracking-wider uppercase">
              {t("dashOverview")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            {t("dashWelcome")} <span className="text-primary">{t("roleAdmin")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("dashWelcomeMsg")}{" "}
            {classes.length} {t("dashActiveClasses")} {teachers.length} {t("dashTeachersAssigned")}
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div key={index} variants={item}>
            <Card className="glass group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-primary/5">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2 rounded-xl bg-accent/50 ${stat.iconColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs font-medium text-emerald-500">
                    <ArrowUpRight className="h-3 w-3 mr-0.5 rtl:rotate-180" />
                    <span>{t("statActive")}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <motion.div variants={item} className="grid gap-8 lg:grid-cols-1">
        <QuickActions />
      </motion.div>
    </motion.div>
  );
}
