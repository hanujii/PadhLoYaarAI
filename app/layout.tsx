import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import 'tldraw/tldraw.css';
import "./globals.css";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { NotesWidget } from "@/components/global/NotesWidget";
import { ThemeProvider } from "@/components/global/theme-provider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/AuthContext";
import { OnboardingTour } from "@/components/global/OnboardingTour";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Often desired for "App-like" feel
};

export const metadata: Metadata = {
  title: {
    default: "PadhLoYaar AI - Your Ultimate Study Companion",
    template: "%s | PadhLoYaar AI"
  },
  description: "Experience the next generation of learning with PadhLoYaar AI. Features intelligent tutoring, exam simulation, and deep conceptual explanations wrapped in a premium, gamified interface.",
  applicationName: "PadhLoYaar AI",
  authors: [{ name: "PadhLoYaar AI Team" }],
  keywords: ["AI Tutor", "Study Companion", "Exam Prep", "Education", "Gamified Learning", "India Education", "Padh Lo Yaar"],
  creator: "PadhLoYaar AI",
  publisher: "PadhLoYaar AI",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg", // Note: Ensure this file exists in public/
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://padhloyaar.ai",
    title: "PadhLoYaar AI - Master Your Studies",
    description: "Your seamless AI study companion. Join thousands of students mastering complex topics with ease.",
    siteName: "PadhLoYaar AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "PadhLoYaar AI",
    description: "Your personal AI tutor for exams, concepts, and coding.",
    creator: "@padhloyaarai",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PadhLoYaar AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", outfit.variable)}>
        {/* Global Cinematic Background */}
        <div className="fixed inset-0 -z-50 mesh-gradient-bg opacity-30 dark:opacity-20 pointer-events-none" />

        <AuthProvider>
          <ThemeProvider
            attribute="class"
          // ... rest of provider
          >
            <Header />
            <main className="flex-1 container py-6 mt-28 relative z-10">
              {children}
            </main>
// ... rest of layout
            <Footer />
            <NotesWidget />
            <OnboardingTour />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
