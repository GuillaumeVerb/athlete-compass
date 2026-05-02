import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function LockedCard({
  title,
  description,
  highlight,
}: {
  title: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6",
        highlight
          ? "border-[#f5b82e]/40 bg-[#f5b82e]/[0.06]"
          : "border-white/[0.08] bg-[#111820]/50",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[#05070a]/55 backdrop-blur-md"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="relative flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#05070a]/80 text-[#f5b82e] shadow-inner">
          <Lock className="h-5 w-5 opacity-90" />
        </span>
        <div className="min-w-0">
          <h3 className="text-display font-semibold text-[#f4f7fa]">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-[#8b98a8]">
              {description}
            </p>
          ) : null}
          <p className="mt-3 text-xs text-[#6b7684]">
            Contenu réservé à l&apos;offre premium — aperçu structurel en démo.
          </p>
        </div>
      </div>
    </div>
  );
}
