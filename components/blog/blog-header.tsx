import Link from "next/link";
import { Activity, Rss } from "lucide-react";

export function BlogHeader() {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/blog" className="text-display text-sm font-semibold text-foreground hover:text-neon">
          Blog
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/feed.xml"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted transition hover:border-neon/35 hover:text-foreground"
            title="Flux RSS du blog"
          >
            <Rss className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden sm:inline">RSS</span>
          </Link>
          <Link href="/" className="group flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-neon/35 bg-neon/15 text-neon">
              <Activity className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Athlete Compass</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
