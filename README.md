# AX Factor

Site for **AX Factor** — a blog and monthly coffee chat on agentic marketing for
dev-tool / SDK companies. "AX" means agent experience: how well an AI agent can
find, pick and build with a dev tool.

Tagline: *Agentic marketing for dev tools.*
Domain: [axfactor.dev](https://axfactor.dev) (formerly System Prompt, systemprompt.chat)

Built with [Astro](https://astro.build) + MDX. Static output, near-zero JS,
hand-authored CSS design tokens, self-hosted fonts, light/dark theme.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output to dist/
pnpm preview    # preview the production build
```

Requires Node 22+ and pnpm.

## Content

All content is MDX in `src/content/`. Add a file, set the frontmatter, and it
appears automatically (newest first; `draft: true` hides a post).

### Writing — `src/content/writing/*.mdx`

```yaml
title: "Post title"
description: "One-line summary shown on cards and in <meta>."
pubDate: 2026-07-30
tags: ["positioning", "agents"]   # first tag shows on the card
draft: false                       # true = hidden
featured: false                    # true = eligible for the home page (newest 3 show)
```

### Field Notes (case studies) — `src/content/field-notes/*.mdx`

```yaml
company: "Supabase"
category: "Backend / Postgres"
summary: "One-line thesis shown on the card and as the lede."
theAgentEraMove: "The single move, rendered in the highlighted callout."
takeaways:
  - "Bullet one."
  - "Bullet two."
pubDate: 2026-07-22
featured: false                    # true = eligible for the home page (newest 3 show)
```

The MDX body below the frontmatter becomes the article content.

### Post ASCII art — `src/ascii/<slug>.txt`

Each writing post can have an ASCII illustration. Drop a plain-text file at
`src/ascii/<slug>.txt` (matching the post's filename) and it renders
automatically: a terminal panel at the top of the post and a compact "terminal
cover" on the post cards. No frontmatter, no escaping — edit the `.txt` and it
updates.

The panel is a **doodlepad**: click anywhere in the art to scribble on it right
in the page — no buttons, no toolbar. Edits are ephemeral (they live only in the
reader's browser tab and reset on reload); the `.txt` file is always the source
of truth. To change the art for real, edit the `.txt`.

Use only monospace-safe characters (box-drawing `─│┌┐└┘├┤┬┴┼`, doubles
`═║╔╗╚╝`, blocks `█▓▒░`, and ASCII). Avoid variable-width glyphs like
`▶ ◀ ► ★ ● ○`, which break column alignment.

## Forms (Formspree)

Both the newsletter and the apply-to-join form post to [Formspree](https://formspree.io).
Create two forms in your Formspree account and paste their endpoints into
`src/config.ts`:

```ts
export const FORMSPREE = {
  newsletter: 'https://formspree.io/f/YOUR_NEWSLETTER_ID',
  apply: 'https://formspree.io/f/YOUR_APPLY_ID',
};
```

Until real IDs are set, forms render and validate but submissions fail gracefully
with an inline error. Each form includes a `_gotcha` honeypot for spam.

## Design tokens

Colors, spacing, type scale, and motion live in `src/styles/tokens.css`
(light + dark). Global base styles are in `src/styles/global.css`. Components use
scoped `<style>` blocks. There is no Tailwind.

## Deploy

`pnpm build` emits a fully static `dist/`. Host it anywhere static:
Vercel, Netlify, or Cloudflare Pages (framework preset: Astro). Then point
`axfactor.dev` DNS at the host. `site` is already set to
`https://axfactor.dev` in `astro.config.mjs` for canonical URLs and the
sitemap.

## Structure

```
src/
  config.ts              # site meta + Formspree endpoints
  content.config.ts      # collections + zod schemas
  styles/                # tokens.css, global.css
  components/            # Terminal, ThemeToggle, forms, cards, header/footer
  layouts/               # Base, Post, FieldNote
  pages/                 # index, writing/, field-notes/, chats, 404
  content/               # writing/*.mdx, field-notes/*.mdx
```
