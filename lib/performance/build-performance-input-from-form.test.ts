import { describe, expect, it } from "vitest";
import { buildPerformanceInputFromForm } from "./build-performance-input-from-form";
import { perfLoadNoteFormKey } from "./performance-load-notes";

describe("buildPerformanceInputFromForm (onglet Perf)", () => {
  it("accepte un 1 km valide seul", () => {
    const r = buildPerformanceInputFromForm({ row1k: "03:32" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toEqual({ row1k: "03:32" });
  });

  it("refuse un temps invalide", () => {
    const r = buildPerformanceInputFromForm({ row1k: "3:99" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("1 km rameur");
  });

  it("refuse des tractions non entières", () => {
    const r = buildPerformanceInputFromForm({ pullups: "10.5" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("Tractions strictes");
  });

  it("refuse un poids ≤ 0 hors tractions", () => {
    const r = buildPerformanceInputFromForm({ frontSquat5: "0" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("Front squat");
  });

  it("accepte sandbag carry au format slash", () => {
    const r = buildPerformanceInputFromForm({ sandbagCarry: "40/50" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.sandbagCarry).toBe("40/50");
  });

  it("accepte farmer carry au format slash", () => {
    const r = buildPerformanceInputFromForm({ farmerCarry: "40/35" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.farmerCarry).toBe("40/35");
  });

  it("accepte masse med ball optionnelle avec wall ball", () => {
    const r = buildPerformanceInputFromForm({
      wallBall150: "06:00",
      [perfLoadNoteFormKey("wallBall150Kg")]: "12,5",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.wallBall150).toBe("06:00");
      expect(r.data.loadNotes?.wallBall150Kg).toBe(12.5);
    }
  });

  it("refuse masse med ball invalide", () => {
    const r = buildPerformanceInputFromForm({
      wallBall150: "06:00",
      [perfLoadNoteFormKey("wallBall150Kg")]: "0",
    });
    expect(r.ok).toBe(false);
  });
});
