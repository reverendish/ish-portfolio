import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";

export const metadata: Metadata = {
  title: "Ish Sitotombe — Automation Engineer",
  description: "I build AI automations that save small businesses hours every week. Based in Colchester, working UK-wide.",
  openGraph: {
    title: "Ish Sitotombe — Automation Engineer",
    description: "I build AI automations that save small businesses hours every week.",
    url: "https://ishsitotombe.co.uk",
    siteName: "Ish Sitotombe",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
