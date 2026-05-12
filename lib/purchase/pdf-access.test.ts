import { describe, expect, it } from "vitest";
import { bearerMatchesPurchase, normalizeEmailForPurchase } from "./pdf-access";

describe("bearerMatchesPurchase", () => {
  it("accepte si user_id achat = id JWT (emails différents)", () => {
    const id = "11111111-1111-4111-8111-111111111111";
    expect(
      bearerMatchesPurchase({
        jwtUserId: id,
        jwtEmail: "a@x.com",
        purchaseUserId: id,
        purchaseEmail: "b@y.com",
      }),
    ).toBe(true);
  });

  it("repli email si pas de user_id en base", () => {
    expect(
      bearerMatchesPurchase({
        jwtUserId: "22222222-2222-4222-8222-222222222222",
        jwtEmail: "Test@Example.com",
        purchaseUserId: null,
        purchaseEmail: "test@example.com",
      }),
    ).toBe(true);
  });

  it("refuse si user_id en base mais différent du JWT (pas de repli email)", () => {
    expect(
      bearerMatchesPurchase({
        jwtUserId: "11111111-1111-4111-8111-111111111111",
        jwtEmail: "same@example.com",
        purchaseUserId: "22222222-2222-4222-8222-222222222222",
        purchaseEmail: "same@example.com",
      }),
    ).toBe(false);
  });
});

describe("normalizeEmailForPurchase", () => {
  it("trim + lowercase", () => {
    expect(normalizeEmailForPurchase("  Test@Example.COM  ")).toBe("test@example.com");
  });

  it("rejette vide", () => {
    expect(normalizeEmailForPurchase("   ")).toBeNull();
    expect(normalizeEmailForPurchase(null)).toBeNull();
  });
});
