import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trello Pro | Premium Task Management",
  description: "A premium, glassmorphic project management tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
