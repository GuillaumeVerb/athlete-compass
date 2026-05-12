import { describe, expect, it } from "vitest";
import { DEFAULT_STEPS_GOAL } from "./daily-activity-storage";

describe("daily-activity-storage", () => {
  it("objectif par défaut neutre (10 000 pas)", () => {
    expect(DEFAULT_STEPS_GOAL).toBe(10_000);
  });
});
