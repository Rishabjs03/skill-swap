import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";

import Navbar from "./components/Navbar";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  weight: ["400"], // must be array, not string
});

export const metadata: Metadata = {
  title: "Skill Swaap",
  description: "A place where you can charge a price for your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${libre.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
