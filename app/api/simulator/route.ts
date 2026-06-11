import { NextResponse } from "next/server";
import { z } from "zod";
import { getGeminiModel } from "@/lib/gemini/server";
import { projectionFromNaturalLanguage } from "@/lib/orbit/calculations";
import type { ImpactProjection } from "@/types/orbit";
import { clamp } from "@/lib/utils";

const requestSchema = z.object({
  query: z.string().min(4).max(500)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a realistic lifestyle change." }, { status: 400 });
  }

  const fallback = projectionFromNaturalLanguage(parsed.data.query);
  const model = getGeminiModel();

  if (!model) {
    return NextResponse.json(fallback);
  }

  try {
    const result = await model.generateContent(`Estimate carbon and cost impact for this lifestyle change: "${parsed.data.query}".
Return only valid JSON:
{
  "monthlyKgCo2e": number,
  "annualKgCo2e": number,
  "treesEquivalent": number,
  "moneySavedUsd": number,
  "insight": "string",
  "confidence": number
}
Use conservative consumer-facing estimates. Trees equivalent should use 22 kg CO2e per tree per year.`);
    const json = JSON.parse(result.response.text()) as Partial<ImpactProjection>;
    const annual = Number(json.annualKgCo2e ?? Number(json.monthlyKgCo2e ?? fallback.monthlyKgCo2e) * 12);

    return NextResponse.json({
      query: parsed.data.query,
      monthlyKgCo2e: Number(json.monthlyKgCo2e ?? fallback.monthlyKgCo2e),
      annualKgCo2e: annual,
      treesEquivalent: Math.round(Number(json.treesEquivalent ?? annual / 22)),
      moneySavedUsd: Number(json.moneySavedUsd ?? fallback.moneySavedUsd),
      insight: json.insight ?? fallback.insight,
      confidence: clamp(Number(json.confidence ?? fallback.confidence), 0.1, 0.95)
    } satisfies ImpactProjection);
  } catch {
    return NextResponse.json(fallback);
  }
}
