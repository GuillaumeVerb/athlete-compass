import Link from "next/link";
import { BlogBreadcrumbs, buildBreadcrumbListJsonLd } from "@/components/blog/blog-breadcrumbs";
import { BlogListPagination } from "@/components/blog/blog-list-pagination";
import type { BlogCategoryNav, BlogPostSummary } from "@/lib/blog";
import { appBaseUrl } from "@/lib/env/cloud-ready";

type Props = {
  currentPage: number;
  totalPages: number;
  posts: BlogPostSummary[];
  categories: BlogCategoryNav[];
};

export function BlogListing({ currentPage, totalPages, posts, categories }: Props) {
  const base = appBaseUrl();
  const breadcrumbJsonLd = buildBreadcrumbListJsonLd(base, [
    { name: "Accueil", path: "/" },
    { name: "Blog", path: "/blog" },
    ...(currentPage > 1 ? [{ name: `Page ${currentPage}`, path: `/blog/p/${currentPage}` }] : []),
  ]);

  const crumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Blog", href: "/blog" },
    ...(currentPage > 1 ? [{ label: `Page ${currentPage}` }] : []),
  ];

  return (
    <>
      <BlogBreadcrumbs items={crumbItems} jsonLd={breadcrumbJsonLd} />
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-neon">Performance lab</p>
        <h1 className="text-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Blog</h1>
        {currentPage > 1 ? (
          <p className="mt-2 text-sm text-muted">
            Page {currentPage} sur {totalPages}
          </p>
        ) : null}
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Articles orientés diagnostic et progression : standards indicatifs, machines, stagnation, âge athlétique.
        </p>
        {categories.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/blog/categories/${c.slug}`}
                className="rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs text-muted transition hover:border-neon/35 hover:text-foreground"
              >
                {c.label}
                <span className="ml-1 text-[10px] opacity-70">({c.count})</span>
              </Link>
            ))}
          </div>
        ) : null}
      </header>

      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-border bg-surface/60 p-5 transition hover:border-neon/35 hover:bg-surface-elevated/80"
            >
              {post.category ? (
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted">{post.category}</span>
              ) : null}
              <h2 className="text-display mt-1 text-lg font-semibold text-foreground group-hover:text-neon">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-muted">{post.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} min de lecture</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <BlogListPagination currentPage={currentPage} totalPages={totalPages} />
    </>
  );
}
