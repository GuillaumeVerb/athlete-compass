import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { BlogPostSummary } from "@/lib/blog";

type Props = {
  older: BlogPostSummary | null;
  newer: BlogPostSummary | null;
};

export function ArticlePostNav({ older, newer }: Props) {
  if (!older && !newer) return null;

  const onlyOlder = Boolean(older && !newer);
  const onlyNewer = Boolean(newer && !older);

  return (
    <nav
      className="mt-12 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
      aria-label="Articles précédent et suivant"
    >
      <div className={`min-w-0 ${onlyOlder ? "sm:col-span-2" : ""}`}>
        {older ? (
          <Link
            href={`/blog/${older.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-border bg-surface/50 p-4 transition hover:border-neon/30 hover:bg-surface-elevated/60"
          >
            <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted">
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
              Plus ancien
            </span>
            <span className="mt-2 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-neon">
              {older.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
      <div className={`min-w-0 sm:text-right ${onlyNewer ? "sm:col-span-2" : ""}`}>
        {newer ? (
          <Link
            href={`/blog/${newer.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-border bg-surface/50 p-4 text-left transition hover:border-neon/30 hover:bg-surface-elevated/60 sm:items-end sm:text-right"
          >
            <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted sm:flex-row-reverse">
              Plus récent
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="mt-2 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-neon sm:text-right">
              {newer.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
