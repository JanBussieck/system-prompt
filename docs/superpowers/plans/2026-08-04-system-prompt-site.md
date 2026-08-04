# System Prompt Companion Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, dev-oriented, content-heavy Astro site ("System Prompt") — a terminal-hero landing page, a blog, a case-studies collection, a newsletter signup, and an apply-to-join form for a monthly coffee chat aimed at dev-tool marketing/growth leaders.

**Architecture:** Astro static site with MDX content collections for blog + case studies, hand-authored CSS design tokens (no Tailwind), self-hosted fonts, a tiny vanilla-JS terminal typing island, and Formspree-backed forms. No backend, no CMS.

**Tech Stack:** Astro (latest) · @astrojs/mdx · @astrojs/sitemap · TypeScript · Fontsource (Inter + JetBrains Mono) · Formspree · pnpm.

## Global Constraints

- Package manager: **pnpm**. Node 22+.
- Astro `output: 'static'`. Canonical site URL: `https://systemprompt.chat`.
- Brand: **System Prompt**. Tagline: *"Marketing & growth for dev tools in the age of agents."*
- No Tailwind. Styling via CSS custom properties in `src/styles/tokens.css` + `global.css` and Astro scoped `<style>`.
- Self-host fonts (no Google Fonts/CDN calls). Fonts: Inter (body), JetBrains Mono (mono/terminal/labels).
- Near-monochrome palette + one warm accent (espresso-amber) + sparing terminal-green (hero only). Light/dark themes, no flash.
- Respect `prefers-reduced-motion` (disables typing loop + reveal animations).
- Accessibility: skip link, semantic landmarks, labelled controls, `:focus-visible`, AA contrast.
- Formspree endpoint IDs live only in `src/config.ts` as clearly-marked placeholders.
- Seed content is real short drafts in an operator voice — never lorem.
- Verification per task: `pnpm build` must succeed. No unit-test framework; "tests" are build success + route/DOM/visual checks.

---

### Task 1: Scaffold project, config, tokens, fonts

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/config.ts`
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `public/favicon.svg`

**Interfaces:**
- Produces: `src/config.ts` exporting `SITE` (`{ name, tagline, url, description, author }`) and `FORMSPREE` (`{ newsletter: string, apply: string }`). Consumed by layouts, forms, SEO.
- Produces CSS custom properties (design tokens) consumed by every component.

- [ ] **Step 1: Init and install deps**

```bash
cd /Users/janbussieck/Projects/system-prompt
pnpm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --yes
pnpm add @astrojs/mdx @astrojs/sitemap
pnpm add @fontsource/inter @fontsource/jetbrains-mono
```

- [ ] **Step 2: Configure Astro** — `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://systemprompt.chat',
  output: 'static',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark-dimmed' } },
});
```

- [ ] **Step 3: Site + Formspree config** — `src/config.ts`:

```ts
export const SITE = {
  name: 'System Prompt',
  tagline: 'Marketing & growth for dev tools in the age of agents.',
  url: 'https://systemprompt.chat',
  description:
    'A monthly coffee chat and field guide for marketing and growth leaders at dev-tool and SDK companies navigating the vibecoding, agentic-first era.',
  author: 'System Prompt',
} as const;

// TODO(owner): replace with real Formspree form IDs from formspree.io.
export const FORMSPREE = {
  newsletter: 'https://formspree.io/f/REPLACE_NEWSLETTER_ID',
  apply: 'https://formspree.io/f/REPLACE_APPLY_ID',
} as const;
```

- [ ] **Step 4: Design tokens** — `src/styles/tokens.css`:

```css
:root {
  color-scheme: light dark;
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace;

  /* space scale */
  --sp-1: .25rem; --sp-2: .5rem; --sp-3: .75rem; --sp-4: 1rem;
  --sp-6: 1.5rem; --sp-8: 2rem; --sp-12: 3rem; --sp-16: 4rem; --sp-24: 6rem;
  /* type scale */
  --fs-xs: .8125rem; --fs-sm: .9375rem; --fs-base: 1.0625rem; --fs-lg: 1.25rem;
  --fs-xl: 1.6rem; --fs-2xl: 2.25rem; --fs-3xl: 3.25rem; --fs-4xl: 4.5rem;
  --measure: 68ch;
  --radius: 10px; --radius-sm: 6px;
  --border: 1px solid var(--hairline);
  --dur: 240ms; --ease: cubic-bezier(.2,.6,.2,1);
}

