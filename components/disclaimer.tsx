import { cn } from "@/lib/utils";

const DISCLAIMER_FULL =
  "L'âge athlétique est une estimation de performance. Ce n'est pas une mesure biologique, un avis médical ou un diagnostic de santé.";

const DISCLAIMER_SHORT = "Estimation de performance, pas diagnostic médical.";

export function MedicalDisclaimer({
  className,
  compact,
}: {
  className?: string;
  /** Une ligne — hero, cartes denses */
  compact?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-xs leading-relaxed text-muted/80 max-w-prose",
        className,
      )}
    >
      {compact ? DISCLAIMER_SHORT : DISCLAIMER_FULL}
    </p>
  );
}
