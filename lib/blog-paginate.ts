import { getAllPostSummaries, type BlogPostSummary } from "@/lib/blog";

/** Nombre d’articles par page sur l’index blog (et /blog/page/n). */
export const BLOG_PAGE_SIZE = 8;

export function getBlogListTotalPages(postCount: number): number {
  return Math.max(1, Math.ceil(postCount / BLOG_PAGE_SIZE));
}

export function getPostsForBlogListPage(page: number, all?: BlogPostSummary[]): BlogPostSummary[] {
  const list = all ?? getAllPostSummaries();
  const safe = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  const start = (safe - 1) * BLOG_PAGE_SIZE;
  return list.slice(start, start + BLOG_PAGE_SIZE);
}
