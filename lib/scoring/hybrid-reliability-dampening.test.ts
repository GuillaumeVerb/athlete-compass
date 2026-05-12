import { describe, expect, it } from "vitest";
import { dampenHybridTowardNeutralForLowReliability } from "./hybrid-reliability-dampening";

describe("dampenHybridTowardNeutralForLowReliability", () => {
  it("ne modifie pas le score si la fiabilité est suffisante", () => {
    expect(dampenHybridTowardNeutralForLowReliability(78, 72)).toBe(78);
    expect(dampenHybridTowardNeutralForLowReliability(78, 55)).toBe(78);
  });

  it("rapproche légèrement du neutre quand la fiabilité est très basse", () => {
    const d = dampenHybridTowardNeutralForLowReliability(80, 0);
    expect(d).toBeLessThan(80);
    expect(d).toBeGreaterThan(50);
  });

  it("conserve les bornes 0–100", () => {
    expect(dampenHybridTowardNeutralForLowReliability(0, 0)).toBeGreaterThanOrEqual(0);
    expect(dampenHybridTowardNeutralForLowReliability(100, 0)).toBeLessThanOrEqual(100);
  });
});
