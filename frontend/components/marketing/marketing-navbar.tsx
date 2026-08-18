"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, ArrowRight, Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n/language-context";
import { Language } from "@/lib/i18n/translations";
import logo from "@/public/TTG_Logo.png";

export function MarketingNavbar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languageLabels: Record<Language, string> = {
    en: "English",
    fa: "دری",
    ps: "پښتو",
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/5 bg-background/40 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo matching Sidebar */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            className="h-10 w-12 object-contain group-hover:scale-105 transition-transform duration-300"
            src={logo.src}
            alt="TimeTable Logo"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              TimeTable
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60">
              Professional
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#packages"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("navPackages")}
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("navFeatures")}
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector Dropdown */}
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 rounded-xl border border-primary/10 hover:bg-primary/5 text-xs font-semibold flex items-center gap-2"
                >
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{languageLabels[language]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-xl p-1 border-primary/10">
                <DropdownMenuItem
                  onClick={() => setLanguage("en")}
                  className={`rounded-lg cursor-pointer text-xs font-medium ${
                    language === "en" ? "bg-primary/10 text-primary font-bold" : ""
                  }`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("fa")}
                  className={`rounded-lg cursor-pointer text-xs font-medium ${
                    language === "fa" ? "bg-primary/10 text-primary font-bold" : ""
                  }`}
                >
                  دری (Dari)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage("ps")}
                  className={`rounded-lg cursor-pointer text-xs font-medium ${
                    language === "ps" ? "bg-primary/10 text-primary font-bold" : ""
                  }`}
                >
                  پښتو (Pashto)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-xl hover:bg-background shadow-none transition-all duration-300"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 text-orange-500" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>

          <Link href="/login">
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-primary/10 hover:bg-primary/5 text-xs font-semibold"
            >
              {t("navSignIn")}
            </Button>
          </Link>

          <Link href="/dashboard">
            <Button className="h-10 px-5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-md shadow-primary/20 flex items-center gap-2">
              <span>{t("navDashboard")}</span>
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl border border-primary/10">
                  <Globe className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 rounded-xl p-1 border-primary/10">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("fa")}>دری</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ps")}>پښتو</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 rounded-xl"
          >
            {mounted && theme === "dark" ? (
              <Sun className="h-4 w-4 text-orange-500" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="h-9 w-9 rounded-xl"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 border-b border-primary/10 p-6 space-y-4">
          <a
            href="#packages"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium"
          >
            {t("navPackages")}
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium"
          >
            {t("navFeatures")}
          </a>
          <div className="pt-4 border-t border-primary/10 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full rounded-xl">
                {t("navSignIn")}
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full rounded-xl">
                {t("navDashboard")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
