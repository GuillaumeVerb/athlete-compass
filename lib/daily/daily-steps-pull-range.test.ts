import { describe, expect, it } from "vitest";
import { clampDailyStepsPullRange, defaultDailyStepsPullRange } from "@/lib/daily/daily-steps-pull-range";

describe("daily-steps-pull-range", () => {
  it("defaultDailyStepsPullRange couvre ~45 jours", () => {
    const { from, to } = defaultDailyStepsPullRange("2026-05-09");
    expect(to).toBe("2026-05-09");
    expect(from < to).toBe(true);
  });

  it("clampDailyStepsPullRange refuse une plage trop large", () => {
    const r = clampDailyStepsPullRange("2020-01-01", "2026-05-09", "2026-05-09");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.error).toBe("range_too_large");
  });

  it("clampDailyStepsPullRange inverse from et to si besoin", () => {
    const r = clampDailyStepsPullRange("2026-05-05", "2026-05-01", "2026-05-09");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.from).toBe("2026-05-01");
    expect(r.to).toBe("2026-05-05");
  });
});
