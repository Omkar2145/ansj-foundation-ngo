import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";

type Sponsorship = { beneficiary_id: string; beneficiary_name: string | null };
type Message = { id: string; sender_id: string; body: string; moderation_status: string; created_at: string };

export function MessageThread({ sponsorships }: { sponsorships: Sponsorship[] }) {
  const [selected, setSelected] = useState(sponsorships[0]?.beneficiary_id ?? "");
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const load = async (beneficiaryId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("beneficiary_id", beneficiaryId)
      .order("created_at", { ascending: true });
    if (error) toast.error(error.message);
    else setMessages(data ?? []);
    setLoading(false);
  };

  useEffect(() => { if (selected) void load(selected); }, [selected]);

  const send = async () => {
    if (!body.trim() || !selected) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      sender_id: userId, beneficiary_id: selected, body: body.trim(),
    });
    if (error) toast.error(error.message);
    else { setBody(""); void load(selected); }
    setSending(false);
  };

  if (!sponsorships.length) return <p className="text-muted-foreground">Sponsor a child or elder to unlock messaging.</p>;

  return (
    <div className="space-y-4">
      <Select value={selected} onValueChange={setSelected}>
        <SelectTrigger className="w-full sm:w-72"><SelectValue placeholder="Choose a beneficiary" /></SelectTrigger>
        <SelectContent>
          {sponsorships.map((s) => (
            <SelectItem key={s.beneficiary_id} value={s.beneficiary_id}>{s.beneficiary_name ?? "Beneficiary"}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="p-4 h-80 overflow-y-auto flex flex-col gap-3">
        {loading ? (
          <Loader2 className="size-5 animate-spin mx-auto text-muted-foreground" />
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center my-auto">No messages yet — say hello!</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.sender_id === userId ? "bg-primary text-primary-foreground self-end" : "bg-muted self-start"}`}>
              {m.body}
              {m.moderation_status === "pending" && <div className="text-xs opacity-70 mt-1">Awaiting review</div>}
            </div>
          ))
        )}
      </Card>

      <div className="flex gap-2">
        <Textarea rows={1} placeholder="Write a message…" value={body} onChange={(e) => setBody(e.target.value)} />
        <Button onClick={() => void send()} disabled={sending || !body.trim()}>
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
