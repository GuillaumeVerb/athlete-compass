import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LockedCard({
  title,
  description,
  highlight,
  teaser,
}: {
  title: string;
  description?: string;
  highlight?: boolean;
  /** Une ligne d’aperçu floue / chiffrée — valeur sans révéler le contenu (doc/07). */
  teaser?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6",
        highlight
          ? "border-amber/40 bg-amber/10"
          : "border-border bg-surface/50",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-background/55 backdrop-blur-md"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-background/80 text-amber shadow-inner">
          <Lock className="h-5 w-5 opacity-90" />
        </span>
        <div className="min-w-0">
          <h3 className="text-display font-semibold text-foreground">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {description}
            </p>
          ) : null}
          {teaser ? (
            <p className="mt-3 rounded-lg border border-border/50 bg-background/40 px-2.5 py-1.5 font-mono text-[11px] tracking-tight text-muted/80">
              {teaser}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-muted/70">
            Contenu réservé à l&apos;offre premium — aperçu structurel en démo.
          </p>
        </div>
      </div>
    </div>
  );
}
