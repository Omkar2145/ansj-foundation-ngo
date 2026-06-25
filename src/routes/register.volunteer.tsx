import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

export const Route = createFileRoute("/register/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer Registration — ANSJ Foundation" },
      {
        name: "description",
        content: "Apply to volunteer with ANSJ. Field visits, mentoring, event support, professional skills — every volunteer earns verified hours.",
      },
      { property: "og:title", content: "Volunteer Registration — ANSJ Foundation" },
      { property: "og:description", content: "Apply to volunteer with ANSJ Foundation." },
    ],
    links: [{ rel: "canonical", href: "/register/volunteer" }],
  }),
  component: RegisterVolunteer,
});

const SKILLS = ["Teaching", "Medical", "Legal", "Tech", "Finance", "Design", "Marketing", "Field Work", "Logistics", "Counseling"];
const INTERESTS = ["Child Education", "Elderly Care", "Healthcare", "Disaster Relief", "Skill Training", "Women Empowerment"];

function RegisterVolunteer() {
  const [user, setUser] = useState<{ id: string; email: string | null } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [f, setF] = useState({
    full_name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
    skills: [] as string[],
    interests: [] as string[],
    availability: "",
    why_volunteer: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? null });
        setF((p) => ({ ...p, email: data.user!.email ?? "" }));
      }
      setAuthChecked(true);
    });
  }, []);

  const toggle = (key: "skills" | "interests", value: string) => {
    setF((p) => {
      const arr = p[key];
      return { ...p, [key]: arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value] };
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first");
      return;
    }
    if (!f.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("volunteer_profiles")
        .insert({
          user_id: user.id,
          full_name: f.full_name,
          phone: f.phone || null,
          email: f.email || user.email,
          date_of_birth: f.date_of_birth || null,
          gender: f.gender || null,
          address: f.address || null,
          city: f.city || null,
          state: f.state || null,
          pincode: f.pincode || null,
          occupation: f.occupation || null,
          skills: f.skills.length ? f.skills : null,
          interests: f.interests.length ? f.interests : null,
          availability: f.availability || null,
          why_volunteer: f.why_volunteer || null,
          emergency_contact_name: f.emergency_contact_name || null,
          emergency_contact_phone: f.emergency_contact_phone || null,
          kyc_status: "pending",
        })
        .select("id")
        .single();
      if (error) throw error;
      setProfileId(data.id);
      toast.success("Profile created. Upload your KYC documents below.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (authChecked && !user) {
    return (
      <main>
        <PageHeader eyebrow="Volunteer Registration" title="Sign in to apply" subtitle="Volunteer accounts require a verified login so we can issue hours, certificates, and assign tasks." />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-md text-center">
          <Button asChild size="lg">
            <Link to="/auth">Sign in to continue</Link>
          </Button>
        </section>
      </main>
    );
  }

  if (profileId) {
    return (
      <main>
        <PageHeader
          eyebrow="Volunteer profile saved"
          title="Upload your KYC documents"
          subtitle="These confirm your identity so we can assign you tasks and issue certified hours."
        />
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
          <Card>
            <CardHeader><CardTitle>KYC Documents</CardTitle></CardHeader>
            <CardContent className="grid gap-3">
              <KycUploader label="Aadhaar" docType="aadhaar" subjectType="volunteer" subjectId={profileId} required />
              <KycUploader label="Recent Photo" docType="photo" subjectType="volunteer" subjectId={profileId} required />
              <KycUploader label="Address Proof" docType="address_proof" subjectType="volunteer" subjectId={profileId} required />
            </CardContent>
          </Card>
          <div className="mt-6 flex justify-end gap-3">
            <Button onClick={() => navigate({ to: "/donor" })}>Go to dashboard</Button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <PageHeader
        eyebrow="Volunteer Registration"
        title="Join the ANSJ volunteer team"
        subtitle="Tell us about yourself, your skills, and how you'd like to help. We'll assign you tasks suited to your strengths."
      />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-3xl">
        <form onSubmit={onSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>About You</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *"><Input value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} required /></Field>
              <Field label="Email"><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></Field>
              <Field label="Phone"><Input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
              <Field label="Date of Birth"><Input type="date" value={f.date_of_birth} onChange={(e) => setF({ ...f, date_of_birth: e.target.value })} /></Field>
              <Field label="Gender">
                <Select value={f.gender} onValueChange={(v) => setF({ ...f, gender: v })}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Occupation"><Input value={f.occupation} onChange={(e) => setF({ ...f, occupation: e.target.value })} /></Field>
              <div className="sm:col-span-2">
                <Field label="Address"><Textarea rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field>
              </div>
              <Field label="City"><Input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></Field>
              <Field label="State"><Input value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} /></Field>
              <Field label="Pincode"><Input value={f.pincode} onChange={(e) => setF({ ...f, pincode: e.target.value })} /></Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Skills & Interests</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm">Skills you can contribute</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILLS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggle("skills", s)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition ${
                        f.skills.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm">Areas you're passionate about</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INTERESTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggle("interests", s)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition ${
                        f.interests.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Availability">
                <Select value={f.availability} onValueChange={(v) => setF({ ...f, availability: v })}>
                  <SelectTrigger><SelectValue placeholder="How often can you help?" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekends">Weekends only</SelectItem>
                    <SelectItem value="evenings">Weekday evenings</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="full_time">Full time</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Why do you want to volunteer?">
                <Textarea rows={3} value={f.why_volunteer} onChange={(e) => setF({ ...f, why_volunteer: e.target.value })} />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Emergency Contact</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><Input value={f.emergency_contact_name} onChange={(e) => setF({ ...f, emergency_contact_name: e.target.value })} /></Field>
              <Field label="Phone"><Input value={f.emergency_contact_phone} onChange={(e) => setF({ ...f, emergency_contact_phone: e.target.value })} /></Field>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Saving..." : "Continue to KYC upload"}
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
