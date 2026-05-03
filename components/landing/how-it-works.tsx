import { ClipboardList, Gauge, Sparkles } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Profil & objectif",
    body: "Âge, morpho, objectif (CrossFit, HYROX, recomp…), matériel et contraintes — le moteur adapte les pondérations.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Performances ciblées",
    body: "Quelques tests standards (rameur, tirage, squat, etc.). Chaque champ renvoie au protocole pour une saisie crédible.",
    icon: Gauge,
  },
  {
    step: "03",
    title: "Aperçu & prochaine action",
    body: "Âge athlétique, Hybrid Score pondéré par ton objectif, radar, limiteur et une action simple — pas un carnet d’entraînements.",
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="border-t border-border bg-surface/25 py-20 px-6"
    >
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-neon">
          Comment ça marche
        </p>
        <h2 className="text-display mt-3 text-center text-2xl font-semibold text-foreground">
          Trois étapes, un fil clair
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted">
          Trois étapes courtes — profil, performances mesurables, synthèse
          actionnable. Pas un carnet d&apos;entraînements : un fil pour décider
          quoi ajuster ensuite.
        </p>
        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map(({ step, title, body, icon: Icon }) => (
            <li
              key={step}
              className="relative rounded-2xl border border-border bg-surface/80 p-6 pt-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              <span className="text-display absolute right-5 top-5 text-4xl font-bold text-foreground/10">
                {step}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-neon/25 bg-background text-neon">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-display mt-5 text-lg font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
