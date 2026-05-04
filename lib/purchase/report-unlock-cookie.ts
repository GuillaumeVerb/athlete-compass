import { createHmac, timingSafeEqual } from "crypto";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";

const COOKIE = "ac_report_unlock";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 j

type Payload = {
  sessionId: string;
  productKey: PurchaseProductKey;
  exp: number;
};

function signingSecret(): string | null {
  const s =
    process.env.PURCHASE_SIGNING_SECRET?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim();
  return s || null;
}

export function signReportUnlock(
  sessionId: string,
  productKey: PurchaseProductKey,
): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload: Payload = { sessionId, productKey, exp };
  const body = JSON.stringify(payload);
  const sig = createHmac("sha256", secret).update(body).digest("hex");
  return Buffer.from(JSON.stringify({ body, sig }), "utf8").toString("base64url");
}

export function verifyReportUnlock(token: string): Payload | null {
  const secret = signingSecret();
  if (!secret) return null;
  try {
    const raw = JSON.parse(Buffer.from(token, "base64url").toString("utf8")) as {
      body: string;
      sig: string;
    };
    const expected = createHmac("sha256", secret).update(raw.body).digest("hex");
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(raw.sig, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    const payload = JSON.parse(raw.body) as Payload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now() / 1000)
      return null;
    if (!payload.sessionId) return null;
    const pk = payload.productKey;
    if (pk !== "bilan_9" && pk !== "plan_19" && pk !== "pack_29") return null;
    return { ...payload, productKey: pk };
  } catch {
    return null;
  }
}

export const REPORT_UNLOCK_COOKIE = COOKIE;
export const REPORT_UNLOCK_MAX_AGE = MAX_AGE_SEC;
