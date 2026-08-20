"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";
import logo from "@/public/TTG_Logo.png";

export function MarketingFooter() {
  const { t } = useLanguage();
  const whatsappPackageUrl = `https://wa.me/93764040363?text=${encodeURIComponent("سلام وقت بخیر. درخواست پکیج خصوصی دارم")}`;
  const whatsappUrl = `https://wa.me/93764040363?`;

  return (
    <footer className="border-t border-primary/10 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-10 px-6 py-14 text-sm text-muted-foreground md:grid-cols-3 md:gap-12 lg:px-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img className="h-12 w-16 object-contain" src={logo.src} alt={t("brandAlt")} />
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-lg font-bold text-foreground">{t("footerTitle")}</span>
              <span className="text-xs">{t("footerSub")}</span>
            </div>
          </div>
          <p className="max-w-sm leading-relaxed">{t("footerSystemDescription")}</p>
          <p className="text-xs text-muted-foreground/70">© {new Date().getFullYear()} {t("footerRights")}</p>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
            {t("footerPagesTitle")}
          </h2>
          <nav className="flex flex-col items-start gap-3 font-medium">
            <a href="#packages" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
              {t("navPackages")} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <a href="#features" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
              {t("navFeatures")} <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            <Link href="/login" className="transition-colors hover:text-foreground">{t("navSignIn")}</Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground">{t("navDashboard")}</Link>
          </nav>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
            {t("footerServicesTitle")}
          </h2>
          <div className="flex flex-col items-start gap-3 font-medium">
            <a href={whatsappPackageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80">
              <MessageCircle className="h-4 w-4" />
              {t("footerCustomPackage")}
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-foreground">
              {t("footerContactWhatsApp")}
            </a>
            <span className="pt-4 text-xs text-muted-foreground/70">{t("footerBuiltBy")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
