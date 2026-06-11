"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, Loader2, UploadCloud } from "lucide-react";
import { SurfaceHeading } from "@/components/features/surface-heading";
import { MetricCard } from "@/components/features/metric-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirebaseAuth } from "@/components/providers/firebase-auth-provider";
import { saveLensAnalysis } from "@/lib/firebase/firestore";
import { cn, formatKg, formatMoney } from "@/lib/utils";
import type { LensAnalysis } from "@/types/orbit";

type LensStatus = "idle" | "preview" | "analyzing" | "complete" | "error";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function LensPage() {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const { user } = useFirebaseAuth();
  const [status, setStatus] = React.useState<LensStatus>("idle");
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [analysis, setAnalysis] = React.useState<LensAnalysis | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function handleFile(nextFile: File | undefined) {
    if (!nextFile) {
      return;
    }

    setError(null);
    setAnalysis(null);
    setFile(nextFile);
    setPreviewUrl(await readFileAsDataUrl(nextFile));
    setStatus("preview");
  }

  async function analyzeReceipt() {
    if (!file || !previewUrl) {
      return;
    }

    setStatus("analyzing");
    setError(null);

    try {
      const response = await fetch("/api/lens/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType: file.type,
          fileName: file.name
        })
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = (await response.json()) as LensAnalysis;
      setAnalysis(result);
      setStatus("complete");

      if (user) {
        await saveLensAnalysis(user.uid, result);
      }
    } catch {
      setError("Orbit could not analyze this image. Try a clearer receipt or product photo.");
      setStatus("error");
    }
  }

  return (
    <section>
      <SurfaceHeading
        eyebrow="Lens"
        title="Upload a receipt and find the best carbon swap"
        description="Gemini extracts likely items, estimates carbon impact, and returns one practical substitution."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Receipt analysis workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <button
              type="button"
              className={cn(
                "focus-ring relative flex min-h-[300px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 p-5 text-center transition-colors hover:bg-muted/50",
                previewUrl && "border-solid"
              )}
              onClick={() => inputRef.current?.click()}
            >
              {previewUrl ? (
                <Image src={previewUrl} alt="Uploaded receipt preview" fill className="object-cover" sizes="(max-width: 1280px) 100vw, 460px" />
              ) : (
                <div className="max-w-sm">
                  <div className="mx-auto mb-4 grid size-12 place-items-center rounded-lg bg-primary/15 text-primary">
                    <UploadCloud className="size-6" />
                  </div>
                  <div className="font-semibold">Upload receipt or product image</div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    JPG, PNG, or WebP. Keep the item names visible for higher confidence.
                  </p>
                </div>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={analyzeReceipt} disabled={!file || status === "analyzing"}>
                {status === "analyzing" ? <Loader2 className="animate-spin" /> : <Camera />}
                Analyze
              </Button>
              <Button
                variant="outline"
                disabled={!file}
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setAnalysis(null);
                  setStatus("idle");
                  setError(null);
                }}
              >
                Reset
              </Button>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </CardContent>
        </Card>

        <div className="space-y-5">
          {analysis ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard label="Total carbon" value={`${formatKg(analysis.totalKgCo2e)} kg`} detail="Estimated CO2e" />
                <MetricCard label="Confidence" value={`${Math.round(analysis.confidence * 100)}%`} detail="AI certainty" />
                <MetricCard
                  label="Swap saves"
                  value={`${formatKg(analysis.bestSwap.estimatedSavingsKgCo2e)} kg`}
                  detail={formatMoney(analysis.bestSwap.moneySavedUsd ?? 0)}
                />
              </div>
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <CardTitle>Best swap recommendation</CardTitle>
                    <Badge variant="success">
                      <CheckCircle2 className="mr-1 size-3" />
                      {analysis.bestSwap.effort} effort
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/35 p-4">
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div>
                        <div className="metric-label">From</div>
                        <div className="mt-1 font-semibold">{analysis.bestSwap.from}</div>
                      </div>
                      <div className="text-muted-foreground">-&gt;</div>
                      <div>
                        <div className="metric-label">To</div>
                        <div className="mt-1 font-semibold">{analysis.bestSwap.to}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold">{analysis.bestSwap.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{analysis.bestSwap.description}</p>
                  </div>
                  <p className="text-sm leading-6">{analysis.summary}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Detected carbon items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.items.map((item) => (
                    <div key={`${item.name}-${item.unit}`} className="flex items-center justify-between gap-3 rounded-md border border-border bg-background p-3">
                      <div>
                        <div className="font-medium capitalize">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} {item.unit} - {item.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatKg(item.estimatedKgCo2e)} kg</div>
                        <div className="text-xs text-muted-foreground">{Math.round(item.confidence * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="min-h-[300px]">
              <CardContent className="flex h-full min-h-[300px] items-center justify-center p-6 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto mb-4 grid size-12 place-items-center rounded-lg bg-accent/15 text-accent">
                    <Camera className="size-6" />
                  </div>
                  <h3 className="font-display text-xl font-semibold">Analysis appears here</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Upload and analyze an image to see carbon estimates, item confidence, and the strongest swap.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
