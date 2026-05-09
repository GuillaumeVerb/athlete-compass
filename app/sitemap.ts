import type { MetadataRoute } from "next";
import { appBaseUrl } from "@/lib/env/cloud-ready";
import { getAllPostSummaries, getBlogCategories } from "@/lib/blog";
import { getBlogListTotalPages } from "@/lib/blog-paginate";

/** URLs `/blog/p/2` … pour le sitemap (page 1 = `/blog`). */
function getBlogPaginationSitemapPaths(): string[] {
  const total = getBlogListTotalPages(getAllPostSummaries().length);
  if (total <= 1) return [];
  return Array.from({ length: total - 1 }, (_, i) => `/blog/p/${i + 2}`);
}

/** Pages marketing / app utiles au référencement (hors routes dynamiques auth). */
const STATIC_PATHS = [
  "/",
  "/blog",
  "/feed.xml",
  "/profile",
  "/performances",
  "/results",
  "/daily",
  "/body-progress",
  "/bilans",
  "/plan",
  "/report",
  "/tests",
  "/equivalences",
  "/pricing",
  "/next-test",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appBaseUrl();
  const lastMod = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: lastMod,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/blog" ? 0.9 : 0.7,
  }));

  const posts = getAllPostSummaries();
  const categoryUrls = getBlogCategories().map((c) => ({
    url: `${base}/blog/categories/${c.slug}`,
    lastModified: lastMod,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const paginationUrls = getBlogPaginationSitemapPaths().map((path) => ({
    url: `${base}${path}`,
    lastModified: lastMod,
    changeFrequency: "monthly" as const,
    priority: 0.55,
  }));

  return [...staticEntries, ...blogEntries, ...categoryUrls, ...paginationUrls];
}
