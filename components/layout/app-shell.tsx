"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CircleDot, Layers3, Moon, Orbit, Radar, ScanSearch, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/pulse", label: "Pulse", icon: Activity },
  { href: "/lens", label: "Lens", icon: ScanSearch },
  { href: "/simulator", label: "What If", icon: Layers3 },
  { href: "/ripple", label: "Ripple", icon: Radar }
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = mounted && resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(99,230,190,0.12),transparent_34%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]" />
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-border/70 bg-background/82 px-4 py-5 backdrop-blur-xl lg:block">
        <Link href="/pulse" className="flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-glow">
            <Orbit className="size-5" />
          </div>
          <div>
            <div className="font-display text-lg font-semibold">Orbit</div>
            <div className="text-xs text-muted-foreground">CarbonLens AI</div>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-y-2 left-0 w-1 rounded-full bg-primary"
                  />
                ) : null}
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-5 space-y-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">Live Model</span>
              <CircleDot className="size-4 text-primary" />
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Gemini powers receipt reads and scenario projections when configured.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <span>{mounted ? `${isDark ? "Dark" : "Light"} mode` : "Theme"}</span>
            {isDark ? <Moon /> : <SunMedium />}
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/86 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/pulse" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Orbit className="size-5" />
            </div>
            <div className="font-display text-lg font-semibold">Orbit</div>
          </Link>
          <Button
            size="icon"
            variant="outline"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Moon /> : <SunMedium />}
          </Button>
        </div>
      </header>

      <main className="min-h-screen pb-24 lg:ml-64 lg:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge variant="success">Personal carbon decision layer</Badge>
              <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">CarbonLens AI</h1>
            </div>
          </div>
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/92 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-1 rounded-md text-xs font-medium text-muted-foreground",
                  active && "bg-muted text-foreground"
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
