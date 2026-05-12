import { describe, expect, it } from "vitest";
import { normalizeEmailForPurchase } from "./pdf-access";

describe("normalizeEmailForPurchase", () => {
  it("trim + lowercase", () => {
    expect(normalizeEmailForPurchase("  Test@Example.COM  ")).toBe("test@example.com");
  });

  it("rejette vide", () => {
    expect(normalizeEmailForPurchase("   ")).toBeNull();
    expect(normalizeEmailForPurchase(null)).toBeNull();
  });
});
