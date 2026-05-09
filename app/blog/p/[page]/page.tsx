import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/blog/blog-listing";
import { getAllPostSummaries, getBlogCategories } from "@/lib/blog";
import { getBlogListTotalPages, getPostsForBlogListPage } from "@/lib/blog-paginate";
import { defaultBlogOgImageUrl } from "@/lib/blog-og";
import { appBaseUrl } from "@/lib/env/cloud-ready";

type Props = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const total = getBlogListTotalPages(getAllPostSummaries().length);
  if (total <= 1) return [];
  return Array.from({ length: total - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: raw } = await params;
  const n = parseInt(raw, 10);
  const all = getAllPostSummaries();
  const totalPages = getBlogListTotalPages(all.length);
  if (!Number.isFinite(n) || n < 2 || n > totalPages) {
    return { title: "Blog — page introuvable" };
  }

  const base = appBaseUrl();
  const url = `${base}/blog/p/${n}`;
  const title = `Blog — page ${n} — Athlete Compass`;
  const description = `Articles Athlete Compass (page ${n} sur ${totalPages}).`;
  const og = defaultBlogOgImageUrl(base);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "fr_FR",
      images: [{ url: og }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [og],
    },
  };
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page: raw } = await params;
  const n = parseInt(raw, 10);
  const all = getAllPostSummaries();
  const totalPages = getBlogListTotalPages(all.length);

  if (!Number.isFinite(n) || n < 2 || n > totalPages) notFound();

  const categories = getBlogCategories();
  const posts = getPostsForBlogListPage(n, all);

  return <BlogListing currentPage={n} totalPages={totalPages} posts={posts} categories={categories} />;
}
