import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { stripeCustomerIdFromCheckoutSession } from "./purchase-insert";

function sess(partial: Partial<Stripe.Checkout.Session>): Stripe.Checkout.Session {
  return partial as Stripe.Checkout.Session;
}

describe("stripeCustomerIdFromCheckoutSession", () => {
  it("lit cus_ depuis string", () => {
    expect(stripeCustomerIdFromCheckoutSession(sess({ customer: "cus_ABC123" }))).toBe("cus_ABC123");
  });

  it("lit cus_ depuis objet", () => {
    expect(
      stripeCustomerIdFromCheckoutSession(
        sess({ customer: { id: "cus_xyz", object: "customer" } as Stripe.Customer }),
      ),
    ).toBe("cus_xyz");
  });

  it("retourne null si absent", () => {
    expect(stripeCustomerIdFromCheckoutSession(sess({ customer: null }))).toBeNull();
    expect(stripeCustomerIdFromCheckoutSession(sess({}))).toBeNull();
  });
});
