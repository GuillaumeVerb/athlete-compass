import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
};

export function BlogListPagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const prevHref = currentPage <= 2 ? "/blog" : `/blog/p/${currentPage - 1}`;
  const nextHref = `/blog/p/${currentPage + 1}`;

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8"
      aria-label="Pagination du blog"
    >
      {currentPage > 1 ? (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm text-muted transition hover:border-neon/35 hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Précédent
        </Link>
      ) : (
        <span />
      )}
      <span className="text-xs text-muted">
        Page {currentPage} / {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={nextHref}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-4 py-2 text-sm text-muted transition hover:border-neon/35 hover:text-foreground"
        >
          Suivant
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
