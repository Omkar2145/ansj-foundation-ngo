import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Download,
  LogOut,
  Users,
  IndianRupee,
  Calendar,
  Loader2,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { generateReceiptPDF } from "@/lib/receipt";
import { MessageThread } from "@/components/site/MessageThread";

export const Route = createFileRoute("/_authenticated/donor")({
  head: () => ({ meta: [{ title: "Donor Dashboard · ANSJ Foundation" }] }),
  component: DonorDashboard,
});

type Donation = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  campaign: string | null;
  frequency: string;
  status: string;
  receipt_number: string | null;
  transaction_ref: string | null;
  created_at: string;
};

type Sponsorship = {
  id: string;
  beneficiary_id: string;
  beneficiary_name: string | null;
  category: string;
  monthly_amount: number;
  status: string;
  started_at: string;
  next_renewal_at: string | null;
};

type Profile = {
  full_name: string | null;
  phone: string | null;
  pan_number: string | null;
  address: string | null;
};

function DonorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
    pan_number: "",
    address: "",
  });
  const [donations, setDonations] = useState<Donation[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setEmail(userData.user.email ?? "");
      const [{ data: p }, { data: d }, { data: s }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle(),
        supabase.from("donations").select("*").order("created_at", { ascending: false }),
        supabase.from("sponsorships").select("*").order("started_at", { ascending: false }),
      ]);
      if (p) setProfile(p);
      if (d) setDonations(d as Donation[]);
      if (s) setSponsorships(s as Sponsorship[]);
      setLoading(false);
    })();
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", userData.user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const downloadReceipt = (don: Donation) => {
    generateReceiptPDF({
      receiptNumber: don.receipt_number ?? `TMP-${don.id.slice(0, 8).toUpperCase()}`,
      donorName: profile.full_name ?? "Anonymous Donor",
      donorEmail: email,
      pan: profile.pan_number,
      amount: Number(don.amount),
      currency: don.currency,
      category: don.category,
      frequency: don.frequency,
      date: new Date(don.created_at).toLocaleDateString("en-IN"),
      transactionRef: don.transaction_ref,
    });
  };

  const totalDonated = donations
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + Number(d.amount), 0);
  const activeSponsorships = sponsorships.filter((s) => s.status === "active").length;

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Namaste, {profile.full_name || email.split("@")[0]}
            </h1>
            <p className="text-muted-foreground mt-1">Your impact at ANSJ Foundation</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="size-4 mr-2" /> Sign out
          </Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <IndianRupee className="size-4" /> Total Donated
            </div>
            <div className="text-3xl font-bold mt-2">
              ₹{totalDonated.toLocaleString("en-IN")}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <Heart className="size-4" /> Donations
            </div>
            <div className="text-3xl font-bold mt-2">{donations.length}</div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3 text-muted-foreground text-sm">
              <Users className="size-4" /> Active Sponsorships
            </div>
            <div className="text-3xl font-bold mt-2">{activeSponsorships}</div>
          </Card>
        </div>

        <Tabs defaultValue="donations">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="sponsorships">Sponsorships</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="mt-4">
            <Card className="p-6">
              {donations.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="size-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No donations yet</p>
                  <Button asChild className="mt-4">
                    <a href="/donate">Make your first donation</a>
                  </Button>
                </div>
              ) : (
                <div className="divide-y">
                  {donations.map((d) => (
                    <div
                      key={d.id}
                      className="py-4 flex items-center justify-between flex-wrap gap-3"
                    >
                      <div>
                        <div className="font-semibold">
                          ₹{Number(d.amount).toLocaleString("en-IN")}{" "}
                          <span className="text-xs text-muted-foreground font-normal">
                            · {d.category} · {d.frequency.replace("_", " ")}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                          <Calendar className="size-3" />
                          {new Date(d.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          <Badge
                            variant={d.status === "completed" ? "default" : "secondary"}
                            className="ml-2"
                          >
                            {d.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(d)}
                      >
                        <Download className="size-4 mr-1" /> 80G Receipt
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="sponsorships" className="mt-4">
            <Card className="p-6">
              {sponsorships.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="size-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No active sponsorships</p>
                  <Button asChild className="mt-4">
                    <a href="/sponsor">Sponsor a child or elder</a>
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {sponsorships.map((s) => (
                    <Card key={s.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{s.beneficiary_name}</div>
                          <Badge variant="outline" className="mt-1 capitalize">
                            {s.category}
                          </Badge>
                        </div>
                        <Badge>{s.status}</Badge>
                      </div>
                      <div className="mt-3 text-2xl font-bold">
                        ₹{Number(s.monthly_amount).toLocaleString("en-IN")}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                      {s.next_renewal_at && (
                        <div className="text-xs text-muted-foreground mt-2">
                          Renews{" "}
                          {new Date(s.next_renewal_at).toLocaleDateString("en-IN")}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <Card className="p-6">
              <MessageThread
                sponsorships={sponsorships
                  .filter((s) => s.status === "active")
                  .map((s) => ({ beneficiary_id: s.beneficiary_id, beneficiary_name: s.beneficiary_name }))}
              />
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-4">
            <Card className="p-6 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <UserIcon className="size-6" />
                </div>
                <div>
                  <div className="font-semibold">{email}</div>
                  <div className="text-xs text-muted-foreground">Donor account</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label>Full name</Label>
                  <Input
                    value={profile.full_name ?? ""}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={profile.phone ?? ""}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>PAN (for 80G)</Label>
                  <Input
                    value={profile.pan_number ?? ""}
                    onChange={(e) =>
                      setProfile({ ...profile, pan_number: e.target.value.toUpperCase() })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address</Label>
                  <Input
                    value={profile.address ?? ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  />
                </div>
              </div>
              <Button className="mt-6" onClick={saveProfile} disabled={saving}>
                {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                Save Profile
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
