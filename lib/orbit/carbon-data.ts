import type { CarbonCategory, HabitFingerprint, MomentumSnapshot, RippleMilestone, SwapRecommendation } from "@/types/orbit";

export interface CarbonReference {
  aliases: string[];
  category: CarbonCategory;
  kgCo2e: number;
  unit: string;
  swap?: SwapRecommendation;
}

export const carbonReferences: CarbonReference[] = [
  {
    aliases: ["beef", "steak", "beef mince", "ground beef", "burger"],
    category: "food",
    kgCo2e: 27,
    unit: "kg",
    swap: {
      title: "Replace beef with lentil bolognese",
      description: "Keeps the same meal format while removing the highest carbon item.",
      from: "Beef",
      to: "Lentils",
      estimatedSavingsKgCo2e: 6.2,
      moneySavedUsd: 8,
      effort: "low"
    }
  },
  {
    aliases: ["lamb", "mutton"],
    category: "food",
    kgCo2e: 39.2,
    unit: "kg",
    swap: {
      title: "Use chickpeas instead of lamb",
      description: "A high-protein swap with large methane and land-use savings.",
      from: "Lamb",
      to: "Chickpeas",
      estimatedSavingsKgCo2e: 7.8,
      moneySavedUsd: 10,
      effort: "medium"
    }
  },
  {
    aliases: ["cheese", "cheddar", "mozzarella"],
    category: "food",
    kgCo2e: 13.5,
    unit: "kg",
    swap: {
      title: "Swap cheese-heavy meals for hummus",
      description: "Reduces dairy emissions while keeping a rich texture.",
      from: "Cheese",
      to: "Hummus",
      estimatedSavingsKgCo2e: 2.5,
      moneySavedUsd: 4,
      effort: "low"
    }
  },
  {
    aliases: ["milk", "whole milk", "dairy milk"],
    category: "food",
    kgCo2e: 3.2,
    unit: "liter",
    swap: {
      title: "Move coffee milk to oat milk",
      description: "A frequent low-friction swap that compounds every week.",
      from: "Dairy milk",
      to: "Oat milk",
      estimatedSavingsKgCo2e: 2.3,
      moneySavedUsd: 2,
      effort: "low"
    }
  },
  {
    aliases: ["chicken", "chicken breast"],
    category: "food",
    kgCo2e: 6.9,
    unit: "kg",
    swap: {
      title: "Try tofu in one chicken meal",
      description: "A balanced swap with meaningful savings and similar protein.",
      from: "Chicken",
      to: "Tofu",
      estimatedSavingsKgCo2e: 1.9,
      moneySavedUsd: 3,
      effort: "low"
    }
  },
  {
    aliases: ["petrol", "gas", "fuel", "gasoline", "diesel"],
    category: "transport",
    kgCo2e: 2.31,
    unit: "liter",
    swap: {
      title: "Replace one short drive with transit",
      description: "Short car trips are carbon-intensive and easy to substitute.",
      from: "Car trip",
      to: "Transit or bike",
      estimatedSavingsKgCo2e: 3.2,
      moneySavedUsd: 6,
      effort: "medium"
    }
  },
  {
    aliases: ["coffee", "coffee beans"],
    category: "food",
    kgCo2e: 16.5,
    unit: "kg",
    swap: {
      title: "Choose local coffee once this week",
      description: "Cuts packaging and transport while preserving the habit.",
      from: "Imported coffee",
      to: "Local roast",
      estimatedSavingsKgCo2e: 1.1,
      moneySavedUsd: 2,
      effort: "low"
    }
  }
];

export const momentumSnapshot: MomentumSnapshot = {
  score: 82,
  trendPercent: 12,
  totalSavedKgCo2e: 24.3,
  streakDays: 7,
  swapsCompleted: 5
};

export const smartSwaps: SwapRecommendation[] = carbonReferences
  .flatMap((reference) => reference.swap ?? [])
  .sort((a, b) => b.estimatedSavingsKgCo2e - a.estimatedSavingsKgCo2e);

export const habitFingerprint: HabitFingerprint[] = [
  {
    label: "Beef dinners",
    category: "food",
    weeklyKgCo2e: 18.6,
    percentage: 85,
    severity: "high"
  },
  {
    label: "Car commute",
    category: "transport",
    weeklyKgCo2e: 14.2,
    percentage: 68,
    severity: "medium"
  },
  {
    label: "Long hot showers",
    category: "home",
    weeklyKgCo2e: 4.8,
    percentage: 35,
    severity: "low"
  }
];

export const rippleMilestones: RippleMilestone[] = [
  {
    id: "phone",
    label: "First visible ripple",
    thresholdKgCo2e: 5,
    equivalent: "1,200 phone charges avoided",
    reached: true
  },
  {
    id: "drive",
    label: "Car-free weekend",
    thresholdKgCo2e: 20,
    equivalent: "50 miles of driving avoided",
    reached: true
  },
  {
    id: "tree",
    label: "Young tree year",
    thresholdKgCo2e: 48,
    equivalent: "One young tree's annual carbon drawdown",
    reached: false
  },
  {
    id: "flight",
    label: "Flight offset marker",
    thresholdKgCo2e: 120,
    equivalent: "A short regional flight's footprint",
    reached: false
  }
];