/* Light (default) */
:root, :root[data-theme='light'] {
  --bg: #faf9f6;           /* warm paper */
  --surface: #ffffff;
  --ink: #16150f;          /* near-black, warm */
  --ink-soft: #4b4a42;
  --ink-faint: #7a7970;
  --hairline: #e6e3da;
  --accent: #b4530a;       /* espresso-amber */
  --accent-ink: #ffffff;
  --term-green: #1f7a3d;   /* muted terminal green (hero) */
  --term-bg: #14140f;
  --term-fg: #e9e6da;
}

/* Dark */
:root[data-theme='dark'] {
  --bg: #100f0c;
  --surface: #1a1915;
  --ink: #f2efe6;
  --ink-soft: #b9b6ab;
  --ink-faint: #86837a;
  --hairline: #2c2b25;
  --accent: #e88c3c;
  --accent-ink: #17150f;
  --term-green: #57d98a;
  --term-bg: #000000;
  --term-fg: #e9e6da;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --bg: #100f0c; --surface: #1a1915; --ink: #f2efe6; --ink-soft: #b9b6ab;
    --ink-faint: #86837a; --hairline: #2c2b25; --accent: #e88c3c;
    --accent-ink: #17150f; --term-green: #57d98a; --term-bg: #000000; --term-fg: #e9e6da;
  }
}
```

- [ ] **Step 5: Global CSS** — `src/styles/global.css` (import fonts + base reset + helpers):

```css
@import '@fontsource/inter/400.css';
@import '@fontsource/inter/500.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
body {
  margin: 0; background: var(--bg); color: var(--ink);
  font-family: var(--font-sans); font-size: var(--fs-base); line-height: 1.6;
  -webkit-font-smoothing: antialiased; font-feature-settings: 'liga' 1;
}
h1,h2,h3 { line-height: 1.08; letter-spacing: -0.02em; font-weight: 600; margin: 0 0 var(--sp-4); }
a { color: inherit; text-decoration-color: var(--hairline); text-underline-offset: 3px; }
a:hover { text-decoration-color: var(--accent); }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 3px; }
.container { width: 100%; max-width: 1080px; margin-inline: auto; padding-inline: var(--sp-6); }
.prose { max-width: var(--measure); }
.kicker { font-family: var(--font-mono); font-size: var(--fs-xs); letter-spacing: .12em;
  text-transform: uppercase; color: var(--ink-faint); }
.skip-link { position: absolute; left: -9999px; }
.skip-link:focus { left: var(--sp-4); top: var(--sp-4); z-index: 100; background: var(--surface);
  padding: var(--sp-2) var(--sp-4); border: var(--border); border-radius: var(--radius-sm); }
.btn { display: inline-flex; align-items: center; gap: var(--sp-2); font: 500 var(--fs-sm)/1 var(--font-sans);
  padding: .7rem 1.1rem; border-radius: var(--radius-sm); border: var(--border); background: var(--surface);
  color: var(--ink); cursor: pointer; transition: transform var(--dur) var(--ease), border-color var(--dur); }
.btn:hover { transform: translateY(-1px); border-color: var(--accent); text-decoration: none; }
.btn--primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .btn:hover { transform: none; } }
```

- [ ] **Step 6: Favicon** — `public/favicon.svg` (monospace `>_` glyph):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#14140f"/><text x="6" y="23" font-family="JetBrains Mono, monospace" font-size="18" fill="#57d98a">&gt;_</text></svg>
```

- [ ] **Step 7: Verify build**

