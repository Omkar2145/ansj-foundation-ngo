import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KycUploader } from "@/components/site/KycUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Kind = Database["public"]["Enums"]["beneficiary_kind"];
type Registrant = Database["public"]["Enums"]["registrant_type"];

export const Route = createFileRoute("/register/beneficiary")({
  head: () => ({
    meta: [
      { title: "Register a Child or Elderly Person — ANSJ Foundation" },
      {
        name: "description",
        content:
          "Submit an application for support. Volunteers, guardians, the elderly themselves, or NGO staff can register a beneficiary for review.",
      },
      { property: "og:title", content: "Register a Beneficiary — ANSJ Foundation" },
      { property: "og:description", content: "Apply for ANSJ Foundation support." },
    ],
    links: [{ rel: "canonical", href: "/register/beneficiary" }],
  }),
  component: RegisterBeneficiary,
});

interface FormState {
  registrant_type: Registrant;
  beneficiary_kind: Kind;
  full_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  monthly_income: string;
  income_source: string;
  bpl_card_number: string;
  family_size: string;
  guardian_name: string;
  guardian_relation: string;
  guardian_phone: string;
  medical_conditions: string;
  disabilities: string;
  current_medications: string;
  bank_name: string;
  bank_account_number: string;
  bank_ifsc: string;
  account_holder_name: string;
  govt_schemes: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
}

const initial: FormState = {
  registrant_type: "guardian",
  beneficiary_kind: "child",
  full_name: "",
  date_of_birth: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  monthly_income: "",
  income_source: "",
  bpl_card_number: "",
  family_size: "",
  guardian_name: "",
  guardian_relation: "",
  guardian_phone: "",
  medical_conditions: "",
  disabilities: "",
  current_medications: "",
  bank_name: "",
  bank_account_number: "",
  bank_ifsc: "",
  account_holder_name: "",
  govt_schemes: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
  emergency_contact_relation: "",
};

