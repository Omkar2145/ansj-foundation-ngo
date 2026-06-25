import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Lock, BadgeCheck, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";


const presets = [500, 1000, 2500, 5000, 10000, 25000];
const impactMap: Record<number, string> = {
  500: "School supplies for 1 child",
  1000: "Meals for a family of 4",
  2500: "Healthcare for a senior",
  5000: "Medical assistance kit",
  10000: "Education sponsorship",
  25000: "Equips a rural classroom",
};

export function Donate() {
  const [amount, setAmount] = useState<number>(1000);
  const [custom, setCustom] = useState("");
  const [monthly, setMonthly] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const finalAmt = custom ? Number(custom) || 0 : amount;
  const impact =
    impactMap[finalAmt] ||
    (finalAmt >= 25000 ? "Sponsors a community project" : finalAmt >= 100 ? "Contributes to ongoing programs" : "Every rupee counts");

  const handleDonate = async () => {
    if (finalAmt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setSubmitting(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.info("Please sign in to complete your donation");
      navigate({ to: "/auth" });
      setSubmitting(false);
      return;
    }
    const { error } = await supabase.from("donations").insert({
      user_id: userData.user.id,
      amount: finalAmt,
      currency: "INR",
      category: "general",
      frequency: monthly ? "monthly" : "one_time",
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Thank you! Your ₹${finalAmt.toLocaleString("en-IN")} ${monthly ? "monthly " : ""}pledge was recorded.`, {
      description: "We'll email your 80G receipt once payment is confirmed.",
    });
    navigate({ to: "/donor" });
  };



  return (
    <section id="donate" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-hero opacity-95" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,_color-mix(in_oklab,_var(--accent)_25%,_transparent),_transparent_50%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-primary-foreground">
            <span className="text-sm font-semibold text-accent uppercase tracking-widest">Donate</span>
            <h2 className="font-heading text-4xl lg:text-5xl font-bold mt-2 mb-4">
              Your gift creates <span className="text-accent">lasting change</span>
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              100% of donations go directly to programs. Every contribution is tax-deductible under
              80G and transparently reported.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, t: "80G Certified" },
                { icon: Lock, t: "Secure Payments" },
                { icon: BadgeCheck, t: "FCRA Registered" },
                { icon: Heart, t: "100% to Impact" },
              ].map((b) => (
                <div key={b.t} className="glass rounded-xl p-3 flex items-center gap-2 text-sm">
                  <b.icon className="size-4 text-accent" />
                  {b.t}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)]">
            <h3 className="font-heading text-2xl font-bold mb-1">Make a donation</h3>
            <p className="text-sm text-muted-foreground mb-6">Choose an amount or enter your own.</p>

            <div className="flex gap-2 p-1 bg-muted rounded-full mb-5 w-fit">
              <button
                onClick={() => setMonthly(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  !monthly ? "bg-card shadow-sm" : "text-muted-foreground"
                }`}
              >
                One-time
              </button>
              <button
                onClick={() => setMonthly(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  monthly ? "bg-card shadow-sm" : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => { setAmount(p); setCustom(""); }}
                  className={`py-3 rounded-xl border font-heading font-bold transition-all ${
                    finalAmt === p && !custom
                      ? "bg-primary text-primary-foreground border-primary scale-[1.02]"
                      : "bg-card hover:bg-muted"
                  }`}
                >
                  ₹{p.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            <Input
              type="number"
              placeholder="Custom amount (₹)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="h-12 mb-4"
            />

            <div className="rounded-2xl bg-accent/15 border border-accent/30 p-4 mb-5">
              <div className="text-xs uppercase tracking-widest text-accent-foreground/70 font-semibold">Your impact</div>
              <div className="font-heading font-bold text-lg">
                ₹{finalAmt.toLocaleString("en-IN")}{monthly && "/mo"} = {impact}
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleDonate}
              disabled={submitting}
              className="w-full h-12 bg-accent text-accent-foreground hover:brightness-105 font-bold text-base shadow-[var(--shadow-glow)]"
            >
              {submitting ? <Loader2 className="size-5 animate-spin" /> : <Heart className="size-5" fill="currentColor" />}
              Donate ₹{finalAmt.toLocaleString("en-IN")}{monthly && "/month"}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
              <Lock className="size-3" /> Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
