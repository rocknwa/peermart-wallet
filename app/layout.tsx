import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { config } from "@/lib/alchemy-config";
import { cookieToInitialState } from "@account-kit/core";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SocialWallet DApp",
  description: "Web3 social login with Alchemy Account Kit",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "SocialWallet" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a0a",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const initialState = cookieToInitialState(
    config,
    headersList.get("cookie") ?? undefined
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
