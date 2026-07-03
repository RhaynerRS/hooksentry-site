import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { cookies } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Provider } from "./provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { decodeJwtPayload } from "@/lib/auth/jwt";
import { Toaster } from "@/components/ui/toaster";

const onest = Onest({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HookSentry",
  description: "Webhook monitoring and management",
};

const VALID_THEMES = ['light', 'dark', 'system'];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('hs_access_token')?.value;
  const user = token ? decodeJwtPayload(token) : null;
  const locale = await getLocale();
  const messages = await getMessages();
  const cookieTheme = cookieStore.get('hs_theme')?.value;
  const defaultTheme = cookieTheme && VALID_THEMES.includes(cookieTheme) ? cookieTheme : 'system';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={onest.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Provider defaultTheme={defaultTheme}>
            <AuthProvider initialUser={user}>
              {children}
              <Toaster />
            </AuthProvider>
          </Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
