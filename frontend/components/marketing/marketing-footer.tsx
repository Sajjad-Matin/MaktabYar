"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/language-context";
import logo from "@/public/TTG_Logo.png";

export function MarketingFooter() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-primary/10 bg-background/40 backdrop-blur-xl py-10">
      <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <img
            className="h-10 w-14 object-contain"
            src={logo.src}
            alt={t("brandAlt")}
          />
          <div className="flex flex-col text-left rtl:text-right">
            <span className="text-sm font-bold text-foreground">{t("footerTitle")}</span>
            <span>{t("footerSub")}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <a href="#packages" className="hover:text-foreground transition-colors">
            {t("navPackages")}
          </a>
          <Link href="/login" className="hover:text-foreground transition-colors">
            {t("navSignIn")}
          </Link>
          <Link href="/dashboard" className="hover:text-foreground transition-colors">
            {t("navDashboard")}
          </Link>
        </div>

        <div>
          <span>© {new Date().getFullYear()} {t("footerRights")}</span>
        </div>
      </div>
    </footer>
  );
}
