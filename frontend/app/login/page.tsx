"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { LanguageProvider, useLanguage } from "@/lib/i18n/language-context";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/public/TTG_Logo.png";

function LoginContent() {
  const router = useRouter();
  const { toast } = useToast();
  const { t, language, setLanguage, dir } = useLanguage();
  const { login } = useAuth();
  const [role, setRole] = useState<"admin" | "principal" | "teacher">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: t("loginTitle"),
        description: t("loginSub"),
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail("admin@timetable.com");
    setPassword("admin123");
    setRole("admin");
    toast({
      title: "Demo Credentials Loaded",
      description: "Click Sign In to access the dashboard.",
    });
  };

  return (
    <div dir={dir} className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Background Decorative Blur circles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Top bar with Logo & Language selector */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              className="h-14 w-20 object-contain group-hover:scale-105 transition-transform"
              src={logo.src}
              alt={t("brandAlt")}
            />
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-2xl font-bold tracking-tight text-foreground">{t("brandName")}</span>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl border border-primary/10 text-xs font-medium">
                <Globe className="h-4 w-4 text-primary mr-1" />
                <span>{language === "en" ? "English" : language === "fa" ? "دری" : "پښتو"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-primary/10">
              <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fa")}>دری</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ps")}>پښتو</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Login Card matching Dashboard Card style */}
        <Card className="rounded-3xl border-primary/10 bg-background/80 backdrop-blur-xl shadow-xl overflow-hidden">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  {t("loginAuthBadge")}
                </span>
              </div>
              <Link href="/" className="text-xs font-medium text-muted-foreground hover:text-foreground">
                {t("loginReturnHome")}
              </Link>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-foreground">
                {t("loginTitle")}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {t("loginSub")}
              </CardDescription>
            </div>

            {/* Role Switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-accent/30 border border-primary/5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`py-1.5 rounded-xl transition-all ${
                  role === "admin"
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("roleAdmin")}
              </button>
              <button
                type="button"
                onClick={() => setRole("principal")}
                className={`py-1.5 rounded-xl transition-all ${
                  role === "principal"
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("rolePrincipal")}
              </button>
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`py-1.5 rounded-xl transition-all ${
                  role === "teacher"
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t("roleTeacher")}
              </button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
                  {t("loginEmailLabel")}
                </Label>
                <div className="relative">
                  <Mail className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@school.edu.af"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="ltr:pl-10 rtl:pr-10 h-11 rounded-xl bg-background/50 border-primary/10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                    {t("loginPassLabel")}
                  </Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    {t("loginForgotPass")}
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute ltr:left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="ltr:pl-10 ltr:pr-10 rtl:pr-10 rtl:pl-10 h-11 rounded-xl bg-background/50 border-primary/10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute ltr:right-3.5 rtl:left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>{t("loginSubmitBtn")}</span>
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </>
                )}
              </Button>
            </form>

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={handleQuickDemo}
                className="w-full h-9 rounded-xl border-dashed border-primary/20 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5"
              >
                {t("loginDemoBtn")}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="bg-primary/5 p-4 border-t border-primary/10 flex items-center justify-between text-xs text-muted-foreground">
            <span>{t("loginPkgCallout")}</span>
            <Link href="/#packages" className="font-semibold text-primary hover:underline">
              {t("loginViewPkg")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function CleanLoginPage() {
  return (
    <LanguageProvider>
      <LoginContent />
    </LanguageProvider>
  );
}
