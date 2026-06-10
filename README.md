# ishsitotombe.co.uk

Personal portfolio and tools hub for Ish Sitotombe — a freelance developer building AI-powered web tools for UK small businesses.

Live at **[ishsitotombe.co.uk](https://ishsitotombe.co.uk)**

---

## What it is

A Next.js 15 site that serves as both a portfolio and a gateway to three live SaaS tools:

- **Compliance Checker** (`compliance.ishsitotombe.co.uk`) — AI-powered website compliance audit against GDPR, UK Privacy Law, and accessibility standards. Backed by AWS Bedrock (Claude Sonnet).
- **Outreach Agent** (`outreach.ishsitotombe.co.uk`) — AI cold outreach CRM with contact management, campaign sequences, and personalised email generation.
- **Late Payment Chaser** — Automated email sequences for outstanding invoices.

---

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | CSS custom properties (dark/light theme toggle), Tailwind utility classes |
| Animation | Three.js r165 (wireframe hero), Framer Motion |
| Deploy | Netlify (`@netlify/plugin-nextjs`) |
| Forms | Netlify Forms |
| Font | Geist Sans |

---

## Architecture

```
app/
  layout.tsx        — Root layout: theme toggle, nav, contact modal provider, Netlify form stub
  page.tsx          — Home: Three.js hero, demo previews, how-it-works
  globals.css       — Design tokens (CSS vars), animations, grid helpers

components/
  Nav.tsx                 — Sticky nav with theme toggle + contact modal trigger
  HeroCanvas.tsx          — Three.js WebGL wireframe scene (automation network)
  ContactModal.tsx        — Global overlay contact form
  ContactModalProvider.tsx — React Context provider — any component can call openModal()
  ThemeToggle.tsx         — Dark/light toggle writing data-theme to <html>
```

The contact modal uses React Context so `openModal()` is available anywhere without prop drilling. Netlify Forms detects it via a hidden static form in `layout.tsx` rendered at build time.

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy

Deployed automatically via Netlify on push to `main`. No manual build step required.

Environment variables: none required for the portfolio itself. Tool iframes load from their own subdomains.

---

## Related repos

- [`compliance-checker`](https://github.com/reverendish/compliance-checker) — SAM/Lambda + Next.js frontend
- [`outreach-agent`](https://github.com/reverendish/outreach-agent) — Next.js CRM
- [`late-payment-chaser`](https://github.com/reverendish/late-payment-chaser) — Next.js invoice chaser
