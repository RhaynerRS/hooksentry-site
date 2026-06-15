'use client';

import { ThemeProvider } from "next-themes";

export function Provider(props: { children?: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {props.children}
    </ThemeProvider>
  );
}
