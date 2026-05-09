import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BlogCrumb = { label: string; href?: string };

type Props = {
  items: BlogCrumb[];
  /** Schema.org BreadcrumbList (optionnel). */
  jsonLd?: Record<string, unknown>;
};

export function BlogBreadcrumbs({ items, jsonLd }: Props) {
  return (
    <>
      {jsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      ) : null}
      <nav aria-label="Fil d'Ariane" className="mb-8">
        <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-muted">
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`} className="flex min-w-0 max-w-full items-center gap-1">
              {i > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-45" aria-hidden />
              ) : null}
              {item.href ? (
                <Link href={item.href} className="min-w-0 truncate hover:text-neon">
                  {item.label}
                </Link>
              ) : (
                <span
                  className="min-w-0 max-w-[14rem] truncate font-medium text-foreground sm:max-w-[28rem]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export function buildBreadcrumbListJsonLd(
  baseUrl: string,
  crumbs: { name: string; path?: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.path ? `${baseUrl}${c.path}` : undefined,
    })),
  };
}
