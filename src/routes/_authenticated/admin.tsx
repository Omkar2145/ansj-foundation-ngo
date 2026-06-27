import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Registration = Database["public"]["Tables"]["beneficiary_registrations"]["Row"];
type VolunteerProfile = Database["public"]["Tables"]["volunteer_profiles"]["Row"];
type AuditRow = Database["public"]["Tables"]["audit_log"]["Row"];
type KycRow = Database["public"]["Tables"]["kyc_documents"]["Row"];
type ExpenseRow = Database["public"]["Tables"]["expenses"]["Row"];
type DonationRow = Database["public"]["Tables"]["donations"]["Row"];

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — ANSJ Foundation" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setAllowed(false);
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      const has = (roles ?? []).some((r) => r.role === "admin" || r.role === "manager");
      setAllowed(has);
    })();
  }, []);

  if (allowed === null) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
      </main>
    );
  }
  if (!allowed) {
    return (
      <main>
        <PageHeader eyebrow="Restricted" title="Admin access only" subtitle="You need the admin or manager role to view this page." />
        <section className="container mx-auto px-4 py-10 max-w-md text-center">
          <ShieldAlert className="size-12 mx-auto text-muted-foreground mb-4" />
          <Button asChild variant="outline"><Link to="/donor">Back to dashboard</Link></Button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader eyebrow="Admin" title="Operations Console" subtitle="Review registrations, verify documents, and track every action across the platform." />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="registrations">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="registrations">Beneficiary Registrations</TabsTrigger>
            <TabsTrigger value="volunteers">Volunteer Applications</TabsTrigger>
            <TabsTrigger value="kyc">KYC Documents</TabsTrigger>
            <TabsTrigger value="expenses">Expenses & Bills</TabsTrigger>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="registrations" className="mt-6"><RegistrationsTab /></TabsContent>
          <TabsContent value="volunteers" className="mt-6"><VolunteersTab /></TabsContent>
          <TabsContent value="kyc" className="mt-6"><KycTab /></TabsContent>
          <TabsContent value="expenses" className="mt-6"><ExpensesTab /></TabsContent>
          <TabsContent value="donations" className="mt-6"><DonationsTab /></TabsContent>
          <TabsContent value="audit" className="mt-6"><AuditTab /></TabsContent>
        </Tabs>
      </section>
    </main>
  );
}

function statusBadge(status: string) {
  const variants: Record<string, string> = {
    pending: "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200",
    under_review: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
    approved: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    verified: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    completed: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-200",
    failed: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
    rejected: "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-200",
  };
  return <Badge className={variants[status] ?? ""}>{status.replace("_", " ")}</Badge>;
}

async function writeAudit(action: string, entityType: string, entityId: string, before: unknown, after: unknown) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  await supabase.from("audit_log").insert({
    actor_id: userData.user.id,
    actor_email: userData.user.email ?? null,
    action,
    entity_type: entityType,
    entity_id: entityId,
    before_data: before as never,
    after_data: after as never,
  });
}

