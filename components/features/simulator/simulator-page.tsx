"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { SurfaceHeading } from "@/components/features/surface-heading";
import { MetricCard } from "@/components/features/metric-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useFirebaseAuth } from "@/components/providers/firebase-auth-provider";
import { saveSimulation } from "@/lib/firebase/firestore";
import { formatKg, formatMoney } from "@/lib/utils";
import type { ImpactProjection } from "@/types/orbit";

const examples = [
  "What if I biked to work three days a week?",
  "What if I stopped eating beef for a month?",
  "What if I bought clothes secondhand this year?"
];

export function SimulatorPage() {
  const { user } = useFirebaseAuth();
  const [query, setQuery] = React.useState(examples[0]);
  const [projection, setProjection] = React.useState<ImpactProjection | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function runSimulation() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/simulator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const result = (await response.json()) as ImpactProjection;
      setProjection(result);

      if (user) {
        await saveSimulation(user.uid, result);
      }
    } catch {
      setError("Orbit could not model that scenario. Try a more specific habit or timeframe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <SurfaceHeading
        eyebrow="What If Simulator"
        title="Model the future before changing the habit"
        description="Describe a behavior change in plain language and see monthly, annual, ecological, and financial impact."
      />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>Natural language input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={query} onChange={(event) => setQuery(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <Button key={example} type="button" variant="outline" size="sm" onClick={() => setQuery(example)}>
                  {example}
                </Button>
              ))}
            </div>
            <Button onClick={runSimulation} disabled={loading || query.trim().length < 4}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Simulate
            </Button>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>

        {projection ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Monthly impact" value={`${formatKg(projection.monthlyKgCo2e)} kg`} detail="CO2e avoided" />
              <MetricCard label="Annual impact" value={`${formatKg(projection.annualKgCo2e)} kg`} detail="CO2e avoided" />
              <MetricCard label="Trees equivalent" value={`${projection.treesEquivalent}`} detail="Tree-years" />
              <MetricCard label="Money saved" value={formatMoney(projection.moneySavedUsd)} detail="Estimated annualized" />
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Scenario readout</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 rounded-lg border border-border bg-muted/35 p-4 text-sm leading-6">
                  {projection.query}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{projection.insight}</p>
                <div className="mt-5 overflow-hidden rounded-lg border border-border bg-background">
                  <div className="grid grid-cols-[minmax(110px,0.35fr)_1fr] border-b border-border">
                    <div className="bg-muted/35 p-3 text-sm font-medium">Confidence</div>
                    <div className="p-3 text-sm">{Math.round(projection.confidence * 100)}%</div>
                  </div>
                  <div className="grid grid-cols-[minmax(110px,0.35fr)_1fr] border-b border-border">
                    <div className="bg-muted/35 p-3 text-sm font-medium">Compounding</div>
                    <div className="p-3 text-sm">{formatKg(projection.monthlyKgCo2e * 3)} kg after 90 days</div>
                  </div>
                  <div className="grid grid-cols-[minmax(110px,0.35fr)_1fr]">
                    <div className="bg-muted/35 p-3 text-sm font-medium">Best use</div>
                    <div className="p-3 text-sm">Repeatable weekly commitments with clear substitutes.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <Card className="min-h-[340px]">
            <CardContent className="flex h-full min-h-[340px] items-center justify-center p-6 text-center">
              <div className="max-w-md">
                <div className="mx-auto mb-4 grid size-12 place-items-center rounded-lg bg-primary/15 text-primary">
                  <Sparkles className="size-6" />
                </div>
                <h3 className="font-display text-xl font-semibold">Impact model appears here</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Run one scenario to compare carbon savings, tree equivalents, and expected money saved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
