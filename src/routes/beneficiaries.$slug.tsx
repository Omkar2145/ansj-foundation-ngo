import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { computeImpactScore } from "@/lib/ai-impact.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ShieldCheck,
  MapPin,
  Heart,
  Sparkles,
  Video,
  MessageSquare,
  Loader2,
  Send,
  Calendar as CalIcon,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/beneficiaries/$slug")({
  loader: async ({ params }) => {
    const { data, error } = await supabase
      .from("beneficiaries")
      .select("*")
      .eq("slug", params.slug)
      .eq("active", true)
      .maybeSingle();
    if (error || !data) throw notFound();
    return { beneficiary: data };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.beneficiary.name} · Sponsor · ANSJ Foundation` },
          {
            name: "description",
            content: `Sponsor ${loaderData.beneficiary.name}, ${loaderData.beneficiary.age} from ${loaderData.beneficiary.location}. ${(loaderData.beneficiary.story ?? "").slice(0, 140)}`,
          },
          { property: "og:title", content: `${loaderData.beneficiary.name} · ANSJ Foundation` },
          { property: "og:image", content: loaderData.beneficiary.image_url ?? "" },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen pt-32 text-center">
      <h1 className="text-2xl font-bold">Beneficiary not found</h1>
      <Link to="/sponsor" className="text-primary underline mt-4 inline-block">
        Browse all beneficiaries
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen pt-32 text-center">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
  component: BeneficiaryPage,
});

type Beneficiary = ReturnType<typeof Route.useLoaderData>["beneficiary"];

function BeneficiaryPage() {
  const { beneficiary } = Route.useLoaderData();
  return <BeneficiaryView b={beneficiary as Beneficiary} />;
}

function BeneficiaryView({ b }: { b: Beneficiary }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isSponsor, setIsSponsor] = useState(false);
  const [impact, setImpact] = useState<{ score: number; summary: string } | null>(null);
  const [updates, setUpdates] = useState<{ id: string; title: string; body: string; created_at: string }[]>([]);
  const [messages, setMessages] = useState<{ id: string; body: string; sender_id: string; created_at: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [computing, setComputing] = useState(false);
  const [sending, setSending] = useState(false);
  const [callDate, setCallDate] = useState("");
  const compute = useServerFn(computeImpactScore);

  const pct = Math.min(100, Math.round((Number(b.raised_amount) / Math.max(1, Number(b.goal_amount))) * 100));

  useEffect(() => {
    (async () => {
      const [{ data: ud }, { data: imp }, { data: ups }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("impact_scores").select("score, summary").eq("beneficiary_id", b.id).maybeSingle(),
        supabase
          .from("beneficiary_updates")
          .select("id, title, body, created_at")
          .eq("beneficiary_id", b.id)
          .order("created_at", { ascending: false }),
      ]);
      if (imp) setImpact(imp);
      if (ups) setUpdates(ups);
      if (ud.user) {
        setUserId(ud.user.id);
        const { data: spon } = await supabase
          .from("sponsorships")
          .select("id")
          .eq("user_id", ud.user.id)
          .eq("beneficiary_id", b.id)
          .eq("status", "active")
          .maybeSingle();
        const active = !!spon;
        setIsSponsor(active);
        if (active) {
          const { data: msgs } = await supabase
            .from("messages")
            .select("id, body, sender_id, created_at")
            .eq("beneficiary_id", b.id)
            .order("created_at", { ascending: true });
          if (msgs) setMessages(msgs);
        }
      }
    })();
  }, [b.id]);

  const handleSponsor = async () => {
    const { data: ud } = await supabase.auth.getUser();
    if (!ud.user) {
      toast.info("Please sign in to sponsor");
      window.location.href = "/auth";
      return;
    }
    const next = new Date();
    next.setMonth(next.getMonth() + 1);
    const { error } = await supabase.from("sponsorships").insert({
      user_id: ud.user.id,
      beneficiary_id: b.id,
      beneficiary_name: b.name,
      category: b.category,
      monthly_amount: b.monthly_amount,
      next_renewal_at: next.toISOString(),
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`You are now sponsoring ${b.name} 💛`);
      setIsSponsor(true);
    }
  };

  const handleComputeImpact = async () => {
    setComputing(true);
    try {
      const result = await compute({ data: { beneficiaryId: b.id } });
      setImpact(result);
      toast.success("AI impact score updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not compute score");
    } finally {
      setComputing(false);
    }
  };

  const sendMessage = async () => {
    if (!userId || !draft.trim()) return;
    setSending(true);
    const { data, error } = await supabase
      .from("messages")
      .insert({ sender_id: userId, beneficiary_id: b.id, body: draft.trim() })
      .select("id, body, sender_id, created_at")
      .single();
    setSending(false);
    if (error) toast.error(error.message);
    else {
      setMessages((m) => [...m, data]);
      setDraft("");
      toast.success("Message sent for moderation");
    }
  };

  const scheduleCall = async () => {
    if (!userId || !callDate) return;
    const { error } = await supabase.from("scheduled_calls").insert({
      sponsor_id: userId,
      beneficiary_id: b.id,
      scheduled_at: new Date(callDate).toISOString(),
      kind: "video",
    });
    if (error) toast.error(error.message);
    else toast.success("Call requested — our team will share a video link by email");
  };

  return (
    <article className="min-h-screen pt-20 pb-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <Link to="/sponsor" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="size-4" /> Back to beneficiaries
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Hero */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              {b.image_url && (
                <div className="aspect-[16/9] bg-muted">
                  <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge variant="default" className="bg-secondary">
                    <ShieldCheck className="size-3 mr-1" /> Verified
                  </Badge>
                  <Badge variant="outline" className="capitalize">{b.category}</Badge>
                  {b.location && (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {b.location}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold">{b.name}</h1>
                {b.age && <p className="text-muted-foreground mt-1">Age {b.age}</p>}
                <p className="mt-4 text-foreground/90 leading-relaxed whitespace-pre-line">{b.story}</p>
              </div>
            </Card>

            <Tabs defaultValue="updates">
              <TabsList>
                <TabsTrigger value="updates">Updates</TabsTrigger>
                <TabsTrigger value="messages" disabled={!isSponsor}>
                  Messages {!isSponsor && "(sponsor only)"}
                </TabsTrigger>
                <TabsTrigger value="call" disabled={!isSponsor}>
                  Call {!isSponsor && "(sponsor only)"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="updates" className="mt-4">
                <Card className="p-6">
                  {updates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Field updates from our team will appear here.
                    </p>
                  ) : (
                    <ul className="space-y-5">
                      {updates.map((u) => (
                        <li key={u.id} className="border-l-2 border-primary pl-4">
                          <div className="text-xs text-muted-foreground">
                            {new Date(u.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                          </div>
                          <h3 className="font-semibold mt-1">{u.title}</h3>
                          <p className="text-sm text-foreground/80 mt-1">{u.body}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </TabsContent>

              <TabsContent value="messages" className="mt-4">
                <Card className="p-6">
                  <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                    {messages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No messages yet. Send a kind note — every message is moderated by our team before delivery.
                      </p>
                    ) : (
                      messages.map((m) => (
                        <div
                          key={m.id}
                          className={`p-3 rounded-2xl text-sm ${
                            m.sender_id === userId
                              ? "bg-primary text-primary-foreground ml-8"
                              : "bg-muted mr-8"
                          }`}
                        >
                          {m.body}
                          <div className="text-[10px] opacity-70 mt-1">
                            {new Date(m.created_at).toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Write an encouraging message…"
                      rows={2}
                    />
                    <Button onClick={sendMessage} disabled={sending || !draft.trim()}>
                      {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <ShieldCheck className="size-3 inline mr-1" />
                    Messages are reviewed by ANSJ moderators before delivery to protect minors.
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="call" className="mt-4">
                <Card className="p-6">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Video className="size-4" /> Request a video call
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pick a date/time. Our field team will confirm and share a secure video link by email.
                  </p>
                  <div className="grid sm:grid-cols-[1fr_auto] gap-2 mt-4">
                    <div>
                      <Label htmlFor="cal">Preferred time</Label>
                      <Input
                        id="cal"
                        type="datetime-local"
                        value={callDate}
                        onChange={(e) => setCallDate(e.target.value)}
                      />
                    </div>
                    <Button className="self-end" onClick={scheduleCall} disabled={!callDate}>
                      <CalIcon className="size-4 mr-2" /> Request
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Raised</span>
                <span className="font-semibold">
                  ₹{Number(b.raised_amount).toLocaleString("en-IN")} / ₹{Number(b.goal_amount).toLocaleString("en-IN")}
                </span>
              </div>
              <Progress value={pct} />
              <div className="text-xs text-muted-foreground mt-1">{pct}% funded</div>

              <Button
                className="w-full mt-5 bg-accent text-accent-foreground hover:brightness-105 font-bold"
                size="lg"
                onClick={handleSponsor}
                disabled={isSponsor}
              >
                <Heart className="size-4 mr-2" fill="currentColor" />
                {isSponsor
                  ? `Sponsoring · ₹${Number(b.monthly_amount).toLocaleString("en-IN")}/mo`
                  : `Sponsor · ₹${Number(b.monthly_amount).toLocaleString("en-IN")}/mo`}
              </Button>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/donate">One-time donation</Link>
              </Button>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="font-semibold text-sm">AI Impact Score</span>
                </div>
                {impact && (
                  <span className="text-3xl font-bold text-primary">{impact.score}</span>
                )}
              </div>
              {impact ? (
                <p className="text-xs text-muted-foreground">{impact.summary}</p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Not generated yet. Compute an AI-verified impact rationale.
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3"
                onClick={handleComputeImpact}
                disabled={computing}
              >
                {computing && <Loader2 className="size-3 mr-1 animate-spin" />}
                {impact ? "Refresh" : "Generate"}
              </Button>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="size-4" /> How sponsorship works
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Monthly auto-renewal, cancel anytime</li>
                <li>Quarterly photo & progress updates</li>
                <li>80G tax receipt for every contribution</li>
                <li>Moderated chat with the family</li>
              </ul>
            </Card>
          </aside>
        </div>
      </div>
    </article>
  );
}
