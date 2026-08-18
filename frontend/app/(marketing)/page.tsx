"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Users,
  BookOpen,
  ArrowRight,
  Check,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageDetails } from "@/components/marketing/package-modal";
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

export default function MultiLangHomePage() {
  const { t, dir } = useLanguage();
  const [packages, setPackages] = useState<PackageDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await apiFetch<any[]>('/packages');
        const mappedPackages: PackageDetails[] = data.map((pkg) => ({
          id: pkg.id,
          name: pkg.name,
          price: pkg.price.toString(),
          currency: t("afnCurrency"),
          generations: pkg.features[0] || '',
          validity: pkg.features[1] || '',
          description: pkg.description,
        }));
        setPackages(mappedPackages);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        // Fallback to hardcoded packages if API fails
        setPackages([
          {
            id: "trial",
            name: t("pkgTrialName"),
            price: "0",
            currency: t("afnCurrency"),
            generations: t("pkgTrialGen"),
            validity: t("pkgTrialVal"),
            description: t("pkgTrialDesc"),
          },
          {
            id: "a1",
            name: t("pkgA1Name"),
            price: "500",
            currency: t("afnCurrency"),
            generations: t("pkgA1Gen"),
            validity: t("pkgA1Val"),
            description: t("pkgA1Desc"),
            badge: t("pkgA1Badge"),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [t]);

  const handleSelectPackage = (pkg: PackageDetails) => {
    const phone = "93764040363";
    const message = `سلام و علیکم. وقت بخیر. درخواست فعال سازی ${pkg.name} را دارم`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-12 pb-16 pt-6 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10"
    >
      {/* Hero Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 md:p-12 lg:p-14"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Clean Title & Description */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">
                {t("heroBadge")}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
              {t("heroTitle1")} <span className="text-primary">{t("heroTitleHighlight")}</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {t("heroDescription")}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#packages">
                <Button className="h-12 px-7 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span>{t("heroBtnPackages")}</span>
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </a>

              <Link href="/login">
                <Button
                  variant="outline"
                  className="h-12 px-7 rounded-2xl border-primary/10 hover:bg-primary/5 font-semibold text-sm"
                >
                  {t("heroBtnSignIn")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Uploaded Mockup Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative group max-w-full">
              <img
                src="/hero-mockup.png"
                alt="TimeTable Professional Mockup"
                className="w-full h-auto max-h-[420px] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        {/* Ambient Blur circles */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Packages & Pricing Section */}
      <motion.section id="packages" variants={item} className="space-y-6 pt-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-primary/10 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              {t("packagesTitle")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t("packagesSubtitle")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => {
            const isFeatured = pkg.id === "a1";
            return (
              <Card
                key={pkg.id}
                className={`glass group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-primary/10 rounded-3xl flex flex-col justify-between ${
                  isFeatured ? "border-primary/30 ring-1 ring-primary/20" : ""
                }`}
              >
                {pkg.badge && (
                  <div className="absolute top-3 ltr:right-3 rtl:left-3 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {pkg.badge}
                  </div>
                )}

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1 min-h-[32px]">
                    {pkg.description}
                  </CardDescription>

                  <div className="pt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-sm font-bold text-primary">{t("afnCurrency")}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-2 pb-6">
                  <div className="space-y-2 border-t border-primary/5 pt-3 text-xs text-muted-foreground font-medium">
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                      <span>{pkg.generations}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{pkg.validity}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSelectPackage(pkg)}
                    className={`w-full h-10 rounded-xl text-xs font-bold transition-all ${
                      isFeatured
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                        : "bg-accent/40 hover:bg-accent text-foreground border border-primary/5"
                    }`}
                  >
                    {isFeatured ? t("pkgA1Btn") : `${t("selectPackage")} ${pkg.name}`}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.section>

      {/* System Features Grid */}
      <motion.section id="features" variants={item} className="space-y-6 pt-4">
        <div className="border-b border-primary/10 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            {t("featuresTitle")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="glass group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-primary/5 rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 w-fit">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t("feat1Title")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("feat1Desc")}
            </p>
          </Card>

          <Card className="glass group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-primary/5 rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t("feat2Title")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("feat2Desc")}
            </p>
          </Card>

          <Card className="glass group relative overflow-hidden transition-all duration-300 hover:shadow-xl border-primary/5 rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-500 w-fit">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">{t("feat3Title")}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("feat3Desc")}
            </p>
          </Card>
        </div>
      </motion.section>

    </motion.div>
  );
}
