import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KIRA Cafe - Your perfect cup, ready when you are",
  description: "Skip the line. Order ahead, customize your drink, and pick up in minutes.",
};

import { CartProvider } from "@/context/CartContext";

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
          href="https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.min.css"
        />
      </head>
      <body className={`${outfit.variable} font-outfit antialiased`}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
