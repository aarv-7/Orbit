import type { CarbonItem, ImpactProjection, LensAnalysis, SwapRecommendation } from "@/types/orbit";
import { carbonReferences, smartSwaps } from "@/lib/orbit/carbon-data";
import { clamp } from "@/lib/utils";

const TREES_KG_PER_YEAR = 22;

export function estimateItemFromText(text: string): CarbonItem | null {
  const normalized = text.toLowerCase();
  const reference = carbonReferences.find((entry) =>
    entry.aliases.some((alias) => normalized.includes(alias))
  );

  if (!reference) {
    return null;
  }

  return {
    name: reference.aliases[0],
    category: reference.category,
    quantity: 1,
    unit: reference.unit,
    estimatedKgCo2e: Number(reference.kgCo2e.toFixed(1)),
    confidence: 0.72
  };
}

export function bestSwapForItems(items: CarbonItem[]): SwapRecommendation {
  const matchedSwap = items
    .map((item) => {
      const reference = carbonReferences.find((entry) =>
        entry.aliases.some((alias) => item.name.toLowerCase().includes(alias))
      );
      return reference?.swap;
    })
    .filter((swap): swap is SwapRecommendation => Boolean(swap))
    .sort((a, b) => b.estimatedSavingsKgCo2e - a.estimatedSavingsKgCo2e)[0];

  return matchedSwap ?? smartSwaps[0];
}

export function fallbackLensAnalysis(label = "uploaded receipt"): LensAnalysis {
  const fallbackItems: CarbonItem[] = [
    {
      name: "beef",
      category: "food",
      quantity: 1,
      unit: "meal",
      estimatedKgCo2e: 6.8,
      confidence: 0.62
    },
    {
      name: "dairy milk",
      category: "food",
      quantity: 1,
      unit: "liter",
      estimatedKgCo2e: 3.2,
      confidence: 0.58
    },
    {
      name: "coffee",
      category: "food",
      quantity: 1,
      unit: "bag",
      estimatedKgCo2e: 2.4,
      confidence: 0.56
    }
  ];

  const total = fallbackItems.reduce((sum, item) => sum + item.estimatedKgCo2e, 0);

  return {
    merchant: label,
    analyzedAt: new Date().toISOString(),
    totalKgCo2e: Number(total.toFixed(1)),
    confidence: 0.6,
    items: fallbackItems,
    bestSwap: bestSwapForItems(fallbackItems),
    summary: "The highest-impact item appears to be animal protein, followed by dairy. Prioritize one protein swap before optimizing lower-impact grocery items."
  };
}

export function projectionFromNaturalLanguage(query: string): ImpactProjection {
  const normalized = query.toLowerCase();
  let monthlyKgCo2e = 18;
  let moneySavedUsd = 22;
  let insight = "This change has moderate recurring impact because it targets a repeated weekly behavior.";

  if (/vegetarian|plant|meat|beef|lamb/.test(normalized)) {
    monthlyKgCo2e = 54;
    moneySavedUsd = 48;
    insight = "Diet changes compound quickly because high-emission meals repeat multiple times every week.";
  } else if (/bike|cycle|walk|commute|car|drive|transit/.test(normalized)) {
    monthlyKgCo2e = 28;
    moneySavedUsd = 76;
    insight = "Replacing short car trips cuts fuel emissions and often saves direct transport costs.";
  } else if (/electric|ev|vehicle/.test(normalized)) {
    monthlyKgCo2e = 95;
    moneySavedUsd = 120;
    insight = "An electric vehicle can sharply reduce tailpipe emissions, with savings depending on local grid intensity.";
  } else if (/shower|hot water|bath/.test(normalized)) {
    monthlyKgCo2e = 12;
    moneySavedUsd = 18;
    insight = "Hot water reductions are small per day but highly reliable because the habit repeats daily.";
  } else if (/secondhand|clothes|fashion|thrift/.test(normalized)) {
    monthlyKgCo2e = 22;
    moneySavedUsd = 64;
    insight = "Buying fewer new items avoids manufacturing, packaging, and shipping emissions.";
  }

  const annualKgCo2e = monthlyKgCo2e * 12;

  return {
    query,
    monthlyKgCo2e,
    annualKgCo2e,
    treesEquivalent: Math.round(annualKgCo2e / TREES_KG_PER_YEAR),
    moneySavedUsd,
    insight,
    confidence: clamp(query.length / 80 + 0.48, 0.52, 0.86)
  };
}

export function normalizeLensAnalysis(input: Partial<LensAnalysis>): LensAnalysis {
  const items = Array.isArray(input.items) ? input.items.slice(0, 8) : [];
  const fallback = fallbackLensAnalysis(input.merchant);
  const safeItems = items.length > 0 ? items : fallback.items;
  const total = safeItems.reduce((sum, item) => sum + Number(item.estimatedKgCo2e || 0), 0);

  return {
    merchant: input.merchant ?? fallback.merchant,
    analyzedAt: input.analyzedAt ?? new Date().toISOString(),
    totalKgCo2e: Number((input.totalKgCo2e ?? total).toFixed(1)),
    confidence: clamp(input.confidence ?? 0.64, 0.1, 0.95),
    items: safeItems.map((item) => ({
      name: item.name,
      category: item.category,
      quantity: Number(item.quantity || 1),
      unit: item.unit || "item",
      estimatedKgCo2e: Number(item.estimatedKgCo2e || 0),
      confidence: clamp(item.confidence ?? 0.55, 0.1, 0.95)
    })),
    bestSwap: input.bestSwap ?? bestSwapForItems(safeItems),
    summary: input.summary ?? fallback.summary
  };
}
