import Link from "next/link";
import type { BlogPostSummary } from "@/lib/blog";

type Props = {
  posts: BlogPostSummary[];
};

export function RelatedArticles({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-display text-lg font-semibold text-foreground">
        À lire aussi
      </h2>
      <ul className="mt-4 space-y-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="text-sm text-foreground/90 underline-offset-2 hover:text-neon hover:underline"
            >
              {p.title}
            </Link>
            {p.category ? (
              <span className="mt-0.5 block text-[11px] text-muted">{p.category}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
