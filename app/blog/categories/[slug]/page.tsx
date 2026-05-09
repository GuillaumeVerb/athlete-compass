import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogBreadcrumbs, buildBreadcrumbListJsonLd } from "@/components/blog/blog-breadcrumbs";
import { getBlogCategories, getPostsByCategorySlug } from "@/lib/blog";
import { defaultBlogOgImageUrl } from "@/lib/blog-og";
import { appBaseUrl } from "@/lib/env/cloud-ready";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getBlogCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getBlogCategories().find((c) => c.slug === slug);
  if (!cat) return { title: "Catégorie introuvable" };

  const base = appBaseUrl();
  const url = `${base}/blog/categories/${slug}`;
  const desc = `Articles sur ${cat.label.toLowerCase()} : diagnostic hybride, repères de performance et progression.`;
  const ogImage = defaultBlogOgImageUrl(base);
  return {
    title: `${cat.label} — Blog Athlete Compass`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.label} — Blog`,
      description: desc,
      url,
      type: "website",
      locale: "fr_FR",
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cat.label} — Blog Athlete Compass`,
      description: desc,
      images: [ogImage],
    },
  };
}

export default async function BlogCategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = getBlogCategories().find((c) => c.slug === slug);
  if (!cat) notFound();

  const posts = getPostsByCategorySlug(slug);
  const base = appBaseUrl();
  const jsonLd = buildBreadcrumbListJsonLd(base, [
    { name: "Accueil", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: cat.label, path: `/blog/categories/${slug}` },
  ]);

  return (
    <>
      <BlogBreadcrumbs
        jsonLd={jsonLd}
        items={[
          { label: "Accueil", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: cat.label },
        ]}
      />
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-neon">Catégorie</p>
        <h1 className="text-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{cat.label}</h1>
        <p className="mt-3 text-sm text-muted">
          {cat.count} article{cat.count > 1 ? "s" : ""} — même thème, angles complémentaires.
        </p>
      </header>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-border bg-surface/60 p-5 transition hover:border-neon/35 hover:bg-surface-elevated/80"
            >
              <h2 className="text-display text-lg font-semibold text-foreground group-hover:text-neon">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{post.description}</p>
              <div className="mt-3 text-[11px] text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden> · </span>
                <span>{post.readingMinutes} min de lecture</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
