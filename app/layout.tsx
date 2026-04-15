import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
 title: "TailorCV | Få fler intervjuer med AI",
description: "Skapa skräddarsydda CV:n, personliga brev och se exakt hur du matchar jobbet.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="sv">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}