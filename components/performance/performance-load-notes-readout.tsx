import type { PerformanceLoadNotes } from "@/lib/types";
import {
  formatLoadNoteKg,
  loadNotesDisplayRows,
} from "@/lib/performance/load-notes-display";
import { cn } from "@/lib/utils";

type Props = {
  loadNotes: PerformanceLoadNotes | undefined;
  className?: string;
  /** Variante plus discrète pour encarts secondaires (ex. Daily). */
  compact?: boolean;
};

export function PerformanceLoadNotesReadout({
  loadNotes,
  className,
  compact,
}: Props) {
  const rows = loadNotesDisplayRows(loadNotes);
  if (rows.length === 0) return null;

  return (
    <aside
      className={cn(
        "rounded-2xl border border-border bg-surface/60",
        compact ? "p-4" : "p-4 sm:p-5",
        className,
      )}
      aria-label="Charges optionnelles enregistrées avec les performances"
    >
      <p
        className={cn(
          "font-semibold text-foreground",
          compact ? "text-xs" : "text-sm",
        )}
      >
        Charges notées
      </p>
      <p className="mt-1 text-xs leading-relaxed text-muted">
        Contexte pour tes retests — non pris dans le calcul du score.
      </p>
      <ul
        className={cn(
          "mt-3 divide-y divide-border/70",
          compact ? "text-xs" : "text-sm",
        )}
      >
        {rows.map(({ noteKey, testTitle, kg }) => (
          <li
            key={noteKey}
            className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 py-2 first:pt-0"
          >
            <span className="min-w-0 text-muted">{testTitle}</span>
            <span className="shrink-0 tabular-nums font-medium text-foreground">
              {formatLoadNoteKg(kg)} kg
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
