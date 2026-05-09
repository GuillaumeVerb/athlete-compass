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
    <div className="relative overflow-hidden rounded-2xl border border-neon/25 bg-gradient-to-br from-surface-elevated via-surface to-background p-6 shadow-[0_0_40px_-24px_rgba(82,255,114,0.35)] lg:p-8">
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
      <div className="mt-4 relative space-y-2">
        <Badge
          variant={delta === 0 ? "secondary" : "default"}
          className="text-xs"
        >
          {delta === 0 ? "Aligné" : delta < 0 ? `${delta} ans` : `+${delta} ans`}
        </Badge>
        <p className="text-xs leading-relaxed text-muted">
          {delta < 0
            ? "Ton corps performe comme un profil plus jeune sur les qualités mesurées."
            : delta > 0
              ? "Sur les qualités mesurées, il reste de la marge pour rapprocher le score de ton âge réel."
              : "Profil cohérent avec ton âge réel sur les tests renseignés."}
        </p>
      </div>
    </div>
  );
}
