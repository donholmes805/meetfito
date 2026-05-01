import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Meet Fito - Homeschool Meetups Made Simple",
  description: "Find families nearby, create study groups, organize P.E. days, and build safe homeschool co-ops.",
};

import { AuthProvider } from "@/context/AuthContext";
import { MobileNav } from "@/components/layout/MobileNav";
import { FitoGuideChat } from "@/components/ai/FitoGuideChat";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
      </head>
      <body className={`${lexend.variable} font-lexend antialiased pb-20 md:pb-0`}>
        <AuthProvider>
          {children}
          <FitoGuideChat />
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  );
}
