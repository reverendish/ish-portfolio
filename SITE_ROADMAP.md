# ishsitotombe.co.uk — Site & Blog Roadmap

**Goal:** evolve the site from a single commercial landing page into a portfolio + blog
that grows over time and quietly earns trust for freelance work. The blog demonstrates
capability passively; the portfolio shows depth. Commercial intent stays present but not
the only thing on the page.

**Principle:** write to be read, not to impress. Ship honest, specific posts; let the
work do the persuading.

---

## Phase 0 — Blog foundation (DONE, 2026-06-23, awaiting your review + deploy)

Built into the existing Next.js site, additive only, typecheck clean:

- `app/writing/posts.ts` — single source of truth for posts (slug, title, date, blurb,
  tags, reading time). Add an entry + a page to publish.
- `app/writing/page.tsx` — the `/writing` index, lists posts as cards (matches `/about` style).
- `app/writing/flow-vs-fisher/page.tsx` — post #1, the continual-learning study.
- `public/research/*.png` — the four figures.
- `components/Nav.tsx` — added a **Writing** nav link.
- `app/page.tsx` — added a research card to the "Built in public" section.

**Before deploy:** run `npm run build` locally, click through `/writing` and the post on a
Netlify deploy-preview, then commit. Two placeholders to resolve (see Phase 1).

---

## Phase 1 — Ship & polish (this week, ~half day)

- [ ] **Make `flow-engram-exp1` public** on github.com/reverendish (the post links to it).
      Add a paper PDF (Zenodo DOI) and update the link in the post (`TODO` comment marks it).
- [ ] **Footer "Writing" link** (homepage footer currently has GitHub/LinkedIn — add it).
- [ ] **`sitemap.ts` + `robots.ts`** in `app/` so `/writing/*` is indexed.
- [ ] **RSS feed** at `app/writing/feed.xml/route.ts` generated from `posts.ts`.
- [ ] **Per-post OG image** — either a static one per post or a generated one via Next's
      `opengraph-image` convention, so shares look good.
- [ ] Confirm `og-image` exists as referenced (audit flagged `.svg` vs `.png` mismatch).

---

## Phase 2 — Authoring pipeline (before post #2, ~1 day)

The first post is a hand-built `.tsx` page — fine for one, friction for many. Reduce it
before you write the next:

- [ ] **Migrate to MDX** (`@next/mdx`): future posts become `app/writing/<slug>/page.mdx`
      so you write Markdown, not JSX. Keep `posts.ts` as the index registry (or derive it
      from MDX frontmatter).
- [ ] **Shared article components:** a `<Prose>` wrapper (the muted/1.85-line-height style),
      reusable `<Figure>` and `<DataTable>` (extract from post #1), so each post is content,
      not layout.
- [ ] **Auto reading-time** from word count instead of hand-entering it.
- [ ] Ties into audit item: as styling repeats, extract the inline `style` objects into
      shared constants / CSS modules.

---

## Phase 3 — Content & portfolio depth (ongoing)

- [ ] **Cadence:** realistic is one post every 2–3 weeks. Consistency beats volume.
- [ ] **Backlog (concrete ideas):**
  - MCP-x-Mac, built in public: how a self-evolving tool registry works.
  - The outreach-agent architecture: a BFF + Lambda pattern for a solo dev (with diagrams).
  - "How I built a [client] automation in N days" — a real case study (with permission).
  - A short, honest piece on being self-taught and shipping real tools.
- [ ] **Portfolio / work page:** promote the homepage project cards into a fuller `/work`
      page with case studies, screenshots, and outcomes — the thing a freelance lead reads.
- [ ] **About page:** already strong; keep it honest (construction → self-taught → builds).

---

## Phase 4 — Growth & distribution (once a few posts exist)

- [ ] **Privacy-friendly analytics** (Plausible / Umami) — see which posts pull freelance
      enquiries, not just traffic.
- [ ] **Distribution:** cross-post to dev.to / LinkedIn; submit the strongest pieces to
      Hacker News / relevant subreddits. Most blog reach is from distribution, not SEO.
- [ ] **Light email capture** ("get new posts") — optional, only if you'll actually send.
- [ ] **Internal linking** from posts → relevant tools/contact, so reading converts.

---

## Cross-cutting (from the code audit)

- **Design tokens:** resolve the broken `shared/` import (AUDIT_FIXES §M5) so every app
  — including new blog styling — inherits one source of truth instead of drifting copies.
- **Keep Next current:** the portfolio is on Next 16 (good); don't let it fall behind.
- **Version control discipline:** the portfolio is already on GitHub; keep deploys via the
  safer `deploy-all.sh` (AUDIT_FIXES §H2).

---

## Open decisions (your call)

1. **Blog location:** `/writing` on the main domain (current, best for SEO/authority) vs a
   `blog.` subdomain (cleaner separation, weaker SEO). Recommend staying on `/writing`.
2. **MDX now or later:** fine to stay `.tsx` until post #2; migrate at Phase 2.
3. **Comments:** recommend none (spam/maintenance); let people reach you via contact/LinkedIn.
4. **Tone split:** how commercial vs personal the blog reads — current post #1 leans
   honest/technical, which suits freelance credibility. Adjust per post.

---

## Changelog
- **2026-06-23.** Phase 0 shipped (blog foundation + post #1), typecheck clean, awaiting
  review/deploy. Roadmap created.
