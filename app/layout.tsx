import type { Metadata } from "next";
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
