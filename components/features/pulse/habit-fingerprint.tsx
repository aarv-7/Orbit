import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { habitFingerprint } from "@/lib/orbit/carbon-data";
import { formatKg } from "@/lib/utils";

const severityClass = {
  high: "bg-orbit-coral",
  medium: "bg-orbit-amber",
  low: "bg-orbit-cyan"
};

export function HabitFingerprint() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habit fingerprint</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habitFingerprint.map((habit) => (
          <div key={habit.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{habit.label}</span>
              <span className="text-muted-foreground">{formatKg(habit.weeklyKgCo2e)} kg/wk</span>
            </div>
            <Progress value={habit.percentage} indicatorClassName={severityClass[habit.severity]} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
