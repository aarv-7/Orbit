import type { ReactNode } from "react";

export function SurfaceHeading({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <div className="metric-label">{eyebrow}</div>
        <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
