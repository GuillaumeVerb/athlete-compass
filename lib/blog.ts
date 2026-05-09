import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogFrontmatter = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  category?: string;
  tags?: string[];
  primaryKeyword?: string;
  /** Image Open Graph (URL absolue ou chemin `/...` sous `public/`). */
  ogImage?: string;
  faq?: BlogFaqItem[];
};

export type BlogPostSummary = BlogFrontmatter & {
  slug: string;
  readingMinutes: number;
};

function readingMinutesFromBody(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function parseFaq(data: Record<string, unknown>): BlogFaqItem[] | undefined {
  const raw = data.faq;
  if (!raw) return undefined;
  if (!Array.isArray(raw)) return undefined;
  const items: BlogFaqItem[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    if (typeof o.question !== "string" || typeof o.answer !== "string") continue;
    const question = o.question.trim();
    const answer = o.answer.trim();
    if (!question || !answer) continue;
    items.push({ question, answer });
  }
  return items.length > 0 ? items : undefined;
}

function assertMeta(data: Record<string, unknown>, slug: string): BlogFrontmatter {
  const title = data.title;
  const description = data.description;
  const date = data.date;
  if (typeof title !== "string" || !title.trim()) {
    throw new Error(`Blog ${slug}: frontmatter "title" manquant ou invalide`);
  }
  if (typeof description !== "string" || !description.trim()) {
    throw new Error(`Blog ${slug}: frontmatter "description" manquant ou invalide`);
  }
  if (typeof date !== "string" || !date.trim()) {
    throw new Error(`Blog ${slug}: frontmatter "date" manquant ou invalide`);
  }
  return {
    title,
    description,
    date,
    updated: typeof data.updated === "string" ? data.updated : undefined,
    category: typeof data.category === "string" ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === "string") : undefined,
    primaryKeyword:
      typeof data.primaryKeyword === "string" ? data.primaryKeyword : undefined,
    ogImage: typeof data.ogImage === "string" && data.ogImage.trim() ? data.ogImage.trim() : undefined,
    faq: parseFaq(data),
  };
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getAllPostSummaries(): BlogPostSummary[] {
  const slugs = getPostSlugs();
  const posts = slugs.map((slug) => {
    const full = path.join(POSTS_DIR, `${slug}.mdx`);
    const raw = fs.readFileSync(full, "utf8");
    const { content, data } = matter(raw);
    const meta = assertMeta(data as Record<string, unknown>, slug);
    return {
      slug,
      ...meta,
      readingMinutes: readingMinutesFromBody(content),
    };
  });
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): {
  slug: string;
  meta: BlogFrontmatter;
  content: string;
  readingMinutes: number;
} | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return null;
  const full = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(full)) return null;
  const raw = fs.readFileSync(full, "utf8");
  const { content, data } = matter(raw);
  const meta = assertMeta(data as Record<string, unknown>, slug);
  return {
    slug,
    meta,
    content,
    readingMinutes: readingMinutesFromBody(content),
  };
}

/** Slug d’URL stable pour une catégorie (libellé affiché conservé sur le premier article vu). */
export function categoryToSlug(category: string): string {
  return category
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export type BlogCategoryNav = { slug: string; label: string; count: number };

export function getBlogCategories(): BlogCategoryNav[] {
  const posts = getAllPostSummaries();
  const map = new Map<string, { label: string; count: number }>();
  for (const p of posts) {
    const raw = p.category?.trim();
    if (!raw) continue;
    const slug = categoryToSlug(raw);
    const cur = map.get(slug);
    if (cur) cur.count += 1;
    else map.set(slug, { label: raw, count: 1 });
  }
  return [...map.entries()]
    .map(([slug, { label, count }]) => ({ slug, label, count }))
    .sort((a, b) => a.label.localeCompare(b.label, "fr"));
}

export function getPostsByCategorySlug(categorySlug: string): BlogPostSummary[] {
  return getAllPostSummaries().filter(
    (p) => p.category && categoryToSlug(p.category) === categorySlug,
  );
}

/** Même catégorie en priorité, puis articles récents. */
export function getRelatedPostSummaries(
  currentSlug: string,
  category: string | undefined,
  limit = 3,
): BlogPostSummary[] {
  const all = getAllPostSummaries().filter((p) => p.slug !== currentSlug);
  const catSlug = category?.trim() ? categoryToSlug(category) : "";
  const same = catSlug ? all.filter((p) => p.category && categoryToSlug(p.category) === catSlug) : [];
  const sameSlugs = new Set(same.map((p) => p.slug));
  const rest = all.filter((p) => !sameSlugs.has(p.slug));
  return [...same, ...rest].slice(0, limit);
}

/** Liste triée du plus récent au plus ancien : `newer` = publié après, `older` = publié avant. */
export function getAdjacentPostSummaries(slug: string): {
  newer: BlogPostSummary | null;
  older: BlogPostSummary | null;
} {
  const posts = getAllPostSummaries();
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return {
    newer: i > 0 ? posts[i - 1]! : null,
    older: i < posts.length - 1 ? posts[i + 1]! : null,
  };
}
