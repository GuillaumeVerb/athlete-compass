import type { BlogTocItem } from "@/lib/blog-toc";

const MIN_ITEMS = 3;

type Props = { items: BlogTocItem[] };

export function TableOfContents({ items }: Props) {
  if (items.length < MIN_ITEMS) return null;

  return (
    <nav
      aria-labelledby="toc-heading"
      className="mb-8 rounded-2xl border border-border bg-surface/50 p-4 sm:p-5"
    >
      <p id="toc-heading" className="text-xs font-semibold uppercase tracking-wider text-muted">
        Sur cette page
      </p>
      <ol className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={`${item.level}-${item.id}`} className={item.level === 3 ? "pl-3" : ""}>
            <a
              href={`#${item.id}`}
              className="text-sm text-muted underline-offset-2 transition hover:text-neon hover:underline"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
