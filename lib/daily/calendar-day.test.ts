import { describe, expect, it } from "vitest";
import { addCalendarDays, formatYmdLocal, parseYmdLocal } from "@/lib/daily/calendar-day";

describe("calendar-day", () => {
  it("parseYmdLocal refuse les dates impossibles", () => {
    expect(parseYmdLocal("2026-02-30")).toBeNull();
    expect(parseYmdLocal("nope")).toBeNull();
  });

  it("addCalendarDays recule correctement", () => {
    expect(addCalendarDays("2026-05-09", -45)).toBe("2026-03-25");
  });

  it("formatYmdLocal / parseYmdLocal aller-retour", () => {
    const d = parseYmdLocal("2026-01-15");
    expect(d).not.toBeNull();
    expect(formatYmdLocal(d!)).toBe("2026-01-15");
  });
});
