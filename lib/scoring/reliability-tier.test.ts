import { describe, expect, it } from "vitest";
import {
  reliabilityTierExplanationFr,
  reliabilityTierFromPct,
} from "@/lib/scoring/reliability-tier";

describe("reliabilityTierFromPct (doc/09)", () => {
  it("classifie faible / moyen / bon / élevé selon les seuils", () => {
    expect(reliabilityTierFromPct(0)).toBe("faible");
    expect(reliabilityTierFromPct(39)).toBe("faible");
    expect(reliabilityTierFromPct(40)).toBe("moyen");
    expect(reliabilityTierFromPct(59)).toBe("moyen");
    expect(reliabilityTierFromPct(60)).toBe("bon");
    expect(reliabilityTierFromPct(79)).toBe("bon");
    expect(reliabilityTierFromPct(80)).toBe("élevé");
    expect(reliabilityTierFromPct(100)).toBe("élevé");
  });
});

describe("reliabilityTierExplanationFr", () => {
  it("explique le palier et mentionne les données manquantes", () => {
    const t = reliabilityTierExplanationFr(55, 2);
    expect(t).toMatch(/piliers|lisible/i);
    expect(t).toMatch(/2/);
  });
});
