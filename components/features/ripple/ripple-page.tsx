import { Leaf, Plug, Route, Trophy } from "lucide-react";
import { SurfaceHeading } from "@/components/features/surface-heading";
import { MetricCard } from "@/components/features/metric-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rippleMilestones } from "@/lib/orbit/carbon-data";
import { formatKg } from "@/lib/utils";
import { RippleVisualization } from "@/components/features/ripple/ripple-visualization";

const totalKg = 32.8;
const equivalents = [
  { label: "Phone charges", value: "7,900", icon: Plug },
  { label: "Miles not driven", value: "82", icon: Route },
  { label: "Tree-days", value: "544", icon: Leaf },
  { label: "Milestones", value: "2/4", icon: Trophy }
];

export function RipplePage() {
  return (
    <section>
      <SurfaceHeading
        eyebrow="Ripple"
        title="See cumulative impact become tangible"
        description="Every completed swap expands your climate ripple across milestones and real-world equivalents."
      />

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <RippleVisualization totalKg={totalKg} />
          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="Cumulative impact" value={`${formatKg(totalKg)} kg`} detail="CO2e saved" />
            <MetricCard label="Next milestone" value="15.2 kg" detail="To young tree year" />
          </div>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Tangible equivalents</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {equivalents.map((equivalent) => {
                const Icon = equivalent.icon;
                return (
                  <div key={equivalent.label} className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-primary/12 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div className="font-display text-2xl font-semibold">{equivalent.value}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{equivalent.label}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rippleMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <div className={`grid size-10 shrink-0 place-items-center rounded-md ${milestone.reached ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    <Trophy className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-medium">{milestone.label}</div>
                      <Badge variant={milestone.reached ? "success" : "outline"}>
                        {milestone.reached ? "Reached" : `${formatKg(milestone.thresholdKgCo2e - totalKg)} kg away`}
                      </Badge>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{milestone.equivalent}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
