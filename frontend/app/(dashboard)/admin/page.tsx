"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, MessageCircle, CheckCircle2, XCircle, RefreshCw, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type Package = {
  id: string;
  name: string;
  price: number;
  generations: number;
  validityDays: number;
  unlimited: boolean;
};

type User = {
  id: string;
  email: string;
  schoolName?: string | null;
  phone?: string | null;
  role: string;
  packageName: string;
  generationLimit: number;
  remainingGenerations: number;
  packageExpiresAt?: string | null;
};

type PurchaseRequest = {
  id: string;
  packageId?: string | null;
  packageName: string;
  price: number;
  status: string;
  createdAt: string;
  user?: { id: string; email: string; schoolName?: string | null; phone?: string | null } | null;
};

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [creditDrafts, setCreditDrafts] = useState<Record<string, string>>({});
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [newUser, setNewUser] = useState({ email: "", password: "", schoolName: "", phone: "", packageId: "" });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch<{ users: User[]; purchaseRequests: PurchaseRequest[]; packages: Package[] }>("/admin/overview");
      setUsers(data.users);
      setRequests(data.purchaseRequests);
      setPackages(data.packages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user?.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }
    if (!authLoading && user?.role === "ADMIN") void load();
  }, [authLoading, user?.role]);

  const activate = async (request: PurchaseRequest) => {
    if (!request.user?.id) {
      setError("This purchase request is not linked to a registered account.");
      return;
    }
    const pkg = packages.find((item) => item.id === request.packageId) ||
      packages.find((item) => item.name === request.packageName);
    if (!pkg) {
      setError("Package definition not found.");
      return;
    }

    try {
      setWorking(request.id);
      await apiFetch("/admin/activate-package", {
        method: "POST",
        body: JSON.stringify({
          userId: request.user.id,
          packageId: pkg.id,
          purchaseRequestId: request.id,
        }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Activation failed");
    } finally {
      setWorking(null);
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.packageId) {
      setError("Email, password and package are required.");
      return;
    }
    try {
      setWorking("create-user");
      await apiFetch("/admin/users", { method: "POST", body: JSON.stringify(newUser) });
      setNewUser({ email: "", password: "", schoolName: "", phone: "", packageId: "" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create user");
    } finally {
      setWorking(null);
    }
  };

  const activateManual = async () => {
    if (!selectedUserId || !selectedPackageId) {
      setError("Select a user and package first.");
      return;
    }
    try {
      setWorking("manual");
      await apiFetch("/admin/activate-package", {
        method: "POST",
        body: JSON.stringify({ userId: selectedUserId, packageId: selectedPackageId }),
      });
      setSelectedUserId("");
      setSelectedPackageId("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Manual activation failed");
    } finally {
      setWorking(null);
    }
  };

  const cancel = async (id: string) => {
    try {
      setWorking(id);
      await apiFetch(`/admin/purchase-requests/${id}/cancel`, { method: "POST" });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cancellation failed");
    } finally {
      setWorking(null);
    }
  };

  const updateCredits = async (id: string) => {
    const value = Number(creditDrafts[id]);
    if (!Number.isInteger(value) || value < -1) return;
    try {
      setWorking(id);
      await apiFetch(`/admin/users/${id}/credits`, {
        method: "POST",
        body: JSON.stringify({ remainingGenerations: value }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Credit update failed");
    } finally {
      setWorking(null);
    }
  };

  if (authLoading || loading) {
    return <div className="p-10 text-center text-muted-foreground">Loading administrator dashboard...</div>;
  }

  if (user?.role !== "ADMIN") return null;

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-primary/10 bg-primary/5 p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Full Access</span>
            </div>
            <h1 className="mt-2 text-4xl font-bold">Administrator Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage package activations, WhatsApp requests and user generation credits.</p>
          </div>
          <Button variant="outline" onClick={load}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
        </div>
      </div>

      {error && <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}


      <Card className="rounded-[2rem] border-primary/10">
        <CardHeader><CardTitle>Add New Customer & Activate Package</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Email *" type="email" value={newUser.email} onChange={(e) => setNewUser((v) => ({ ...v, email: e.target.value }))} />
          <Input placeholder="Password * (8+ characters)" type="password" value={newUser.password} onChange={(e) => setNewUser((v) => ({ ...v, password: e.target.value }))} />
          <Input placeholder="School / Institution" value={newUser.schoolName} onChange={(e) => setNewUser((v) => ({ ...v, schoolName: e.target.value }))} />
          <Input placeholder="Phone / WhatsApp" value={newUser.phone} onChange={(e) => setNewUser((v) => ({ ...v, phone: e.target.value }))} />
          <select className="h-11 rounded-xl border bg-background px-3 text-sm" value={newUser.packageId} onChange={(e) => setNewUser((v) => ({ ...v, packageId: e.target.value }))}>
            <option value="">Select package *</option>
            {packages.map((item) => <option key={item.id} value={item.id}>{item.name} — {item.unlimited ? "Unlimited" : `${item.generations} generations`}</option>)}
          </select>
          <Button disabled={working === "create-user"} onClick={createUser}>Create User & Activate</Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-primary/10">
        <CardHeader><CardTitle>Manual Package Activation</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <select
            className="h-11 rounded-xl border bg-background px-3 text-sm"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Select user</option>
            {users.filter((item) => item.role !== "ADMIN").map((item) => (
              <option key={item.id} value={item.id}>{item.schoolName || item.email} — {item.email}</option>
            ))}
          </select>
          <select
            className="h-11 rounded-xl border bg-background px-3 text-sm"
            value={selectedPackageId}
            onChange={(e) => setSelectedPackageId(e.target.value)}
          >
            <option value="">Select package</option>
            {packages.map((item) => (
              <option key={item.id} value={item.id}>{item.name} — {item.unlimited ? "Unlimited" : item.generations} generations</option>
            ))}
          </select>
          <Button disabled={working === "manual"} onClick={activateManual}>Activate</Button>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-primary/10">
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5 text-emerald-500" />Purchase Requests</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {requests.length === 0 && <p className="text-sm text-muted-foreground">No purchase requests yet.</p>}
          {requests.map((request) => (
            <div key={request.id} className="flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Badge>{request.packageName}</Badge>
                  <Badge variant={request.status === "PENDING" ? "secondary" : "outline"}>{request.status}</Badge>
                </div>
                <div className="mt-2 font-semibold">{request.user?.schoolName || "Unknown school"}</div>
                <div className="text-sm text-muted-foreground">{request.user?.email || "Unlinked request"} · {request.user?.phone || "No phone"}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(request.createdAt).toLocaleString()}</div>
              </div>
              {request.status === "PENDING" && (
                <div className="flex gap-2">
                  <Button disabled={working === request.id || !request.user?.id} onClick={() => activate(request)}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />Activate
                  </Button>
                  <Button variant="outline" disabled={working === request.id} onClick={() => cancel(request.id)}>
                    <XCircle className="mr-2 h-4 w-4" />Cancel
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-primary/10">
        <CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" />Users & Generation Credits</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {users.map((item) => (
            <div key={item.id} className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
              <div>
                <div className="font-semibold">{item.schoolName || item.email}</div>
                <div className="text-sm text-muted-foreground">{item.email}</div>
                <div className="mt-1 text-xs text-muted-foreground">Package: {item.packageName} · {item.remainingGenerations === -1 ? "Unlimited" : `${item.remainingGenerations} remaining`}</div>
              </div>
              <div className="text-sm font-semibold">{item.role}</div>
              <div className="flex gap-2">
                <Input
                  className="w-28"
                  type="number"
                  min="-1"
                  placeholder={String(item.remainingGenerations)}
                  value={creditDrafts[item.id] ?? ""}
                  onChange={(e) => setCreditDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))}
                />
                <Button variant="outline" disabled={working === item.id} onClick={() => updateCredits(item.id)}>Set</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
