import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";
import ContactModalProvider from "@/components/ContactModalProvider";

export const metadata: Metadata = {
  metadataBase: new URL('https://ishsitotombe.co.uk'),
  title: "Ish Sitotombe",
  description: "Business automations and custom software. Based in Colchester, UK.",
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: "Ish Sitotombe",
    description: "Business automations and custom software. Based in Colchester, UK.",
    url: "https://ishsitotombe.co.uk",
    siteName: "Ish Sitotombe",
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Ish Sitotombe' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ish Sitotombe",
    description: "Business automations and custom software. Based in Colchester, UK.",
    images: ['/og-image.svg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Prevent theme flash — reads localStorage before React hydrates */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);})();` }} />

        {/* PLAUSIBLE ANALYTICS — BUY SUBSCRIPTION BY 27/06/26
            30-day free trial at https://plausible.io
            Uncomment the line below and set data-domain to activate:
        <script defer data-domain="ishsitotombe.co.uk" src="https://plausible.io/js/script.js"></script>
        */}

        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": ["Person", "ProfessionalService"],
          "name": "Ish Sitotombe",
          "url": "https://ishsitotombe.co.uk",
          "description": "Business automations and custom software. Based in Colchester, UK.",
          "areaServed": { "@type": "Country", "name": "United Kingdom" },
          "knowsAbout": ["AI automation", "workflow automation", "GDPR compliance", "UK Companies House API", "outreach automation"],
        }) }} />
      </head>
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
