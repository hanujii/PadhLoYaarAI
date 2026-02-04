import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import 'tldraw/tldraw.css';
import "./globals.css";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { NotesWidget } from "@/components/global/NotesWidget";
import { ThemeProvider } from "@/components/global/theme-provider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/AuthContext";
import { OnboardingTour } from "@/components/global/OnboardingTour";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans"
});

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: "StudyGenie - AI-Powered Learning Platform",
    template: "%s | StudyGenie"
  },
  description: "Your intelligent AI study companion. Master any subject with 21+ AI-powered tools including tutoring, exam prep, flashcards, and more. Free to use.",
  applicationName: "StudyGenie",
  authors: [{ name: "StudyGenie Team" }],
  keywords: [
    "AI Tutor",
    "Study Tool",
    "Exam Prep",
    "Flashcards",
    "Education AI",
    "Learning Platform",
    "Student Tools",
    "AI Study Assistant",
    "Online Learning",
    "Study Genie"
  ],
  creator: "StudyGenie",
  publisher: "StudyGenie",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studygenie.app",
    title: "StudyGenie - Your AI Study Companion",
    description: "Master any subject with AI-powered tools. Instant tutoring, exam prep, flashcards, and more. Completely free.",
    siteName: "StudyGenie",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyGenie - AI Study Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyGenie - AI-Powered Learning",
    description: "Your personal AI tutor for exams, concepts, and coding.",
    creator: "@studygenie",
    images: ["/og-image.png"]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StudyGenie",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          outfit.variable
        )}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {/* Fixed Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 pt-24 relative z-10">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating Widgets */}
            <NotesWidget />
            <OnboardingTour />

            {/* Toast Notifications */}
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: "glass border-white/10",
                duration: 4000,
              }}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
