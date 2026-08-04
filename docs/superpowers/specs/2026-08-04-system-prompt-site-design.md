# System Prompt — Companion Site Design

**Date:** 2026-08-04
**Owner:** Jan Bussieck (IMG.LY)
**Status:** Approved design → implementation

## Summary

An independent companion site for a monthly, invite-based coffee chat with
marketing & growth leaders from dev-tool / SDK companies. The through-line:
how dev tools thrive in a vibecoding, agentic-first world — weathering the
threat of "vibecoding" replacing tools, becoming AI-first, catering to agents,
and becoming the default choice an LLM reaches for.

The site is **independent-branded** ("System Prompt"), not visibly an IMG.LY
property, so it reads as a peer/community project rather than vendor content.

Tagline: *"Marketing & growth for dev tools in the age of agents."*

Domain: **systemprompt.chat** (confirmed available; owner registering). Canonical
site URL `https://systemprompt.chat` is baked into meta tags, sitemap, and OG.

## Goals

- A content-heavy home for opinionated writing on dev-tool GTM in the agent era.
- A **blog** ("Writing") as the primary content surface.
- A **case-studies** collection ("Field Notes") on how strong dev tools position
  for the agent era.
- A **newsletter** signup.
- An **apply-to-join** flow for the monthly coffee chats.
- A clean, dev-oriented aesthetic with real polish that does **not** look
  AI-generated (no gradient blobs, stock hero art, or generic slop).

## Non-Goals

- No custom backend, auth, or database. Forms use Formspree's free tier.
- No CMS. Content authored as MDX in-repo.
- No deployment in this pass (static build only; deploy later on Vercel/Netlify/
  Cloudflare Pages — any static host works).

## Stack & Architecture

- **Astro (latest) + MDX + TypeScript**, static output (`output: 'static'`).
- **Hand-authored CSS with design tokens** (CSS custom properties + Astro scoped
  styles). No Tailwind — more control, reads hand-built.
- **Self-hosted fonts** via Fontsource: a clean sans for body (Inter) + a mono
  for terminal/labels (JetBrains Mono). No external font/CDN calls.
- **Light/dark theme**: respects `prefers-color-scheme`, user-togglable,
  persisted to `localStorage`, applied pre-paint via a tiny inline script to
  avoid flash.
- Package manager: **pnpm**. Node 22+ (dev machine on 25).
- Project dir: `/Users/janbussieck/Projects/system-prompt`, git-initialized.

## Site Structure

| Route | Purpose |
|-------|---------|
| `/` | Home: terminal hero → thesis → featured writing → featured field notes → coffee-chat CTA → newsletter |
| `/writing` | Blog index (all posts, tag filter) |
| `/writing/[slug]` | Individual post |
| `/field-notes` | Case-studies index |
| `/field-notes/[slug]` | Individual case study |
| `/chats` | What the coffee chats are, format, who they're for, apply form |
| `/404` | Simple styled not-found |

Newsletter signup is a reusable component used on `/` and in the global footer.

## Content Model (Astro content collections, zod-typed)

### `writing` (blog)
Frontmatter: `title`, `description`, `pubDate`, `tags: string[]`,
`readingTime?`, `draft: boolean`, `featured: boolean`.

Seed posts (real short drafts, editable — not lorem):
1. **The Hidden Cost of Vibecoding** — why "just prompt it" isn't free.
2. **Build vs. Buy in the Age of Vibecoding** — recalculating the classic
   trade-off when generation is cheap.
3. **Positioning Your SDK as an Agent Darling** — being the tool an agent
   picks.
4. **Becoming the Default Choice** — getting your dev tool into the LLM's
   answer (docs, structured data, MCP, discoverability).

### `field-notes` (case studies)
Frontmatter: `company`, `category`, `logoHint?`, `summary`, `theAgentEraMove`,
`takeaways: string[]`, `pubDate`, `featured: boolean`.

