import Link from "next/link";

export function BlogCta() {
  return (
    <aside className="mt-14 rounded-2xl border border-neon/25 bg-neon/5 p-6 sm:p-8">
      <p className="text-display text-lg font-semibold text-foreground">Passer le bilan</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Avant de t&apos;engager dans une ligue ou un format précis, saisis quelques
        perfs (rameur, course, tractions, force…) : âge athlétique estimé, Hybrid
        Score et prochain test utile.
      </p>
      <Link
        href="/profile"
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-neon px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-neon/90"
      >
        Découvrir mon profil hybride
      </Link>
      <p className="mt-4 text-[11px] leading-snug text-muted/90">
        L&apos;âge athlétique est une estimation de performance, pas une mesure biologique ni un diagnostic
        médical.
      </p>
    </aside>
  );
}
