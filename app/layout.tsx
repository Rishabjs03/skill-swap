import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  weight: ["400"], // must be array, not string
});

export const metadata: Metadata = {
  title: "Skill Swaap",
  description: "A place where you can charge a price for your knowledge",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <html lang="en">
      <body className={`${libre.className} antialiased`}>
        <Navbar session={session} />

        {children}
        <Analytics />
      </body>
    </html>
  );
}
