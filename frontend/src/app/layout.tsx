'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { AuthProvider } from "@/lib/auth-context";
import { useEffect } from "react";
import { useStore } from "@/lib/store-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function RootLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setStoreId } = useStore();

  useEffect(() => {
    // Default to store ID 1 for customers
    setStoreId(1);
  }, [setStoreId]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <StoreProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
