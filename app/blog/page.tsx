import type { Metadata } from "next";
import { BlogListing } from "@/components/blog/blog-listing";
import { getAllPostSummaries, getBlogCategories } from "@/lib/blog";
import { getBlogListTotalPages, getPostsForBlogListPage } from "@/lib/blog-paginate";
import { defaultBlogOgImageUrl } from "@/lib/blog-og";
import { appBaseUrl } from "@/lib/env/cloud-ready";

const blogBase = appBaseUrl();

export const metadata: Metadata = {
  title: "Blog — Athlete Compass",
  description:
    "Guides et analyses sur l'âge athlétique, le rameur, l'entraînement hybride et la progression sans promesse miracle.",
  alternates: { canonical: `${blogBase}/blog` },
  openGraph: {
    title: "Blog — Athlete Compass",
    description:
      "Guides et analyses sur l'âge athlétique, le rameur, l'entraînement hybride et la progression sans promesse miracle.",
    url: `${blogBase}/blog`,
    type: "website",
    locale: "fr_FR",
    images: [{ url: defaultBlogOgImageUrl(blogBase) }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Athlete Compass",
    description:
      "Guides et analyses sur l'âge athlétique, le rameur, l'entraînement hybride et la progression sans promesse miracle.",
    images: [defaultBlogOgImageUrl(blogBase)],
  },
};

export default function BlogIndexPage() {
  const all = getAllPostSummaries();
  const categories = getBlogCategories();
  const totalPages = getBlogListTotalPages(all.length);
  const posts = getPostsForBlogListPage(1, all);

  return <BlogListing currentPage={1} totalPages={totalPages} posts={posts} categories={categories} />;
}
