import { AppShell } from "@/components/layout/app-shell";

export default function OrbitAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
