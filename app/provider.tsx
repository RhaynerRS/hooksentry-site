'use client';

import { ThemeProvider } from "next-themes";
import { ThemeSync } from "@/components/theme-sync";

export function Provider(props: Readonly<{ children?: React.ReactNode; defaultTheme?: string }>) {
  return (
    <ThemeProvider attribute="class" defaultTheme={props.defaultTheme ?? "system"} enableSystem>
      <ThemeSync />
      {props.children}
    </ThemeProvider>
  );
}
