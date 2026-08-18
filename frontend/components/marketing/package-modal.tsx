"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Sparkles,
  Building2,
  Phone,
  CreditCard,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/lib/api";

export interface PackageDetails {
  id: string;
  name: string;
  price: string;
  currency: string;
  generations: string;
  validity: string;
  description: string;
  badge?: string;
}

interface PackageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pkg: PackageDetails | null;
}

export function PackageModal({ open, onOpenChange, pkg }: PackageModalProps) {
  const { toast } = useToast();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("hesabpay");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  if (!pkg) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login required",
        description: "Please sign in to link this package request to your account.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiFetch<{ whatsappUrl: string }>("/packages/purchase-requests", {
        method: "POST",
        body: JSON.stringify({
          packageId: pkg.id,
          schoolName,
          phone,
          paymentMethod,
        }),
      });

      setWhatsappUrl(result.whatsappUrl);
      setIsSubmitted(true);
      // Opens the user's WhatsApp with the exact activation request pre-filled.
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      toast({
        title: "WhatsApp request ready",
        description: "WhatsApp opened with your activation message. Press Send to contact the administrator.",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: error instanceof Error ? error.message : "Failed to create purchase request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setWhatsappUrl(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir={dir} className="max-w-xl rounded-3xl p-6 sm:p-8 border-primary/20 bg-background/95 backdrop-blur-2xl shadow-2xl">
        {!isSubmitted ? (
          <>
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> {t("modalTitle")}
                </Badge>
                {pkg.badge && (
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 px-3 py-1 rounded-full font-bold">
                    {pkg.badge}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {t("selectPackage")} <span className="text-primary">{pkg.name}</span>
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {t("modalSub")}
              </DialogDescription>
            </DialogHeader>

            {/* Package Summary Box */}
            <div className="my-4 p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/20 border border-primary/15 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-lg text-foreground">{pkg.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1 text-primary font-bold">
                      <Zap className="h-3.5 w-3.5" /> {pkg.generations}
                    </span>
                    <span>•</span>
                    <span>{pkg.validity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-extrabold text-primary">
                    {pkg.price} <span className="text-sm font-semibold text-muted-foreground">{t("afnCurrency")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">WhatsApp activation message</div>
              <p dir="rtl" className="text-sm font-medium">سلام و علیکم. وقت بخیر. درخواست فعال سازی {pkg.name} را دارم</p>
            </div>

            {/* Optional contact details for the admin dashboard */}
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("modalSchoolLabel")}
                </Label>
                <div className="relative">
                  <Building2 className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="school-name"
                    placeholder={t("modalSchoolPlaceholder")}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="ltr:pl-10 rtl:pr-10 h-11 rounded-xl bg-background/50 border-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("modalPhoneLabel")}
                </Label>
                <div className="relative">
                  <Phone className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("modalPhonePlaceholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ltr:pl-10 rtl:pr-10 h-11 rounded-xl bg-background/50 border-primary/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("modalPaymentLabel")}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("hesabpay")}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex items-center gap-3 ${
                      paymentMethod === "hesabpay"
                        ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm"
                        : "border-primary/10 bg-background/40 text-muted-foreground hover:bg-primary/5"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-bold">{t("modalPayHesab")}</div>
                      <div className="text-[10px] text-muted-foreground">{t("modalPayHesabSub")}</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank")}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all flex items-center gap-3 ${
                      paymentMethod === "bank"
                        ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm"
                        : "border-primary/10 bg-background/40 text-muted-foreground hover:bg-primary/5"
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-primary" />
                    <div>
                      <div className="text-xs font-bold">{t("modalPayBank")}</div>
                      <div className="text-[10px] text-muted-foreground">{t("modalPayBankSub")}</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4 rtl:rotate-180" />
                      <span>{t("modalConfirmBtn")} ({pkg.price} {t("afnCurrency")})</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium pt-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>{t("modalGuarantee")}</span>
              </div>
            </form>
          </>
        ) : (
          <div className="py-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-foreground">{t("modalSuccessTitle")}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {t("modalSuccessSub")} <span className="font-semibold text-foreground">{schoolName}</span>.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-accent/20 border border-primary/10 text-xs text-muted-foreground max-w-md mx-auto">
              {t("modalSuccessMsg")}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              {whatsappUrl && (
                <Button asChild variant="outline" className="rounded-2xl px-8 h-11 font-semibold">
                  <a href={whatsappUrl} target="_blank" rel="noreferrer">Open WhatsApp</a>
                </Button>
              )}
              <Button onClick={resetAndClose} className="rounded-2xl px-8 h-11 font-semibold">
                {t("modalDoneBtn")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
