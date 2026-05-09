/** Image Open Graph / Twitter par défaut pour le blog (asset public). */
export function defaultBlogOgImageUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/hero-design.png`;
}

/**
 * Image OG/Twitter pour un article : `ogImage` en frontmatter (URL absolue ou chemin `/...`),
 * sinon image blog par défaut.
 */
export function resolveBlogOgImageUrl(baseUrl: string, ogImage?: string): string {
  if (!ogImage?.trim()) return defaultBlogOgImageUrl(baseUrl);
  const base = baseUrl.replace(/\/$/, "");
  const t = ogImage.trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  if (t.startsWith("/")) return `${base}${t}`;
  return `${base}/${t}`;
}

