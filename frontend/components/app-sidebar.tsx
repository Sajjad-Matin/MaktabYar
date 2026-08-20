"use client";

import * as React from "react";
import {
  Calendar,
  LayoutDashboard,
  Users,
  BookOpen,
  Library,
  Settings,
  ChevronRight,
  ChevronLeft,
  ClipboardList,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/public/TTG_Logo.png";

export function AppSidebar() {
  const pathname = usePathname();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      title: t("menuDashboard"),
      url: "/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      title: t("menuTeachers"),
      url: "/teachers",
      icon: Users,
      color: "text-orange-500",
    },
    {
      title: t("menuClasses"),
      url: "/classes",
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: t("menuSubjects"),
      url: "/subjects",
      icon: Library,
      color: "text-pink-500",
    },
    {
      title: t("menuAssignments"),
      url: "/assignments",
      icon: ClipboardList,
      color: "text-cyan-500",
    },
    {
      title: t("menuTimetable"),
      url: "/timetable",
      icon: Calendar,
      color: "text-purple-500",
    },
    {
      title: t("menuTeacherTimetable"),
      url: "/teacher-timetable",
      icon: ClipboardList,
      color: "text-indigo-500",
    },
    {
      title: t("menuSettings"),
      url: "/settings",
      icon: Settings,
      color: "text-slate-500",
    },
    ...(user?.role === "ADMIN"
      ? [
          {
            title: "Admin",
            url: "/admin",
            icon: ShieldCheck,
            color: "text-red-500",
          },
        ]
      : []),
  ];

  const sidebarSide = dir === "rtl" ? "right" : "left";

  if (!mounted) {
    return (
      <Sidebar
        side={sidebarSide}
        className="border-r border-primary/5 bg-background/40 backdrop-blur-xl"
      >
        <SidebarHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/10" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-20 rounded bg-primary/5" />
              <div className="h-2 w-12 rounded bg-primary/5" />
            </div>
          </div>
        </SidebarHeader>
      </Sidebar>
    );
  }

  return (
    <Sidebar
      side={sidebarSide}
      className="border-r border-primary/5 bg-background/40 backdrop-blur-xl"
    >
      <SidebarHeader className="p-6">
        <Link href="/dashboard" className="group flex items-center gap-3">
          <img
            className="h-16 w-20 object-contain group-hover:scale-110 transition-transform duration-300"
            src={logo.src}
            alt={t("brandAlt")}
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {t("brandName")}
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 pb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            {t("mainNavigation")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "relative h-12 rounded-xl px-4 transition-all duration-300",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "hover:bg-primary/5 hover:translate-x-1 rtl:hover:-translate-x-1",
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-300",
                            isActive
                              ? "bg-primary/20"
                              : "bg-accent/5 group-hover:bg-accent/10",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="active-indicator"
                            className="ltr:ml-auto rtl:mr-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                          >
                            {dir === "rtl" ? (
                              <ChevronLeft className="h-3 w-3 text-primary" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-primary" />
                            )}
                          </motion.div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-accent/5 p-4 border border-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src="/avatars/admin.png" />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold truncate">
                {t("adminUser")}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {t("systemAdmin")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/" className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors text-xs"
              >
                {t("website")}
              </Button>
            </Link>
            <Link href="/login" className="w-full">
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-9 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors text-xs"
              >
                <LogOut className="h-3.5 w-3.5 ltr:mr-1 rtl:ml-1" />
                {t("exit")}
              </Button>
            </Link>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
