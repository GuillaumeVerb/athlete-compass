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
          ? "border-[#f5b942]/55 bg-[#f5b942]/[0.07] shadow-[0_0_40px_-12px_rgba(245,185,66,0.35)]"
          : "border-[#252a36] bg-[#12151c]/80",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-display text-lg font-semibold text-white">{title}</h3>
        {highlight ? (
          <Badge variant="amber">Le meilleur choix</Badge>
        ) : null}
      </div>
      <p className="text-3xl font-semibold text-white mt-4">
        {price}
        <span className="text-base font-normal text-[#8b92a6]"> / achat</span>
      </p>
      <ul className="mt-6 space-y-2 text-sm text-[#c5cad8] flex-1">
        {features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-[#52ff72]">✓</span>
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
