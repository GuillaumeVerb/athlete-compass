import Stripe from "stripe";
import { isStripeSecretConfigured } from "@/lib/env/cloud-ready";

let stripeSingleton: Stripe | null = null;

/** Instance Stripe serveur — null si `STRIPE_SECRET_KEY` absent. */
export function getStripe(): Stripe | null {
  if (!isStripeSecretConfigured()) return null;
  const key = process.env.STRIPE_SECRET_KEY!;
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, {
      typescript: true,
      appInfo: {
        name: "Athlete Compass",
        version: "0.1.0",
        url: "https://github.com/GuillaumeVerb/athlete-compass",
      },
    });
  }
  return stripeSingleton;
}
