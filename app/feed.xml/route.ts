import { getAllPostSummaries } from "@/lib/blog";
import { appBaseUrl } from "@/lib/env/cloud-ready";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const base = appBaseUrl();
  const posts = getAllPostSummaries();
  const channelTitle = "Athlete Compass — Blog";
  const channelDesc =
    "Âge athlétique, rameur, entraînement hybride : articles et repères de performance.";
  const channelLink = `${base}/blog`;
  const lastBuild =
    posts.length > 0
      ? new Date(Math.max(...posts.map((p) => new Date(p.updated ?? p.date).getTime()))).toUTCString()
      : new Date().toUTCString();

  const itemsXml = posts
    .map((p) => {
      const link = `${base}/blog/${p.slug}`;
      const pub = new Date(p.updated ?? p.date).toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>fr-FR</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(`${base}/feed.xml`)}" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
