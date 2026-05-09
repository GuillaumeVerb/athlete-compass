import { describe, expect, it } from "vitest";
import { coachQuickResponse, type CoachContext } from "@/lib/coach/coach-responses";

const baseCtx = (): CoachContext => ({
  profileId: "balanced_hybrid",
  goal: "crossfit",
  readinessScore: 70,
  constraints: [],
  equipment: ["rower", "bike"],
  nextBestMove: "Tester ton 2 km rameur",
});

describe("coachQuickResponse", () => {
  it("inclut toujours l’avertissement non médical", () => {
    const ctx = baseCtx();
    for (const id of [
      "adapt_session",
      "tired",
      "30min",
      "replace_machine",
      "row_progress",
      "light_legs",
      "next_best",
    ] as const) {
      expect(coachQuickResponse(id, ctx)).toMatch(/pas un avis médical/i);
    }
  });

  it("« Je suis fatigué » + readiness bas → privilégie récup / Z2", () => {
    const text = coachQuickResponse("tired", { ...baseCtx(), readinessScore: 45 });
    expect(text).toMatch(/Zone 2|léger/i);
  });

  it("« Je suis fatigué » + readiness haut → message effort modéré", () => {
    const text = coachQuickResponse("tired", { ...baseCtx(), readinessScore: 72 });
    expect(text).toMatch(/technique|modéré|SkiErg/i);
  });

  it("« Ménager les cuisses » avec contrainte → alternatives jambes", () => {
    const text = coachQuickResponse("light_legs", {
      ...baseCtx(),
      constraints: ["light_legs"],
    });
    expect(text).toMatch(/escaliers|SkiErg|Zone 2/i);
  });

  it("« Adapter ma séance » suit le readiness", () => {
    const high = coachQuickResponse("adapt_session", { ...baseCtx(), readinessScore: 80 });
    const low = coachQuickResponse("adapt_session", { ...baseCtx(), readinessScore: 50 });
    expect(high).toMatch(/Readiness correcte|1–2 reps/i);
    expect(low).toMatch(/20–30 %/i);
  });

  it("« Ma prochaine meilleure action » cite le nextBestMove", () => {
    const text = coachQuickResponse("next_best", baseCtx());
    expect(text).toContain("2 km rameur");
  });

  it("« Remplacer une machine » propose rameur / vélo", () => {
    const text = coachQuickResponse("replace_machine", baseCtx());
    expect(text).toMatch(/Rameur|vélo|SkiErg/i);
  });
});
