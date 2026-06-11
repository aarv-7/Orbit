export type CarbonCategory = "food" | "transport" | "home" | "goods" | "energy" | "unknown";

export interface CarbonItem {
  name: string;
  category: CarbonCategory;
  quantity: number;
  unit: string;
  estimatedKgCo2e: number;
  confidence: number;
}

export interface SwapRecommendation {
  title: string;
  description: string;
  from: string;
  to: string;
  estimatedSavingsKgCo2e: number;
  moneySavedUsd?: number;
  effort: "low" | "medium" | "high";
}

export interface LensAnalysis {
  merchant?: string;
  analyzedAt: string;
  totalKgCo2e: number;
  confidence: number;
  items: CarbonItem[];
  bestSwap: SwapRecommendation;
  summary: string;
}

export interface ImpactProjection {
  query: string;
  monthlyKgCo2e: number;
  annualKgCo2e: number;
  treesEquivalent: number;
  moneySavedUsd: number;
  insight: string;
  confidence: number;
}

export interface HabitFingerprint {
  label: string;
  category: CarbonCategory;
  weeklyKgCo2e: number;
  percentage: number;
  severity: "high" | "medium" | "low";
}

export interface MomentumSnapshot {
  score: number;
  trendPercent: number;
  totalSavedKgCo2e: number;
  streakDays: number;
  swapsCompleted: number;
}

export interface RippleMilestone {
  id: string;
  label: string;
  thresholdKgCo2e: number;
  equivalent: string;
  reached: boolean;
}
