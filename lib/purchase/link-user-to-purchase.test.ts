import { describe, expect, it } from "vitest";
import { gatePurchaseUserLink } from "./link-user-to-purchase";

const uid = "11111111-1111-1111-1111-111111111111";

describe("gatePurchaseUserLink", () => {
  it("404 si pas de ligne", () => {
    expect(gatePurchaseUserLink(null, uid, "a@b.co")).toEqual({
      status: "error",
      code: "not_found",
      http: 404,
    });
  });

  it("403 si non payé", () => {
    expect(
      gatePurchaseUserLink(
        { status: "pending", user_id: null, customer_email: "a@b.co" },
        uid,
        "a@b.co",
      ),
    ).toEqual({ status: "error", code: "not_paid", http: 403 });
  });

  it("already_linked si user_id = JWT", () => {
    expect(
      gatePurchaseUserLink(
        { status: "paid", user_id: uid, customer_email: "a@b.co" },
        uid,
        "a@b.co",
      ),
    ).toEqual({ status: "already_linked" });
  });

  it("403 si autre user_id", () => {
    expect(
      gatePurchaseUserLink(
        {
          status: "paid",
          user_id: "22222222-2222-2222-2222-222222222222",
          customer_email: "a@b.co",
        },
        uid,
        "a@b.co",
      ),
    ).toEqual({ status: "error", code: "user_already_set", http: 403 });
  });

  it("403 si email achat ≠ JWT", () => {
    expect(
      gatePurchaseUserLink(
        { status: "paid", user_id: null, customer_email: "buyer@x.com" },
        uid,
        "other@x.com",
      ),
    ).toEqual({ status: "error", code: "email_mismatch", http: 403 });
  });

  it("commit si paid, user_id vide, emails égaux (casse)", () => {
    expect(
      gatePurchaseUserLink(
        { status: "paid", user_id: null, customer_email: "User@Example.com" },
        uid,
        "user@example.com",
      ),
    ).toEqual({ status: "commit", userId: uid });
  });
});
