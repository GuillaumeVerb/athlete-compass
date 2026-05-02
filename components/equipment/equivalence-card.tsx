import { cn } from "@/lib/utils";
import type { MachineCard } from "@/lib/equipment/equivalences";

export function EquivalenceCard({
  card,
  highlightLightLegs,
}: {
  card: MachineCard;
  highlightLightLegs?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border p-5 transition-colors",
        highlightLightLegs && card.lightLegsTip
          ? "border-amber/35 bg-amber/10"
          : "border-border bg-surface/80",
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
        {card.tag}
      </p>
      <h3 className="text-display mt-1 text-base font-semibold text-foreground">
        {card.title}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {card.summary}
      </p>
      {card.lightLegsTip ? (
        <p
          className={cn(
            "mt-4 border-t border-border pt-4 text-xs leading-relaxed",
            highlightLightLegs ? "text-amber" : "text-muted",
          )}
        >
          <span className="font-medium text-foreground/90">Moins de cuisses : </span>
          {card.lightLegsTip}
        </p>
      ) : null}
    </div>
  );
}
