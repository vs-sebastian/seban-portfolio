import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import RouteScrollManager from "@/components/navigation/RouteScrollManager";
import HomeRoutePrefetch from "@/components/navigation/HomeRoutePrefetch";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sebastian VS | Scrollytelling Portfolio",
  description: "Graphic Designer • UI/UX Designer • UI Developer based in Kerala, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link
          rel="preload"
          href="/sequence/frame_000.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
      </head>
      <body className="bg-background text-foreground min-h-screen">
        <div className="noise" />
        <Navbar />
        <RouteScrollManager />
        <HomeRoutePrefetch />
        {children}
      </body>
    </html>
  );
}
