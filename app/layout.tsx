import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import ContactModalProvider from "@/components/ContactModalProvider";

export const metadata: Metadata = {
  title: "Ish Sitotombe — Automation Engineer",
  description: "I build AI automations that save small businesses hours every week. Based in Colchester, working UK-wide.",
  icons: { icon: '/favicon.svg' },
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
      <body className={GeistSans.className}>
        {/* Hidden form for Netlify — contact modal renders client-side */}
        <form name="contact" data-netlify="true" hidden aria-hidden="true">
          <input type="text" name="name" />
          <input type="email" name="email" />
          <input type="text" name="business" />
          <textarea name="problem" />
        </form>
        <ContactModalProvider>
          {children}
        </ContactModalProvider>
      </body>
    </html>
  );
}
