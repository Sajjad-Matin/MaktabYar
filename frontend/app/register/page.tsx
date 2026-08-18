"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Lock,
  Mail,
  Building2,
  Phone,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/public/TTG_Logo.png";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register } = useAuth();
  const [schoolName, setSchoolName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(email, password, schoolName, phone);
      toast({
        title: "Registration Successful! 🎉",
        description: `Account created for ${schoolName}. Navigating to dashboard...`,
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
      </div>

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              className="h-12 w-12 object-contain group-hover:scale-105 transition-transform"
              src={logo.src}
              alt="Logo"
            />
            <span className="text-2xl font-bold tracking-tight text-foreground">
              TimeTable <span className="text-primary font-extrabold">Generator</span>
            </span>
          </Link>
          <p className="text-xs text-muted-foreground font-medium">
            Register New School / University Account
          </p>
        </div>

        {/* Register Card */}
        <Card className="rounded-3xl border-primary/20 bg-background/80 backdrop-blur-2xl shadow-2xl shadow-primary/10 overflow-hidden">
          <CardHeader className="space-y-4 pb-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> School Onboarding
              </Badge>
              <Link href="/login" className="text-xs font-medium text-primary hover:underline">
                Already registered? Sign In
              </Link>
            </div>

            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-foreground">
                Create Institution Account
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Enter your institution details and select your initial timetable package.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleRegister} className="space-y-4">
              {/* School Name */}
              <div className="space-y-2">
                <Label htmlFor="school" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  School / Institution Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="school"
                    placeholder="e.g., Marefat High School"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-background/50 border-primary/10"
                    required
                  />
                </div>
              </div>

              {/* Admin Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="admin@school.edu.af"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-background/50 border-primary/10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone / WhatsApp
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      placeholder="0799 XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-11 rounded-xl bg-background/50 border-primary/10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="reg-pass" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Create Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reg-pass"
                    type="password"
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-background/50 border-primary/10"
                    required
                  />
                </div>
              </div>

              {/* Included Trial */}
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Included Package
                </Label>
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>Free Trial</span>
                    <span className="text-emerald-500">1 Generation</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    7 days validity. Paid packages can be activated through WhatsApp after registration.
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account & Continue</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="bg-primary/5 p-4 border-t border-primary/10 text-center text-xs text-muted-foreground">
            <span className="w-full flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Instant trial setup & payment receipt guarantee
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
