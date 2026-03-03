import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A2P 10DLC Registration",
  description: "Register your brand and campaign for A2P 10DLC SMS compliance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-[#F7F9FC] text-[#020617] text-xs`}>
        {children}
      </body>
    </html>
  );
}
