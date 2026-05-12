/** Manipulation de clés `YYYY-MM-DD` en calendrier local (navigateur ou tests). */

export function parseYmdLocal(ymd: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return null;
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function formatYmdLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addCalendarDays(ymd: string, deltaDays: number): string | null {
  const dt = parseYmdLocal(ymd);
  if (!dt) return null;
  dt.setDate(dt.getDate() + deltaDays);
  return formatYmdLocal(dt);
}
