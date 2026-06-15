import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Provider } from "./provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { decodeJwtPayload } from "@/lib/auth/jwt";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HookSentry",
  description: "Webhook monitoring and management",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get('hs_access_token')?.value;
  const user = token ? decodeJwtPayload(token) : null;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>
          <AuthProvider initialUser={user}>
            {children}
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
