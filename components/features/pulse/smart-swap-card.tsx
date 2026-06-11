"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { smartSwaps } from "@/lib/orbit/carbon-data";
import { formatKg, formatMoney } from "@/lib/utils";

export function SmartSwapCard() {
  const [index, setIndex] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const swap = smartSwaps[index];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <Badge variant="success">Smart Swap</Badge>
          <span className="text-sm text-muted-foreground">{formatKg(swap.estimatedSavingsKgCo2e)} kg CO2e</span>
        </div>
        <CardTitle>Today&apos;s highest-impact move</CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={swap.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
              <div>
                <div className="metric-label">From</div>
                <div className="mt-1 text-sm font-semibold">{swap.from}</div>
              </div>
              <div className="text-muted-foreground">-&gt;</div>
              <div>
                <div className="metric-label">To</div>
                <div className="mt-1 text-sm font-semibold">{swap.to}</div>
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-semibold">{swap.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{swap.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-md bg-primary/10 p-3">
                <div className="metric-label">Carbon saved</div>
                <div className="mt-1 font-display text-xl font-semibold">{formatKg(swap.estimatedSavingsKgCo2e)} kg</div>
              </div>
              <div className="rounded-md bg-accent/10 p-3">
                <div className="metric-label">Money saved</div>
                <div className="mt-1 font-display text-xl font-semibold">{formatMoney(swap.moneySavedUsd ?? 0)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setCompleted(true)} disabled={completed}>
                <Check />
                {completed ? "Logged" : "I'll do it"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setCompleted(false);
                  setIndex((current) => (current + 1) % smartSwaps.length);
                }}
              >
                <RefreshCw />
                Show another
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
