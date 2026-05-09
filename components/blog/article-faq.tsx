import type { BlogFaqItem } from "@/lib/blog";

type Props = {
  faq: BlogFaqItem[];
};

export function ArticleFaq({ faq }: Props) {
  if (faq.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-12 border-t border-border pt-10" aria-labelledby="faq-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 id="faq-heading" className="text-display text-xl font-semibold text-foreground">
        FAQ
      </h2>
      <p className="mt-2 text-xs text-muted">Réponses générales — pas un avis médical.</p>
      <dl className="mt-6 space-y-6">
        {faq.map((item, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-surface/40 px-4 py-4 sm:px-5">
            <dt className="text-display text-sm font-semibold text-foreground">{item.question}</dt>
            <dd className="mt-2 space-y-2 text-sm leading-relaxed text-muted">
              {item.answer.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
