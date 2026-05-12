import { addCalendarDays, parseYmdLocal } from "@/lib/daily/calendar-day";

const MAX_SPAN_DAYS = 120;
const DEFAULT_BACK_DAYS = 45;

/** Fenêtre [from, to] pour GET /api/daily/steps (inclus), `to` = jour courant local. */
export function defaultDailyStepsPullRange(toYmd: string): { from: string; to: string } {
  const from = addCalendarDays(toYmd, -DEFAULT_BACK_DAYS) ?? toYmd;
  return { from, to: toYmd };
}

/** Valide / normalise une plage demandée ; erreur si format invalide ou plage trop large. */
export function clampDailyStepsPullRange(
  fromRaw: string | null,
  toRaw: string | null,
  fallbackTo: string,
): { ok: true; from: string; to: string } | { ok: false; error: string } {
  const to = toRaw && /^\d{4}-\d{2}-\d{2}$/.test(toRaw) ? toRaw : fallbackTo;
  const fromDefault = defaultDailyStepsPullRange(to).from;
  const from = fromRaw && /^\d{4}-\d{2}-\d{2}$/.test(fromRaw) ? fromRaw : fromDefault;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return { ok: false, error: "invalid_date_format" };
  }
  let a = from;
  let b = to;
  if (a > b) [a, b] = [b, a];

  const start = parseYmdLocal(a);
  const end = parseYmdLocal(b);
  if (!start || !end) return { ok: false, error: "invalid_calendar_date" };

  const span = Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  if (span > MAX_SPAN_DAYS) {
    return { ok: false, error: "range_too_large" };
  }

  return { ok: true, from: a, to: b };
}
