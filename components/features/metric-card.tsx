import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  className
}: {
  label: string;
  value: string;
  detail?: string;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="metric-label">{label}</div>
        <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
        {detail ? <div className="mt-1 text-sm text-muted-foreground">{detail}</div> : null}
      </CardContent>
    </Card>
  );
}
