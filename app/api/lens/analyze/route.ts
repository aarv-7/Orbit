import { NextResponse } from "next/server";
import { z } from "zod";
import { fallbackLensAnalysis, normalizeLensAnalysis } from "@/lib/orbit/calculations";
import { getGeminiModel } from "@/lib/gemini/server";

const requestSchema = z.object({
  imageBase64: z.string().min(20),
  mimeType: z.string().min(3),
  fileName: z.string().optional()
});

const prompt = `Analyze this receipt or product image for consumer carbon impact.
Return only valid JSON with this exact shape:
{
  "merchant": "string",
  "totalKgCo2e": number,
  "confidence": number,
  "items": [
    {
      "name": "string",
      "category": "food|transport|home|goods|energy|unknown",
      "quantity": number,
      "unit": "string",
      "estimatedKgCo2e": number,
      "confidence": number
    }
  ],
  "bestSwap": {
    "title": "string",
    "description": "string",
    "from": "string",
    "to": "string",
    "estimatedSavingsKgCo2e": number,
    "moneySavedUsd": number,
    "effort": "low|medium|high"
  },
  "summary": "string"
}
Use conservative kg CO2e estimates. Prefer food, transport, and household substitutions that a user can actually do this week.`;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid image payload." }, { status: 400 });
  }

  const model = getGeminiModel();

  if (!model) {
    return NextResponse.json(fallbackLensAnalysis(parsed.data.fileName));
  }

  try {
    const imageData = parsed.data.imageBase64.replace(/^data:[^;]+;base64,/, "");
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData,
          mimeType: parsed.data.mimeType
        }
      }
    ]);
    const text = result.response.text();
    const json = JSON.parse(text) as unknown;

    return NextResponse.json(
      normalizeLensAnalysis({
        ...(typeof json === "object" && json ? json : {}),
        analyzedAt: new Date().toISOString()
      })
    );
  } catch {
    return NextResponse.json(fallbackLensAnalysis(parsed.data.fileName));
  }
}
