import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingCard({
  title,
  price,
  features,
  highlight,
  ctaLabel,
}: {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
  ctaLabel?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border p-6 h-full",
        highlight
          ? "border-amber/55 bg-amber/10 shadow-[0_0_40px_-12px_rgba(245,184,46,0.35)]"
          : "border-border bg-surface/80",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-display text-lg font-semibold text-foreground">{title}</h3>
        {highlight ? (
          <Badge variant="amber">Le meilleur choix</Badge>
        ) : null}
      </div>
      <p className="mt-4 text-3xl font-semibold text-foreground">
        {price}
        <span className="text-base font-normal text-muted"> / achat</span>
      </p>
      <ul className="mt-6 flex-1 space-y-2 text-sm text-muted">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-neon">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Button
        className="mt-8 w-full rounded-xl"
        variant={highlight ? "amber" : "default"}
      >
        {ctaLabel ?? "Continuer"}
      </Button>
    </div>
  );
}
