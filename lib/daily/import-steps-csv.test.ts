import { describe, expect, it } from "vitest";
import { parseStepsCsv } from "@/lib/daily/import-steps-csv";

describe("parseStepsCsv", () => {
  it("parse des lignes date,pas", () => {
    const r = parseStepsCsv("2026-05-01,8000\n2026-05-02;9123");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.rows).toEqual([
      { day: "2026-05-01", steps: 8000 },
      { day: "2026-05-02", steps: 9123 },
    ]);
  });

  it("ignore une ligne d’en-tête", () => {
    const r = parseStepsCsv("date,pas\n2026-05-03,5000");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.rows).toEqual([{ day: "2026-05-03", steps: 5000 }]);
  });

  it("rejette un fichier sans lignes valides", () => {
    const r = parseStepsCsv("foo,bar\nnope,1");
    expect(r.ok).toBe(false);
  });
});
