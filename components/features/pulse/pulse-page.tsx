import { SurfaceHeading } from "@/components/features/surface-heading";
import { MetricCard } from "@/components/features/metric-card";
import { HabitFingerprint } from "@/components/features/pulse/habit-fingerprint";
import { OrbitalVisualization } from "@/components/features/pulse/orbital-visualization";
import { SmartSwapCard } from "@/components/features/pulse/smart-swap-card";
import { momentumSnapshot } from "@/lib/orbit/carbon-data";
import { formatKg } from "@/lib/utils";

export function PulsePage() {
  return (
    <section>
      <SurfaceHeading
        eyebrow="Pulse"
        title="Your carbon momentum at a glance"
        description="A live behavior snapshot that turns repeated choices into a simple progress signal."
      />
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <div className="surface-panel p-5">
            <OrbitalVisualization />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MetricCard label="Saved" value={`${formatKg(momentumSnapshot.totalSavedKgCo2e)} kg`} detail="CO2e this month" />
            <MetricCard label="Streak" value={`${momentumSnapshot.streakDays} days`} detail="Low-carbon actions" />
            <MetricCard label="Swaps" value={`${momentumSnapshot.swapsCompleted}`} detail="Completed changes" />
          </div>
        </div>
        <div className="space-y-5">
          <SmartSwapCard />
          <HabitFingerprint />
        </div>
      </div>
    </section>
  );
}
