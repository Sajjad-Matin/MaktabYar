"use client";

import * as React from "react";
import { Bell, Search, User, Moon, Sun, Command, Globe, Settings, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { CommandSearch } from "@/components/command-search";
import { useLanguage } from "@/lib/i18n/language-context";

export function AppNavbar() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary/5 bg-background/40 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 rounded-xl hover:bg-primary/5 transition-colors" />
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-accent/5 border border-primary/5 text-muted-foreground hover:bg-accent/10 transition-colors"
          >
            <Command className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{t("quickSearch")}</span>
            <kbd className="ltr:ml-2 rtl:mr-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder={t("searchPlaceholder")}
              onClick={() => setSearchOpen(true)}
              readOnly
              className="h-11 ltr:pl-11 ltr:pr-4 rtl:pr-11 rtl:pl-4 rounded-2xl bg-background/40 border-primary/5 focus:border-primary/20 focus:ring-primary/10 transition-all duration-300 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-accent/5 border border-primary/5">
            {/* Language Switcher Dropdown */}
            {mounted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-background shadow-none transition-all duration-300"
                  >
                    <Globe className="h-4 w-4 text-primary" />
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

            {/* Theme Toggle */}
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

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-background shadow-none transition-all duration-300"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Badge className="absolute top-1.5 ltr:right-1.5 rtl:left-1.5 h-2 w-2 p-0 rounded-full bg-primary border-2 border-background" />
            </div>
          </div>

          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-2xl border border-primary/10 p-0 overflow-hidden hover:ring-4 hover:ring-primary/5 transition-all duration-300"
                >
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl border-primary/10 p-2 shadow-2xl shadow-primary/5"
              >
                <DropdownMenuLabel className="p-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold">{t("adminUser")}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      admin@timetable.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-primary/5" />
                <div className="p-1">
                  <DropdownMenuItem className="rounded-xl h-10 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">
                    <User className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    <span>{t("viewProfile")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl h-10 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">
                    <Settings className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    <span>{t("accountSettings")}</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="bg-primary/5" />
                <div className="p-1">
                  <DropdownMenuItem className="rounded-xl h-10 cursor-pointer focus:bg-destructive/5 focus:text-destructive transition-colors">
                    <LogOut className="ltr:mr-2 rtl:ml-2 h-4 w-4" />
                    <span>{t("signOut")}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {mounted && <CommandSearch open={searchOpen} setOpen={setSearchOpen} />}
    </header>
  );
}
