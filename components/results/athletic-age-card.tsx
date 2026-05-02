import { Badge } from "@/components/ui/badge";

export function AthleticAgeCard({
  athleticAge,
  realAge,
}: {
  athleticAge: number;
  realAge: number;
}) {
  const delta = athleticAge - realAge;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-elevated to-surface p-6 lg:p-8">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-neon/10 blur-3xl" />
      <p className="relative text-sm text-muted">Âge athlétique</p>
      <p className="text-display relative mt-2 text-5xl font-semibold text-foreground sm:text-6xl">
        {athleticAge}{" "}
        <span className="text-2xl font-medium text-muted sm:text-3xl">
          ans
        </span>
      </p>
      <p className="relative mt-3 text-sm text-muted">
        Âge réel : {realAge} ans
      </p>
      <div className="mt-4 relative">
        <Badge
          variant={delta === 0 ? "secondary" : "default"}
          className="text-xs"
        >
          {delta === 0 ? "Aligné" : delta < 0 ? `${delta} ans` : `+${delta} ans`}
        </Badge>
      </div>
    </div>
  );
}
