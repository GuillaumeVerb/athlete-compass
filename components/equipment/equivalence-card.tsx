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
        "rounded-2xl border p-5 flex flex-col h-full transition-colors",
        highlightLightLegs && card.lightLegsTip
          ? "border-[#f5b942]/35 bg-[#f5b942]/[0.06]"
          : "border-[#252a36] bg-[#12151c]/80",
      )}
    >
      <p className="text-[10px] uppercase tracking-widest text-[#6b7289]">
        {card.tag}
      </p>
      <h3 className="text-display text-base font-semibold text-white mt-1">
        {card.title}
      </h3>
      <p className="text-sm text-[#9aa3b8] mt-3 leading-relaxed flex-1">
        {card.summary}
      </p>
      {card.lightLegsTip ? (
        <p
          className={cn(
            "text-xs mt-4 pt-4 border-t border-[#252a36] leading-relaxed",
            highlightLightLegs ? "text-[#f5b942]" : "text-[#6b7289]",
          )}
        >
          <span className="font-medium text-[#c5cad8]">Moins de cuisses : </span>
          {card.lightLegsTip}
        </p>
      ) : null}
    </div>
  );
}
