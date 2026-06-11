import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";

export const metadata: Metadata = {
  title: "Orbit | CarbonLens AI",
  description: "AI-powered carbon decision layer for everyday choices."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1020" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
