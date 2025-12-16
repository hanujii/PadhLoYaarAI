import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import 'tldraw/tldraw.css';
import "./globals.css";
import { Header } from "@/components/global/Header";
import { Footer } from "@/components/global/Footer";
import { NotesWidget } from "@/components/global/NotesWidget";
import { ThemeProvider } from "@/components/global/theme-provider";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/auth/AuthContext";
import { OnboardingTour } from "@/components/global/OnboardingTour";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "plyAI",
  description: "Your seamless AI study companion.",
  icons: {
    icon: "/logo.svg", // Using the logo we're already using in the app
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased flex flex-col", poppins.variable)}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            themes={['light', 'dark', 'pitch-black', 'theme-red', 'theme-cyan', 'theme-stranger-things', 'theme-money-heist', 'theme-dark-series']}
          >
            <Header />
            <main className="flex-1 container py-6">
              {children}
            </main>
            <Footer />
            <NotesWidget />
            <OnboardingTour />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
