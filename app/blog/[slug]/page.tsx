import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { ArticleFaq } from "@/components/blog/article-faq";
import { ArticlePostNav } from "@/components/blog/article-post-nav";
import { BlogBreadcrumbs, buildBreadcrumbListJsonLd } from "@/components/blog/blog-breadcrumbs";
import { BlogCta } from "@/components/blog/blog-cta";
import { RelatedArticles } from "@/components/blog/related-articles";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { blogMdxComponents } from "@/components/blog/mdx-components";
import { extractMarkdownToc } from "@/lib/blog-toc";
import { getAllPostSummaries, getAdjacentPostSummaries, getPostBySlug, getRelatedPostSummaries, categoryToSlug } from "@/lib/blog";
import { resolveBlogOgImageUrl } from "@/lib/blog-og";
import { appBaseUrl } from "@/lib/env/cloud-ready";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPostSummaries().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };

  const base = appBaseUrl();
  const url = `${base}/blog/${slug}`;
  const ogImage = resolveBlogOgImageUrl(base, post.meta.ogImage);
  return {
    title: `${post.meta.title} — Athlete Compass`,
    description: post.meta.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.meta.title,
      description: post.meta.description,
      type: "article",
      publishedTime: post.meta.date,
      modifiedTime: post.meta.updated ?? post.meta.date,
      url,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta.title,
      description: post.meta.description,
      images: [ogImage],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const base = appBaseUrl();
  const related = getRelatedPostSummaries(slug, post.meta.category, 3);
  const { newer, older } = getAdjacentPostSummaries(slug);
  const toc = extractMarkdownToc(post.content);

  const breadcrumbCrumbs = [
    { name: "Accueil", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(post.meta.category
      ? ([{ name: post.meta.category, path: `/blog/categories/${categoryToSlug(post.meta.category)}` }] as const)
      : []),
    { name: post.meta.title, path: `/blog/${slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbListJsonLd(base, breadcrumbCrumbs);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.meta.title,
    description: post.meta.description,
    datePublished: post.meta.date,
    dateModified: post.meta.updated ?? post.meta.date,
    author: { "@type": "Organization", name: "Athlete Compass" },
    publisher: { "@type": "Organization", name: "Athlete Compass" },
    image: [resolveBlogOgImageUrl(base, post.meta.ogImage)],
    mainEntityOfPage: { "@type": "WebPage", "@id": `${base}/blog/${slug}` },
  };

  const crumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(post.meta.category
      ? [
          {
            label: post.meta.category,
            href: `/blog/categories/${categoryToSlug(post.meta.category)}`,
          },
        ]
      : []),
    { label: post.meta.title },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BlogBreadcrumbs items={crumbItems} jsonLd={breadcrumbJsonLd} />
      <article>
        <header className="mb-10">
          {post.meta.category ? (
            <p className="text-xs font-medium uppercase tracking-widest text-neon">
              <Link
                href={`/blog/categories/${categoryToSlug(post.meta.category)}`}
                className="hover:underline"
              >
                {post.meta.category}
              </Link>
            </p>
          ) : null}
          <h1 className="text-display mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {post.meta.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">{post.meta.description}</p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
            <time dateTime={post.meta.date}>
              Publié le{" "}
              {new Date(post.meta.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.meta.updated ? (
              <span>
                · Mis à jour le{" "}
                {new Date(post.meta.updated).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            ) : null}
            <span>· {post.readingMinutes} min de lecture</span>
          </div>
        </header>

        <TableOfContents items={toc} />

        <div className="blog-mdx">
          <MDXRemote
            source={post.content}
            components={blogMdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        {post.meta.faq?.length ? <ArticleFaq faq={post.meta.faq} /> : null}

        <RelatedArticles posts={related} />
        <ArticlePostNav older={older} newer={newer} />
        <BlogCta />
      </article>
    </>
  );
}