function RegistrationsTab() {
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("beneficiary_registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const decide = async (row: Registration, status: "approved" | "rejected" | "under_review") => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("beneficiary_registrations")
      .update({
        status,
        review_notes: notes[row.id] ?? row.review_notes,
        reviewed_by: userData.user?.id ?? null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    await writeAudit(`registration.${status}`, "beneficiary_registration", row.id, { status: row.status }, { status });
    toast.success(`Marked ${status.replace("_", " ")}`);
    void load();
  };

  if (loading) return <Loader2 className="size-6 animate-spin text-muted-foreground" />;
  if (!rows.length) return <p className="text-muted-foreground">No registrations yet.</p>;

  return (
    <div className="grid gap-4">
      {rows.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{r.full_name}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {r.beneficiary_kind} • {r.registrant_type} • {r.city ?? "—"}, {r.state ?? "—"} • {new Date(r.created_at).toLocaleDateString()}
              </div>
            </div>
            {statusBadge(r.status)}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <Info label="Phone" value={r.phone} />
              <Info label="DOB" value={r.date_of_birth} />
              <Info label="Income" value={r.monthly_income ? `₹${r.monthly_income}` : null} />
              <Info label="Family" value={r.family_size?.toString()} />
            </div>
            {r.medical_conditions && <p><span className="text-muted-foreground">Medical:</span> {r.medical_conditions}</p>}
            {r.status !== "approved" && r.status !== "rejected" && (
              <>
                <Textarea
                  rows={2}
                  placeholder="Review notes (optional)"
                  value={notes[r.id] ?? r.review_notes ?? ""}
                  onChange={(e) => setNotes((p) => ({ ...p, [r.id]: e.target.value }))}
                />
                <div className="flex gap-2 flex-wrap">
                  {r.status === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => void decide(r, "under_review")}>Mark under review</Button>
                  )}
                  <Button size="sm" onClick={() => void decide(r, "approved")}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => void decide(r, "rejected")}>Reject</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <div className="text-muted-foreground">{label}</div>
      <div>{value ?? "—"}</div>
    </div>
  );
}

function VolunteersTab() {
  const [rows, setRows] = useState<VolunteerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("volunteer_profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const decide = async (row: VolunteerProfile, status: "approved" | "rejected" | "under_review") => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("volunteer_profiles")
      .update({ kyc_status: status, reviewed_by: userData.user?.id ?? null, reviewed_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    await writeAudit(`volunteer.${status}`, "volunteer_profile", row.id, { status: row.kyc_status }, { status });
    toast.success(`Marked ${status}`);
    void load();
  };

  if (loading) return <Loader2 className="size-6 animate-spin text-muted-foreground" />;
  if (!rows.length) return <p className="text-muted-foreground">No volunteer applications yet.</p>;

  return (
    <div className="grid gap-4">
      {rows.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{r.full_name}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {r.occupation ?? "—"} • {r.city ?? "—"} • {r.availability ?? "—"}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(r.skills ?? []).map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
              </div>
            </div>
            {statusBadge(r.kyc_status)}
          </CardHeader>
          <CardContent className="space-y-3">
            {r.why_volunteer && <p className="text-sm italic text-muted-foreground">"{r.why_volunteer}"</p>}
            {r.kyc_status !== "approved" && r.kyc_status !== "rejected" && (
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => void decide(r, "approved")}>Approve</Button>
                <Button size="sm" variant="destructive" onClick={() => void decide(r, "rejected")}>Reject</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KycTab() {
  const [rows, setRows] = useState<KycRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kyc_documents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const verify = async (row: KycRow, verified: boolean) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("kyc_documents")
      .update({ verified, verified_by: userData.user?.id ?? null, verified_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    await writeAudit(`kyc.${verified ? "verified" : "unverified"}`, "kyc_document", row.id, { verified: row.verified }, { verified });
    toast.success(verified ? "Document verified" : "Verification removed");
    void load();
  };

  const viewDoc = async (path: string) => {
    const { data, error } = await supabase.storage.from("kyc-documents").createSignedUrl(path, 60);
    if (error || !data) { toast.error("Cannot open document"); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) return <Loader2 className="size-6 animate-spin text-muted-foreground" />;
  if (!rows.length) return <p className="text-muted-foreground">No KYC documents uploaded yet.</p>;

  return (
    <div className="grid gap-3">
      {rows.map((r) => (
        <Card key={r.id}>
          <CardContent className="py-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-medium text-sm">{r.doc_type.replace(/_/g, " ")} • {r.subject_type}</div>
              <div className="text-xs text-muted-foreground truncate">{r.file_name ?? r.file_path}</div>
              <div className="text-xs text-muted-foreground">Uploaded {new Date(r.created_at).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {r.verified ? <Badge className="bg-emerald-100 text-emerald-900">Verified</Badge> : <Badge variant="outline">Unverified</Badge>}
              <Button size="sm" variant="outline" onClick={() => void viewDoc(r.file_path)}>View</Button>
              {r.verified ? (
                <Button size="sm" variant="ghost" onClick={() => void verify(r, false)}>Unverify</Button>
              ) : (
                <Button size="sm" onClick={() => void verify(r, true)}>Verify</Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ExpensesTab() {
  const [rows, setRows] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const decide = async (row: ExpenseRow, status: "verified" | "rejected") => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("expenses")
      .update({ status, verified_by: userData.user?.id ?? null, verified_at: new Date().toISOString() })
      .eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    await writeAudit(`expense.${status}`, "expense", row.id, { status: row.status }, { status });
    toast.success(`Bill ${status}`);
    void load();
  };

  const viewBill = async (path: string) => {
    const { data, error } = await supabase.storage.from("expense-bills").createSignedUrl(path, 60);
    if (error || !data) { toast.error("Cannot open bill"); return; }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) return <Loader2 className="size-6 animate-spin text-muted-foreground" />;
  if (!rows.length) return <p className="text-muted-foreground">No expenses submitted yet.</p>;

  return (
    <div className="grid gap-4">
      {rows.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{r.category} — ₹{r.amount}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                Vendor: {r.vendor_name} • {r.vendor_phone} • {new Date(r.created_at).toLocaleDateString()}
              </div>
            </div>
            {statusBadge(r.status)}
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {r.vendor_address && <p className="text-xs text-muted-foreground">{r.vendor_address}</p>}
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline" onClick={() => void viewBill(r.bill_path)}>View Bill</Button>
              {r.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => void decide(r, "verified")}>Approve</Button>
                  <Button size="sm" variant="destructive" onClick={() => void decide(r, "rejected")}>Reject</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DonationsTab() {
  const [rows, setRows] = useState<DonationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const decide = async (row: DonationRow, status: "completed" | "failed") => {
    const receipt_number =
      status === "completed" && !row.receipt_number
        ? `ANSJ-${new Date().getFullYear()}-${row.id.slice(0, 8).toUpperCase()}`
        : row.receipt_number;
    const { error } = await supabase
      .from("donations")
      .update({ status, receipt_number })
      .eq("id", row.id);
    if (error) { toast.error(error.message); return; }
    await writeAudit(`donation.${status}`, "donation", row.id, { status: row.status }, { status });
    toast.success(`Donation marked ${status}`);
    void load();
  };

  if (loading) return <Loader2 className="size-6 animate-spin text-muted-foreground" />;
  if (!rows.length) return <p className="text-muted-foreground">No donations yet.</p>;

  return (
    <div className="grid gap-4">
      {rows.map((r) => (
        <Card key={r.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">
                {r.currency} {Number(r.amount).toLocaleString("en-IN")} — {r.category}
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {r.frequency.replace("_", " ")} • {new Date(r.created_at).toLocaleDateString("en-IN")}
                {r.receipt_number && <> • Receipt: {r.receipt_number}</>}
              </div>
            </div>
            {statusBadge(r.status)}
          </CardHeader>
          {r.status === "pending" && (
            <CardContent className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => void decide(r, "completed")}>Mark Completed</Button>
              <Button size="sm" variant="destructive" onClick={() => void decide(r, "failed")}>Mark Failed</Button>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

function AuditTab() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) toast.error(error.message);
      else setRows(data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader2 className="size-6 animate-spin text-muted-foreground" />;
  if (!rows.length) return <p className="text-muted-foreground">No actions logged yet.</p>;

  return (
    <div className="border rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">When</th>
            <th className="text-left p-3 font-medium">Actor</th>
            <th className="text-left p-3 font-medium">Action</th>
            <th className="text-left p-3 font-medium">Entity</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3 text-muted-foreground whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
              <td className="p-3">{r.actor_email ?? "—"}</td>
              <td className="p-3 font-mono text-xs">{r.action}</td>
              <td className="p-3 text-xs">{r.entity_type} <span className="text-muted-foreground">{r.entity_id?.slice(0, 8)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