Run: `pnpm build`
Expected: build succeeds (even with only the default index page present). Fix any config errors before continuing.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro project, tokens, fonts, config"
```

---

### Task 2: Base layout, header, footer, theme toggle

**Files:**
- Create: `src/layouts/Base.astro`, `src/components/SiteHeader.astro`, `src/components/SiteFooter.astro`, `src/components/ThemeToggle.astro`, `src/components/SectionKicker.astro`

**Interfaces:**
- Produces: `Base.astro` props `{ title?: string; description?: string; ogType?: string }`. Wraps every page: sets `<head>` SEO/OG, imports `global.css`, renders header + `<slot/>` + footer, injects pre-paint theme script.
- Produces: `<SectionKicker>` with a default slot rendering a mono kicker label.

- [ ] **Step 1: Base layout** — `src/layouts/Base.astro`:

```astro
---
import '../styles/global.css';
import SiteHeader from '../components/SiteHeader.astro';
import SiteFooter from '../components/SiteFooter.astro';
import { SITE } from '../config';
const { title, description = SITE.description, ogType = 'website' } = Astro.props;
const pageTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
const canonical = new URL(Astro.url.pathname, SITE.url).href;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <title>{pageTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary_large_image" />
  <script is:inline>
    (() => { try {
      const s = localStorage.getItem('theme');
      const d = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', s || (d ? 'dark' : 'light'));
    } catch (e) {} })();
  </script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main"><slot /></main>
  <SiteFooter />
</body>
</html>
```

- [ ] **Step 2: Theme toggle** — `src/components/ThemeToggle.astro`:

```astro
<button id="theme-toggle" class="theme-toggle" type="button" aria-label="Toggle color theme">
  <span aria-hidden="true" class="tt-dot"></span><span class="tt-label">theme</span>
</button>
<style>
  .theme-toggle { display:inline-flex; align-items:center; gap:var(--sp-2); background:none;
    border:var(--border); border-radius:999px; padding:.35rem .7rem; cursor:pointer;
    font:500 var(--fs-xs)/1 var(--font-mono); color:var(--ink-soft); }
  .tt-dot { width:.6rem; height:.6rem; border-radius:999px; background:var(--accent); }
  .theme-toggle:hover { border-color:var(--accent); }
</style>
<script is:inline>
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const el = document.documentElement;
    const next = el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    el.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
</script>
```

- [ ] **Step 3: Header** — `src/components/SiteHeader.astro` (wordmark `System Prompt` with mono `>_`, nav to Writing / Field Notes / Chats, ThemeToggle). Sticky, hairline bottom border, `.container` inner:

```astro
---
import ThemeToggle from './ThemeToggle.astro';
const nav = [
  { href: '/writing', label: 'Writing' },
  { href: '/field-notes', label: 'Field Notes' },
  { href: '/chats', label: 'Chats' },
];
const path = Astro.url.pathname;
---
<header class="site-header">
  <div class="container hd">
    <a class="wordmark" href="/"><span class="wm-mono">&gt;_</span> System Prompt</a>
    <nav aria-label="Primary">
      {nav.map(i => (
        <a href={i.href} class:list={['nav-link', { active: path.startsWith(i.href) }]}>{i.label}</a>
      ))}
    </nav>
    <ThemeToggle />
  </div>
</header>
<style>
  .site-header { position:sticky; top:0; z-index:50; background:color-mix(in srgb, var(--bg) 85%, transparent);
    backdrop-filter:blur(8px); border-bottom:var(--border); }
  .hd { display:flex; align-items:center; gap:var(--sp-6); height:64px; }
  .wordmark { font-weight:600; letter-spacing:-.01em; text-decoration:none; margin-right:auto; }
  .wm-mono { font-family:var(--font-mono); color:var(--accent); }
  nav { display:flex; gap:var(--sp-6); }
  .nav-link { font-size:var(--fs-sm); color:var(--ink-soft); text-decoration:none; }
  .nav-link.active, .nav-link:hover { color:var(--ink); }
  @media (max-width:640px){ nav{ gap:var(--sp-4); } .hd{ gap:var(--sp-4); } }
</style>
```

- [ ] **Step 4: Footer** — `src/components/SiteFooter.astro`: `.container`, hairline top border, wordmark, one-line description from `SITE.description`, small nav, a mono line `> convened monthly over coffee`, and a note the newsletter block is injected on pages that use it (footer itself just links). Include `© 2026 System Prompt`.

- [ ] **Step 5: Section kicker** — `src/components/SectionKicker.astro`:

```astro
<p class="kicker"><slot /></p>
```

- [ ] **Step 6: Temporary index to verify** — replace `src/pages/index.astro` with a minimal page using `Base` to confirm header/footer/theme render:

```astro
---
import Base from '../layouts/Base.astro';
---
<Base><section class="container" style="padding-block: var(--sp-16)"><h1>System Prompt</h1></section></Base>
```

- [ ] **Step 7: Verify** — `pnpm build`, then `pnpm dev` and load `/`. Confirm: header sticky, theme toggle flips light/dark with no reload flash, footer renders.

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: base layout, header, footer, theme toggle"
```

---

### Task 3: Terminal hero component

**Files:**
- Create: `src/components/Terminal.astro`

**Interfaces:**
- Produces: `<Terminal lines={string[]} />`. Renders a terminal panel; a vanilla island types each line then rotates. Static first line under `prefers-reduced-motion`.

- [ ] **Step 1: Component** — `src/components/Terminal.astro`:

```astro
---
const { lines = [] } = Astro.props;
const data = JSON.stringify(lines);
---
<div class="term" role="img" aria-label={`Terminal prompt: ${lines.join('; ')}`}>
  <div class="term-bar"><span></span><span></span><span></span><em>system-prompt — zsh</em></div>
  <pre class="term-body"><code><span class="ps">$</span> <span class="typed" data-lines={data}>{lines[0]}</span><span class="cursor" aria-hidden="true">▋</span></code></pre>
</div>
<style>
  .term { background:var(--term-bg); border-radius:var(--radius); border:var(--border);
    box-shadow:0 1px 0 rgba(0,0,0,.04); overflow:hidden; max-width:640px; }
  .term-bar { display:flex; align-items:center; gap:6px; padding:.6rem .8rem; border-bottom:1px solid #2a2a22; }
  .term-bar span { width:11px; height:11px; border-radius:999px; background:#3a3a30; }
  .term-bar span:nth-child(1){ background:#e0603a; } .term-bar span:nth-child(2){ background:#e0b23a; }
  .term-bar span:nth-child(3){ background:#3ba55c; }
  .term-bar em { margin-left:auto; font:400 var(--fs-xs)/1 var(--font-mono); color:#77776b; font-style:normal; }
  .term-body { margin:0; padding:var(--sp-6); font:400 var(--fs-lg)/1.5 var(--font-mono); color:var(--term-fg); overflow-x:auto; }
  .ps { color:var(--term-green); }
  .typed { color:var(--term-fg); }
  .cursor { color:var(--term-green); animation:blink 1.05s steps(1) infinite; }
  @keyframes blink { 50% { opacity:0; } }
  @media (prefers-reduced-motion: reduce) { .cursor { animation:none; } }
</style>
<script is:inline>
  (() => {
    const el = document.querySelector('.typed');
    if (!el) return;
    const lines = JSON.parse(el.getAttribute('data-lines') || '[]');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || lines.length < 2) { el.textContent = lines[0] || ''; return; }
    let li = 0, ci = 0, deleting = false;
    const tick = () => {
      const full = lines[li];
      el.textContent = full.slice(0, ci);
      if (!deleting && ci < full.length) { ci++; setTimeout(tick, 45 + Math.random() * 45); }
      else if (!deleting && ci === full.length) { deleting = true; setTimeout(tick, 1600); }
      else if (deleting && ci > 0) { ci--; setTimeout(tick, 22); }
      else { deleting = false; li = (li + 1) % lines.length; setTimeout(tick, 260); }
    };
    setTimeout(tick, 500);
  })();
</script>
```

- [ ] **Step 2: Verify** — temporarily drop `<Terminal lines={["is your SDK an agent darling?", "build vs. buy — who's actually cheaper now?", "how do you become the LLM's default import?"]} />` into index, `pnpm dev`, confirm typing loop + blinking cursor; toggle OS reduced-motion and confirm it renders the first line static.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: terminal typing hero component"
```

---

### Task 4: Home page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/PostCard.astro`, `src/components/FieldNoteCard.astro` (used here + on index pages)

**Interfaces:**
- Consumes: `Terminal`, `SectionKicker`, `NewsletterForm` (Task 8 — home imports it; build the home newsletter block after Task 8, or stub with a link and wire in Task 8). To avoid ordering issues, home is assembled here WITHOUT the newsletter block; Task 8 adds it.
- Produces: `<PostCard post />` and `<FieldNoteCard note />` where `post`/`note` are collection entries (schemas in Task 5). Until Task 5 exists, cards accept a plain object `{ data, slug }`; no type import needed.

- [ ] **Step 1: Cards** — `PostCard.astro` renders title (link to `/writing/{slug}`), `data.description`, mono date + tags. `FieldNoteCard.astro` renders `data.company` (link to `/field-notes/{slug}`), `data.category` kicker, `data.summary`. Both hairline-bordered, hover lifts border to accent.

- [ ] **Step 2: Home** — `src/pages/index.astro` sections in order:
  1. **Hero**: `.container`, left column headline `Your dev tool is being rewritten by whoever's prompting.` + tagline + two buttons (`Join a chat` → `/chats`, `Read the writing` → `/writing`); right column `<Terminal>` with the three lines from Task 3.
  2. **Thesis**: kicker `THE PREMISE`, 3 short paragraphs (real copy): vibecoding collapses the cost of "just build it"; agents, not humans, increasingly choose the tools; the winners get retrieved, cited, and imported by default. Set in `.prose`.
  3. **Featured writing**: kicker `WRITING`, grid of up to 3 `featured` posts (hardcode-fetch in Task 6 once collection exists; for now leave a placeholder comment `<!-- posts injected in Task 6 -->`). Link `All writing →`.
  4. **Featured field notes**: kicker `FIELD NOTES`, grid of up to 3 featured studies (wired in Task 7). Link `All field notes →`.
  5. **Coffee-chat CTA**: kicker `THE CHATS`, one paragraph on the monthly format + `Apply to join` button → `/chats`.

Use generous vertical rhythm (`padding-block: var(--sp-24)` per section, hairline dividers).

- [ ] **Step 3: Verify** — `pnpm build` + `pnpm dev`, confirm home renders hero + terminal + thesis + CTA (featured grids empty until Tasks 6–7).

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: home page (hero, thesis, CTA) + card components"
```

---

### Task 5: Content collections + schemas

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/writing/.gitkeep`, `src/content/field-notes/.gitkeep`

**Interfaces:**
- Produces: two collections. `writing` schema: `title:string, description:string, pubDate:date, tags:string[]=[], draft:boolean=false, featured:boolean=false`. `field-notes` schema: `company:string, category:string, summary:string, theAgentEraMove:string, takeaways:string[], pubDate:date, featured:boolean=false`.

- [ ] **Step 1: Config** — `src/content.config.ts`:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/field-notes' }),
  schema: z.object({
    company: z.string(),
    category: z.string(),
    summary: z.string(),
    theAgentEraMove: z.string(),
    takeaways: z.array(z.string()),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { writing, 'field-notes': fieldNotes };
```

- [ ] **Step 2: Verify** — `pnpm build`. Empty collections are valid. Fix schema/loader errors.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: content collections + zod schemas"
```

---

### Task 6: Writing (blog) — index, post layout, 4 seed posts

**Files:**
- Create: `src/layouts/Post.astro`, `src/pages/writing/index.astro`, `src/pages/writing/[...slug].astro`
- Create: `src/content/writing/hidden-cost-of-vibecoding.mdx`, `build-vs-buy-age-of-vibecoding.mdx`, `positioning-your-sdk-as-an-agent-darling.mdx`, `becoming-the-default-choice.mdx`
- Modify: `src/pages/index.astro` (wire featured posts)

**Interfaces:**
- Consumes: `writing` collection (Task 5), `PostCard` (Task 4), `Base`.
- Produces: `/writing` list (newest first, `draft:false`) and `/writing/{slug}` pages via `Post.astro` (props: entry frontmatter; renders title, mono date, tags, `.prose` body).

- [ ] **Step 1: Post layout** — `src/layouts/Post.astro`: `Base` with `title`/`description` from frontmatter, article header (kicker `WRITING`, `<h1>`, mono `pubDate` + tags), `<article class="prose">` slot, back-link `← All writing`. Style `.prose` (headings, `p`, `ul`, `blockquote`, `pre code` using mono, links underlined with accent hover).

- [ ] **Step 2: Index** — `src/pages/writing/index.astro`:

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import PostCard from '../../components/PostCard.astro';
import SectionKicker from '../../components/SectionKicker.astro';
const posts = (await getCollection('writing', ({ data }) => !data.draft))
  .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
---
<Base title="Writing" description="Opinionated field notes on dev-tool marketing in the agentic era.">
  <section class="container" style="padding-block: var(--sp-16)">
    <SectionKicker>Writing</SectionKicker>
    <h1>Field notes on marketing dev tools in the age of agents.</h1>
    <div class="grid">{posts.map(p => <PostCard post={p} />)}</div>
  </section>
</Base>
<style>.grid{ display:grid; gap:var(--sp-6); grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); margin-top:var(--sp-12);}</style>
```

- [ ] **Step 3: Dynamic route** — `src/pages/writing/[...slug].astro`:

```astro
---
import { getCollection, render } from 'astro:content';
import Post from '../../layouts/Post.astro';
export async function getStaticPaths() {
  const posts = await getCollection('writing', ({ data }) => !data.draft);
  return posts.map(p => ({ params: { slug: p.id }, props: { post: p } }));
}
const { post } = Astro.props;
const { Content } = await render(post);
---
<Post {...post.data}><Content /></Post>
```

- [ ] **Step 4: Seed post 1** — `hidden-cost-of-vibecoding.mdx`:

```mdx
---
title: "The Hidden Cost of Vibecoding"
description: "\"Just prompt it\" feels free. The bill arrives later — in maintenance, trust, and the parts a demo never shows."
pubDate: 2026-07-15
tags: ["vibecoding", "positioning"]
featured: true
---

The pitch is seductive: describe what you want, watch it appear. For a demo,
vibecoding is unbeatable. For a system someone has to run on a Tuesday at 2am,
the invoice comes due later — and it's rarely on the line item you expected.

The first hidden cost is **the second 80%**. Generation gets you a working
surface fast. It does not get you the error handling, the edge cases, the
migration path, or the "why did it do that" you'll spend the next quarter on...
```
(Continue ~500–700 words: sections on maintenance debt, trust/verification cost, and what this means for how dev tools should position — sell the *expensive* 80%, not the demo.)

- [ ] **Step 5: Seed post 2** — `build-vs-buy-age-of-vibecoding.mdx` (`featured: true`, tags `["build-vs-buy","strategy"]`): reframe the classic trade-off now that "build" is cheap to *start* and expensive to *own*; give buyers a new checklist (time-to-trust, maintenance surface, agent-compatibility). ~500–700 words, real draft.

- [ ] **Step 6: Seed post 3** — `positioning-your-sdk-as-an-agent-darling.mdx` (`featured: true`, tags `["agents","positioning","docs"]`): what makes an agent *pick* your tool — legible docs, stable APIs, examples that copy-paste, an MCP server, structured metadata. ~500–700 words.

- [ ] **Step 7: Seed post 4** — `becoming-the-default-choice.mdx` (tags `["distribution","llm","docs"]`): distribution when the reader is a model — getting retrieved, cited, and imported by default; llms.txt, docs as training-adjacent surface, being the canonical answer. ~500–700 words.

- [ ] **Step 8: Wire featured posts into home** — in `src/pages/index.astro`, fetch `getCollection('writing', d => d.data.featured && !d.data.draft)`, sort by date, take 3, render `<PostCard>` in the Featured writing grid.

- [ ] **Step 9: Verify** — `pnpm build` + `pnpm dev`: `/writing` lists 4 posts newest-first, each post page renders prose, home shows 3 featured.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: writing collection, post layout, 4 seed posts"
```

---

### Task 7: Field Notes (case studies) — index, layout, 5 seed studies

**Files:**
- Create: `src/layouts/FieldNote.astro`, `src/pages/field-notes/index.astro`, `src/pages/field-notes/[...slug].astro`
- Create: `src/content/field-notes/supabase.mdx`, `algolia.mdx`, `mapbox.mdx`, `formspree.mdx`, `clerk.mdx`
- Modify: `src/pages/index.astro` (wire featured field notes)

**Interfaces:**
- Consumes: `field-notes` collection, `FieldNoteCard`, `Base`.
- Produces: `/field-notes` list + `/field-notes/{slug}` via `FieldNote.astro` (renders company, category kicker, summary, a "The agent-era move" callout from `theAgentEraMove`, a takeaways list, then MDX body).

- [ ] **Step 1: Layout** — `FieldNote.astro`: header (kicker = `data.category`, `<h1>{company}</h1>`, `summary` as lede), a bordered callout block titled `The agent-era move` rendering `theAgentEraMove`, a `Takeaways` `<ul>` from `takeaways[]`, then `<article class="prose"><slot/></article>`, back-link `← All field notes`.

- [ ] **Step 2: Index** — mirror Task 6 Step 2 with `getCollection('field-notes')`, sort by `pubDate` desc, render `<FieldNoteCard>` grid. Intro copy: "How the tools that get picked are positioning for a world where the buyer is a model."

- [ ] **Step 3: Dynamic route** — mirror Task 6 Step 3 for `field-notes`, passing `note` prop into `FieldNote`.

- [ ] **Step 4: Seed studies** — each MDX file, real short commentary (~250–400 words body) clearly framed as outside analysis (not endorsed by the company). Frontmatter pattern:

```mdx
---
company: "Supabase"
category: "Backend / Postgres"
summary: "Turning \"the open-source Firebase\" into the default backend an AI app scaffolds against."
theAgentEraMove: "Docs, examples, and an MCP server that make Supabase the path of least resistance when an agent wires up auth + a database."
takeaways:
  - "Ship an MCP server so agents can act, not just read."
  - "Make the copy-paste path the correct path — examples are distribution."
  - "Own a category noun ('the Postgres backend') the model can retrieve."
pubDate: 2026-07-20
featured: true
---

Supabase's real growth engine isn't a campaign — it's *legibility*...
```
  - `supabase.mdx` (`featured: true`) — as above.
  - `algolia.mdx` (`featured: true`), category "Search / Discovery": move = making search results agent-consumable + strong docs/DevRel; takeaways on structured APIs and being the retrieval layer.
  - `mapbox.mdx` (`featured: true`), category "Maps / Geospatial": move = SDKs + docs so any generated app reaches for Mapbox for maps; takeaways on platform breadth + example gravity.
  - `formspree.mdx`, category "Forms / Backend-less": move = zero-backend primitive that's trivial for a generated frontend (or an agent) to wire up; takeaways on being the smallest correct dependency.
  - `clerk.mdx`, category "Auth / Identity": move = drop-in auth with pristine docs + components agents can scaffold; takeaways on DX-as-marketing and being the default auth import.

- [ ] **Step 5: Wire featured into home** — fetch `featured` field notes, take 3, render in the Featured field notes grid.

- [ ] **Step 6: Verify** — `pnpm build` + `pnpm dev`: `/field-notes` lists 5, each study renders callout + takeaways + body, home shows 3 featured.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: field-notes collection, layout, 5 seed studies"
```

---

### Task 8: Newsletter component + wire into home & footer

**Files:**
- Create: `src/components/NewsletterForm.astro`
- Modify: `src/pages/index.astro`, `src/components/SiteFooter.astro`

**Interfaces:**
- Consumes: `FORMSPREE.newsletter` from `src/config.ts`.
- Produces: `<NewsletterForm variant?="block"|"inline" />`. Posts email to Formspree via `fetch`; inline success/error message; native POST fallback if JS off.

- [ ] **Step 1: Component** — `src/components/NewsletterForm.astro`:

```astro
---
import { FORMSPREE } from '../config';
const { variant = 'block' } = Astro.props;
---
<form class:list={['nl', variant]} action={FORMSPREE.newsletter} method="POST" data-nl>
  <label class="kicker" for="nl-email">Get the field notes in your inbox</label>
  <div class="row">
    <input id="nl-email" name="email" type="email" required placeholder="you@company.dev" autocomplete="email" />
    <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px" />
    <button class="btn btn--primary" type="submit">Subscribe</button>
  </div>
  <p class="nl-msg" role="status" aria-live="polite" hidden></p>
  <p class="nl-fine">No spam. One monthly note. Delivered via Formspree.</p>
</form>
<style>
  .nl { border:var(--border); border-radius:var(--radius); padding:var(--sp-8); background:var(--surface); }
  .nl .row { display:flex; gap:var(--sp-3); margin-top:var(--sp-3); }
  .nl input[type=email]{ flex:1; padding:.7rem .9rem; border:var(--border); border-radius:var(--radius-sm);
    background:var(--bg); color:var(--ink); font:400 var(--fs-base)/1 var(--font-sans); }
  .nl-fine{ margin:var(--sp-3) 0 0; font-size:var(--fs-xs); color:var(--ink-faint); }
  .nl-msg{ margin:var(--sp-3) 0 0; font-size:var(--fs-sm); }
  .nl-msg.ok{ color:var(--term-green); } .nl-msg.err{ color:#c0402a; }
  .nl.inline{ border:none; padding:0; background:none; }
  @media (max-width:560px){ .nl .row{ flex-direction:column; } }
</style>
<script is:inline>
  document.querySelectorAll('form[data-nl]').forEach((f) => {
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = f.querySelector('.nl-msg');
      const show = (t, ok) => { msg.hidden = false; msg.textContent = t; msg.className = 'nl-msg ' + (ok ? 'ok' : 'err'); };
      try {
        const r = await fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        if (r.ok) { f.reset(); show('You're in. Talk soon.', true); }
        else show('Something went wrong — try again.', false);
      } catch { show('Network error — try again.', false); }
    });
  });
</script>
```

- [ ] **Step 2: Wire into home** — add a full-width `NewsletterForm variant="block"` section (kicker `NEWSLETTER`) before the footer in `index.astro`.

- [ ] **Step 3: Wire into footer** — add `NewsletterForm variant="inline"` into `SiteFooter.astro` top row.

- [ ] **Step 4: Verify** — `pnpm build` + `pnpm dev`: form renders on home + footer; submitting with the placeholder endpoint shows the error branch gracefully (expected until real ID); honeypot present; keyboard-navigable.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: newsletter form (Formspree) on home + footer"
```

---

### Task 9: Chats page + apply form

**Files:**
- Create: `src/pages/chats.astro`, `src/components/ApplyForm.astro`

**Interfaces:**
- Consumes: `FORMSPREE.apply`.
- Produces: `<ApplyForm />` posting `name, email, company, role, wrestling` to Formspree, same submit UX as newsletter.

- [ ] **Step 1: Apply form** — `src/components/ApplyForm.astro`: fields — `name` (text, required), `email` (email, required), `company` (text, required), `role` (text), `wrestling` (textarea, label "What are you wrestling with right now?"), honeypot `_gotcha`, submit "Apply to join". Reuse `.nl` styles pattern (or local styles) + the same `data-nl` fetch script (rename to `data-form` and generalize, or duplicate the inline script). Success message: "Got it — we'll be in touch before the next chat."

- [ ] **Step 2: Chats page** — `src/pages/chats.astro` using `Base` (title "Coffee Chats"):
  1. Kicker `THE CHATS` + `<h1>` "A monthly coffee chat for people marketing dev tools."
  2. `.prose`: what it is (small, off-record, ~8–10 marketing/growth leaders from dev-tool & SDK companies), the format (60–75 min, one theme, no slides), who it's for, and the one rule (Chatham House). Real copy.
  3. A 3-item mono list of example themes (agent-era positioning, build-vs-buy, distribution to models).
  4. `<ApplyForm />` in a bordered section with kicker `APPLY`.

- [ ] **Step 3: Verify** — `pnpm build` + `pnpm dev`: `/chats` renders copy + apply form; validation on required fields; submit hits error branch gracefully with placeholder ID.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: chats page + apply-to-join form"
```

---

### Task 10: 404, SEO polish, final verification

**Files:**
- Create: `src/pages/404.astro`
- Modify: `README.md` (create), any final token/spacing touch-ups

**Interfaces:**
- Consumes: everything. Produces: production build + a README documenting setup, Formspree swap, content authoring, and deploy.

- [ ] **Step 1: 404** — `src/pages/404.astro` using `Base`: a terminal-styled `> command not found: {path}` with links home / to writing. Keep on-brand, minimal.

- [ ] **Step 2: README** — `README.md`: what it is, `pnpm install && pnpm dev`, where content lives (`src/content/writing`, `src/content/field-notes`) + frontmatter reference, how to swap Formspree IDs in `src/config.ts`, `pnpm build` → `dist/`, deploy note (Vercel/Netlify/Cloudflare Pages static; point DNS for `systemprompt.chat`).

- [ ] **Step 3: SEO/robots** — add `public/robots.txt` allowing all + `Sitemap: https://systemprompt.chat/sitemap-index.xml`. Confirm `@astrojs/sitemap` emits sitemap on build.

- [ ] **Step 4: Full verification** — `pnpm build` (zero errors). Run `pnpm dev` and load `/`, `/writing`, one post, `/field-notes`, one study, `/chats`, a bogus URL (404). Confirm: hero typing + reduced-motion fallback, theme toggle no-flash in both directions, all collections render, both forms validate, no console errors. Capture screenshots of home (light+dark), a post, and `/chats`.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: 404, robots, README, final polish"
```

---

## Self-Review

**Spec coverage:** hero (T3/T4) · thesis (T4) · blog heavy (T5/T6) · case studies incl. Supabase/Algolia/Mapbox/Formspree/Clerk (T5/T7) · newsletter Formspree (T8) · apply form Formspree (T9) · clean dev aesthetic + tokens + fonts (T1/T2) · light/dark no-flash (T2) · reduced-motion (T3) · a11y (T2) · canonical systemprompt.chat + SEO/sitemap (T2/T10) · independent brand, no IMG.LY badge (all copy). All spec sections mapped.

**Placeholder scan:** Formspree IDs are intentional, clearly-marked config placeholders (spec Open Item), not plan gaps. Seed-post/study bodies specify topic, length, frontmatter, and opening lines — prose is authored during execution by design. No stray TODO/TBD in infrastructure code.

**Type consistency:** `SITE`/`FORMSPREE` shapes consistent across T1/T2/T8/T9. Collection names `writing` and `field-notes` and their field names consistent across T5/T6/T7. Card props (`post`, `note`) consistent T4/T6/T7. Terminal `lines` prop consistent T3/T4.
