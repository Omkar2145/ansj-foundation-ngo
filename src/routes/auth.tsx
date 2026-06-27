import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Heart, Loader2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Sign In · ANSJ Foundation" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/donor" });
    });
  }, [navigate]);

 const handleEmailAuth = async (mode: "signin" | "signup") => {
  setLoading(true);
  try {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: fullName },
        },
      });
      if (error) throw error;

      // Supabase returns no error even if this email is already registered
      if (data.user?.identities?.length === 0) {
        toast.error("This email is already registered. Please sign in instead.");
        return;
      }
      if (!data.session) {
        toast.success("Account created! Check your email to confirm, then sign in.");
        return;
      }
      toast.success("Welcome to ANSJ Foundation!");
      navigate({ to: "/donor" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in");
      navigate({ to: "/donor" });
    }
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Authentication failed");
  } finally {
    setLoading(false);
  }
};

  const handleGoogle = async () => {
  setLoading(true);
  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin + "/donor",
  });
  if (result.error) {
    toast.error(result.error instanceof Error ? result.error.message : "Google sign-in failed");
    setLoading(false);
  } else if (!result.redirected) {
    navigate({ to: "/donor" });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center pt-20 pb-12">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center max-w-6xl">
        {/* Brand panel */}
        <div className="hidden lg:flex flex-col gap-6 p-10 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[var(--shadow-card)] relative overflow-hidden">
          <div className="absolute -top-16 -right-16 size-60 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/25 text-xs font-semibold">
              <Sparkles className="size-3.5" /> Welcome to ANSJ Foundation
            </span>
            <h2 className="font-heading text-4xl font-bold mt-5 leading-tight">
              Every login powers a{" "}
              <span className="text-accent">child's future</span> or an{" "}
              <span className="text-accent">elder's smile</span>.
            </h2>
            <p className="text-primary-foreground/85 mt-4 text-base">
              Sign in to your Donor Portal to track sponsorships, download 80G receipts and see real-time impact.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "100% transparent fund tracking",
                "Instant 80G tax-exempt receipts",
                "Direct updates from beneficiaries",
                "FCRA registered & audit-verified",
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-accent" /> {t}
                </li>
              ))}
            </ul>
            <div className="mt-10 pt-6 border-t border-white/20 text-xs text-primary-foreground/70">
              Trusted by 4,200+ donors across 42 cities
            </div>
          </div>
        </div>

        {/* Auth card */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary mb-3 shadow-[var(--shadow-soft)]">
              <Heart className="size-7" fill="currentColor" />
            </div>
            <h1 className="font-heading text-3xl font-bold">Donor Portal</h1>
            <p className="text-muted-foreground mt-1 text-sm">Track donations, receipts and sponsorships</p>
          </div>

          <Card className="p-6 shadow-[var(--shadow-card)] border-border/60">
            <Button
              variant="outline"
              className="w-full mb-4 h-11 font-medium"
              onClick={handleGoogle}
              disabled={loading}
            >
              <svg className="size-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or with email</span>
              </div>
            </div>

            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email-in">Email</Label>
                  <Input id="email-in" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw-in">Password</Label>
                  <Input id="pw-in" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button className="w-full h-11 font-semibold" onClick={() => handleEmailAuth("signin")} disabled={loading}>
                  {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Sign In
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4 mt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name-up">Full name</Label>
                  <Input id="name-up" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-up">Email</Label>
                  <Input id="email-up" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pw-up">Password (min 6 chars)</Label>
                  <Input id="pw-up" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <Button className="w-full h-11 font-semibold" onClick={() => handleEmailAuth("signup")} disabled={loading}>
                  {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="mt-5 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Explore the site as a guest <ArrowRight className="size-3.5" />
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              By continuing you agree to our{" "}
              <Link to="/transparency" className="underline">Transparency</Link> commitments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
