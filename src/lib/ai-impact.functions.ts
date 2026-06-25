import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Compute (or refresh) an AI impact score for a beneficiary using
 * Lovable AI Gateway. Caches the result in public.impact_scores.
 * Requires authentication to prevent anonymous abuse of billable AI calls.
 */
export const computeImpactScore = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ beneficiaryId: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { data: b, error } = await supabase
      .from("beneficiaries")
      .select("name, category, age, location, story, goal_amount, raised_amount, verified")
      .eq("id", data.beneficiaryId)
      .maybeSingle();
    if (error || !b) throw new Error("Beneficiary not found");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const prompt = `You evaluate sponsorship cases for a verified Indian NGO (ANSJ Foundation).
Return ONLY compact JSON with shape { "score": <0-100 integer>, "summary": "<one-sentence donor-facing impact rationale, max 220 chars>" }.
Score 90+ = highest impact (orphan/widow, severe poverty, verified). 70-89 = high impact. 50-69 = medium.

Case:
Name: ${b.name}
Category: ${b.category}
Age: ${b.age}
Location: ${b.location}
Verified KYC: ${b.verified}
Funding: ₹${b.raised_amount}/${b.goal_amount}
Story: ${b.story}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You return only valid compact JSON. No markdown, no commentary." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      throw new Error(`AI gateway error ${aiResp.status}: ${errText.slice(0, 200)}`);
    }

    const aiJson = await aiResp.json();
    const content: string = aiJson?.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/^```json\s*|\s*```$/g, "").trim();
    let parsed: { score: number; summary: string };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { score: 75, summary: "Verified case with consistent funding need." };
    }

    const score = Math.max(0, Math.min(100, Math.round(parsed.score)));
    const summary = String(parsed.summary).slice(0, 280);

    await supabase
      .from("impact_scores")
      .upsert(
        {
          beneficiary_id: data.beneficiaryId,
          score,
          summary,
          model: "google/gemini-2.5-flash-lite",
          generated_at: new Date().toISOString(),
        },
        { onConflict: "beneficiary_id" },
      );

    return { score, summary };
  });
