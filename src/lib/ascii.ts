// Eagerly load every ASCII art file as raw text, keyed by slug.
const files = import.meta.glob('../ascii/*.txt', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** Return the ASCII art for a post slug, or undefined if none exists. */
export function getAscii(slug: string): string | undefined {
  const match = Object.keys(files).find((path) => path.endsWith(`/${slug}.txt`));
  return match ? files[match] : undefined;
}
