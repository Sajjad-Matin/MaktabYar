"use client";

import React from "react";
import { MarketingNavbar } from "@/components/marketing/marketing-navbar";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { LanguageProvider } from "@/lib/i18n/language-context";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[150px]" />
        </div>

        <MarketingNavbar />
        <main className="flex-1 relative z-10">{children}</main>
        <MarketingFooter />
      </div>
    </LanguageProvider>
  );
}