Seed companies (short, opinionated analyses — clearly framed as commentary):
Supabase, Algolia, Mapbox, Formspree, Clerk. (Fifth is swappable.)

## Design System

- **Palette:** near-monochrome. Off-white paper background, near-black ink.
  One warm accent (espresso-amber) as a quiet coffee nod; a terminal-green used
  sparingly in the hero only. Dark theme inverts to a soft near-black surface.
- **Type:** Inter (body/UI), JetBrains Mono (terminal, labels, kickers, code).
  Strong hierarchy; large confident headlines; readable body measure (~68ch).
- **Layout:** generous whitespace, hairline (1px) borders, a restrained grid,
  section kickers in mono-caps. No drop-shadow-heavy cards or gradient fills.
- **Tokens** live in one `tokens.css`: color (light+dark), space scale, type
  scale, radii, borders, motion durations/easings.
- **Motion:** subtle. Hover/scroll micro-interactions, respects
  `prefers-reduced-motion` (disables the typing loop and reveals).

## Hero (terminal / typing)

A faux terminal panel that types and rotates prompt lines with a blinking
cursor. Implemented as a small vanilla-JS Astro island (no animation libs),
disabled to a static first line under `prefers-reduced-motion`.

Rotating lines:
- `> is your SDK an agent darling?`
- `> build vs. buy — who's actually cheaper now?`
- `> how do you become the LLM's default import?`

Below the terminal: the tagline + primary CTA ("Join a chat") and secondary
CTA ("Read the writing").

## Forms — Formspree

Two forms POST to Formspree endpoints. Endpoint IDs live in one config module
(`src/config.ts`) with clearly-marked placeholders to swap for real forms.

1. **Newsletter** — single email field. Inline success/error states, no page
   reload (fetch to Formspree, graceful fallback to native POST).
2. **Apply to join** (`/chats`) — name, email, company, role, and a
   "what you're wrestling with" textarea. Same submit behavior.

Both include honeypot + a note that submissions go to Formspree.

## Accessibility & Performance

- Semantic landmarks, skip link, focus-visible styles, labelled form controls.
- Color contrast AA in both themes.
- Near-zero JS (theme toggle, terminal island, form submit only).
- Self-hosted fonts with `font-display: swap`; system-font fallback stack.

## Verification

1. `pnpm build` (astro) must complete with no errors.
2. Run `pnpm dev`; load `/`, `/writing`, a post, `/field-notes`, a study, and
   `/chats` in-browser.
3. Confirm: terminal hero animates (and is static under reduced-motion), theme
   toggle works with no flash, blog + field-notes lists render from collections,
   both forms render with validation. Capture screenshots before completion.

## Directory Layout (target)

```
system-prompt/
  astro.config.mjs
  package.json
  tsconfig.json
  src/
    config.ts                 # Formspree endpoints, site meta
    content.config.ts         # collections + zod schemas
    styles/
      tokens.css
      global.css
    components/
      Terminal.astro          # typing hero island
      ThemeToggle.astro
      NewsletterForm.astro
      SiteHeader.astro
      SiteFooter.astro
      PostCard.astro
      FieldNoteCard.astro
      SectionKicker.astro
    layouts/
      Base.astro
      Post.astro
      FieldNote.astro
    pages/
      index.astro
      writing/index.astro
      writing/[...slug].astro
      field-notes/index.astro
      field-notes/[...slug].astro
      chats.astro
      404.astro
    content/
      writing/*.mdx           # 4 seed posts
      field-notes/*.mdx       # 5 seed studies
  public/
    favicon.svg
  docs/superpowers/specs/2026-08-04-system-prompt-site-design.md
```

## Open Items (non-blocking, swappable later)

- Real Formspree endpoint IDs.
- Final fifth case study (Clerk assumed).
- Real logos/favicon (placeholder wordmark for now).
- Domain registration at registrar (owner to complete; name confirmed available).