function RegisterBeneficiary() {
  const [f, setF] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const navigate = useNavigate();

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const payload = {
        submitted_by: userData.user?.id ?? null,
        registrant_type: f.registrant_type,
        beneficiary_kind: f.beneficiary_kind,
        full_name: f.full_name,
        date_of_birth: f.date_of_birth || null,
        gender: f.gender || null,
        phone: f.phone || null,
        email: f.email || null,
        address: f.address || null,
        city: f.city || null,
        state: f.state || null,
        pincode: f.pincode || null,
        monthly_income: f.monthly_income ? Number(f.monthly_income) : null,
        income_source: f.income_source || null,
        bpl_card_number: f.bpl_card_number || null,
        family_size: f.family_size ? Number(f.family_size) : null,
        guardian_name: f.guardian_name || null,
        guardian_relation: f.guardian_relation || null,
        guardian_phone: f.guardian_phone || null,
        medical_conditions: f.medical_conditions || null,
        disabilities: f.disabilities || null,
        current_medications: f.current_medications || null,
        bank_name: f.bank_name || null,
        bank_account_number: f.bank_account_number || null,
        bank_ifsc: f.bank_ifsc || null,
        account_holder_name: f.account_holder_name || null,
        govt_schemes: f.govt_schemes || null,
        emergency_contact_name: f.emergency_contact_name || null,
        emergency_contact_phone: f.emergency_contact_phone || null,
        emergency_contact_relation: f.emergency_contact_relation || null,
        status: "pending" as const,
      };
      const { data, error } = await supabase
        .from("beneficiary_registrations")
        .insert(payload)
        .select("id")
        .single();
      if (error) throw error;
      setCreatedId(data.id);
      toast.success("Application submitted. Upload supporting documents below to speed up review.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (createdId) {
    return (
      <main>
        <PageHeader
          eyebrow="Application received"
          title="Upload supporting documents"
          subtitle="Your application is in our queue. Upload these documents now to help our team verify and approve quickly."
        />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>KYC & Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {f.beneficiary_kind === "child" ? (
                <>
                  <KycUploader label="Child's Aadhaar" docType="aadhaar" subjectType="beneficiary" subjectId={createdId} required />
                  <KycUploader label="Birth Certificate" docType="birth_certificate" subjectType="beneficiary" subjectId={createdId} required />
                  <KycUploader label="School ID" docType="school_id" subjectType="beneficiary" subjectId={createdId} />
                  <KycUploader label="Parent / Guardian Aadhaar" docType="parent_aadhaar" subjectType="beneficiary" subjectId={createdId} required />
                  <KycUploader label="Bank Passbook (first page)" docType="bank_passbook" subjectType="beneficiary" subjectId={createdId} />
                  <KycUploader label="Recent Photo" docType="photo" subjectType="beneficiary" subjectId={createdId} />
                </>
              ) : (
                <>
                  <KycUploader label="Aadhaar" docType="aadhaar" subjectType="beneficiary" subjectId={createdId} required />
                  <KycUploader label="PAN" docType="pan" subjectType="beneficiary" subjectId={createdId} />
                  <KycUploader label="Voter ID" docType="voter_id" subjectType="beneficiary" subjectId={createdId} />
                  <KycUploader label="Pension Document" docType="pension_document" subjectType="beneficiary" subjectId={createdId} />
                  <KycUploader label="Bank Passbook (first page)" docType="bank_passbook" subjectType="beneficiary" subjectId={createdId} required />
                  <KycUploader label="Recent Photo" docType="photo" subjectType="beneficiary" subjectId={createdId} />
                </>
              )}
            </CardContent>
          </Card>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => navigate({ to: "/" })}>
              Done
            </Button>
            <Button onClick={() => navigate({ to: "/donor" })}>Go to dashboard</Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        eyebrow="Beneficiary Registration"
        title="Register a Child or Elderly Person"
        subtitle="Anyone — volunteers, guardians, the elderly themselves, or NGO staff — can submit this form. Our team will review and follow up."
      />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Who is submitting this?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="I am a">
                <Select value={f.registrant_type} onValueChange={(v) => set("registrant_type", v as Registrant)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                    <SelectItem value="guardian">Parent / Guardian</SelectItem>
                    <SelectItem value="elderly">Elderly person (myself)</SelectItem>
                    <SelectItem value="staff">NGO Staff</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Registering a">
                <Select value={f.beneficiary_kind} onValueChange={(v) => set("beneficiary_kind", v as Kind)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="elderly">Elderly Person</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *"><Input value={f.full_name} onChange={(e) => set("full_name", e.target.value)} required /></Field>
              <Field label="Date of Birth"><Input type="date" value={f.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} /></Field>
              <Field label="Gender">
                <Select value={f.gender} onValueChange={(v) => set("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Phone"><Input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Email"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <div className="sm:col-span-2">
                <Field label="Address"><Textarea rows={2} value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
              </div>
              <Field label="City"><Input value={f.city} onChange={(e) => set("city", e.target.value)} /></Field>
              <Field label="State"><Input value={f.state} onChange={(e) => set("state", e.target.value)} /></Field>
              <Field label="Pincode"><Input value={f.pincode} onChange={(e) => set("pincode", e.target.value)} /></Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Income Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Monthly Household Income (₹)"><Input type="number" min="0" value={f.monthly_income} onChange={(e) => set("monthly_income", e.target.value)} /></Field>
              <Field label="Source of Income"><Input value={f.income_source} onChange={(e) => set("income_source", e.target.value)} /></Field>
              <Field label="BPL / Ration Card #"><Input value={f.bpl_card_number} onChange={(e) => set("bpl_card_number", e.target.value)} /></Field>
              <Field label="Family Size"><Input type="number" min="1" value={f.family_size} onChange={(e) => set("family_size", e.target.value)} /></Field>
            </CardContent>
          </Card>

          {f.beneficiary_kind === "child" && (
            <Card>
              <CardHeader><CardTitle>Family / Guardian</CardTitle></CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Guardian Name"><Input value={f.guardian_name} onChange={(e) => set("guardian_name", e.target.value)} /></Field>
                <Field label="Relation"><Input value={f.guardian_relation} onChange={(e) => set("guardian_relation", e.target.value)} /></Field>
                <Field label="Guardian Phone"><Input value={f.guardian_phone} onChange={(e) => set("guardian_phone", e.target.value)} /></Field>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Medical Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <Field label="Medical Conditions"><Textarea rows={2} value={f.medical_conditions} onChange={(e) => set("medical_conditions", e.target.value)} /></Field>
              <Field label="Disabilities"><Textarea rows={2} value={f.disabilities} onChange={(e) => set("disabilities", e.target.value)} /></Field>
              <Field label="Current Medications"><Textarea rows={2} value={f.current_medications} onChange={(e) => set("current_medications", e.target.value)} /></Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Account Holder Name"><Input value={f.account_holder_name} onChange={(e) => set("account_holder_name", e.target.value)} /></Field>
              <Field label="Bank Name"><Input value={f.bank_name} onChange={(e) => set("bank_name", e.target.value)} /></Field>
              <Field label="Account Number"><Input value={f.bank_account_number} onChange={(e) => set("bank_account_number", e.target.value)} /></Field>
              <Field label="IFSC Code"><Input value={f.bank_ifsc} onChange={(e) => set("bank_ifsc", e.target.value)} /></Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Existing Government Schemes</CardTitle></CardHeader>
            <CardContent>
              <Field label="List any schemes the beneficiary currently receives">
                <Textarea rows={3} placeholder="e.g., MGNREGA, PM-KISAN, Old Age Pension..." value={f.govt_schemes} onChange={(e) => set("govt_schemes", e.target.value)} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Field label="Name"><Input value={f.emergency_contact_name} onChange={(e) => set("emergency_contact_name", e.target.value)} /></Field>
              <Field label="Phone"><Input value={f.emergency_contact_phone} onChange={(e) => set("emergency_contact_phone", e.target.value)} /></Field>
              <Field label="Relation"><Input value={f.emergency_contact_relation} onChange={(e) => set("emergency_contact_relation", e.target.value)} /></Field>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit application"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}
