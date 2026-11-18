export const SITE = {
  name: 'AX Factor',
  tagline: 'Agentic marketing for dev tools.',
  // AX = agent experience: how well an AI agent can find, pick and build with a dev tool.
  axExpansion: 'AX = agent experience',
  url: 'https://axfactor.dev',
  description:
    'AX means agent experience: how well an AI agent can find, pick and build with a dev tool. AX Factor is a blog and monthly coffee chat on agentic marketing for dev-tool and SDK companies.',
  author: 'AX Factor',
} as const;

// TODO(owner): replace with real Formspree form IDs from formspree.io.
// Create two forms in your Formspree account and paste their endpoints here.
export const FORMSPREE = {
  newsletter: 'https://formspree.io/f/REPLACE_NEWSLETTER_ID',
  apply: 'https://formspree.io/f/REPLACE_APPLY_ID',
  audit: 'https://formspree.io/f/REPLACE_AUDIT_ID',
} as const;
