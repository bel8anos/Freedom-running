import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";
import { CustomAuthProvider } from "@/components/custom-auth-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Freedom Running - Greece's Premier Mountain Running Platform",
  description:
    "Join Greece's most exciting mountain running tournaments. Discover, register, and compete in breathtaking trail races across the Greek mountains.",
  keywords: [
    "mountain running",
    "trail running",
    "Greece",
    "tournaments",
    "races",
  ],
  authors: [{ name: "Freedom Running" }],
  openGraph: {
    title: "Freedom Running - Mountain Running Tournaments in Greece",
    description:
      "Discover and participate in Greece's premier mountain running tournaments",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <CustomAuthProvider>
          <QueryProvider>
            <main className="flex flex-col min-h-screen mx-auto max-w-7xl">
              <Header />
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </CustomAuthProvider>
      </body>
    </html>
  );
}
