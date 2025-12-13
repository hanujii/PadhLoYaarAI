import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { NotesWidget } from "@/components/global/NotesWidget";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Padh Lo Yaar",
  description: "AI-powered study toolbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", inter.variable)}>
        <Header />
        <main className="flex-1 container py-6">
          {children}
        </main>
        <Footer />
        <NotesWidget />
      </body>
    </html>
  );
}
