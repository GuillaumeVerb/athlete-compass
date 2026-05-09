import GithubSlugger from "github-slugger";

export type BlogTocItem = {
  level: 2 | 3;
  text: string;
  id: string;
};

function stripInlineMd(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

/**
 * Titres ## / ### du corps MDX, dans l’ordre, avec ids alignés sur `rehype-slug` (github-slugger).
 */
export function extractMarkdownToc(source: string): BlogTocItem[] {
  const slugger = new GithubSlugger();
  const toc: BlogTocItem[] = [];
  for (const line of source.split("\n")) {
    const t = line.trim();
    const h2 = /^## (.+)$/.exec(t);
    const h3 = /^### (.+)$/.exec(t);
    if (h2) {
      const raw = h2[1].trim();
      const text = stripInlineMd(raw);
      if (!text) continue;
      const id = slugger.slug(text);
      toc.push({ level: 2, text, id });
    } else if (h3) {
      const raw = h3[1].trim();
      const text = stripInlineMd(raw);
      if (!text) continue;
      const id = slugger.slug(text);
      toc.push({ level: 3, text, id });
    }
  }
  return toc;
}
