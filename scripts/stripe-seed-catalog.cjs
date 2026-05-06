/**
 * Crée (ou réutilise) les 3 prix Stripe alignés sur l’app — à lancer en local :
 *
 *   STRIPE_SECRET_KEY=sk_test_xxx pnpm stripe:seed-catalog
 *
 * Affiche les lignes à copier dans .env / Vercel (STRIPE_PRICE_*).
 * Idempotent : `lookup_key` stable par offre (ne duplique pas si déjà créé).
 */
/* eslint-disable no-console */

const Stripe = require("stripe");

const CATALOG = [
  {
    lookupKey: "athlete_compass_bilan_9",
    name: "Bilan — Athlete Compass",
    amountCents: 900,
    envName: "STRIPE_PRICE_BILAN_9",
  },
  {
    lookupKey: "athlete_compass_plan_19",
    name: "Plan 4 semaines — Athlete Compass",
    amountCents: 1900,
    envName: "STRIPE_PRICE_PLAN_19",
  },
  {
    lookupKey: "athlete_compass_pack_29",
    name: "Pack — Athlete Compass",
    amountCents: 2900,
    envName: "STRIPE_PRICE_PACK_29",
  },
];

async function ensurePrice(stripe, item) {
  const existing = await stripe.prices.list({
    lookup_keys: [item.lookupKey],
    active: true,
    limit: 1,
  });
  if (existing.data.length > 0) {
    const p = existing.data[0];
    console.log(`# OK (existant) ${item.lookupKey} → ${p.id}`);
    return p.id;
  }

  const created = await stripe.prices.create({
    currency: "eur",
    unit_amount: item.amountCents,
    lookup_key: item.lookupKey,
    product_data: {
      name: item.name,
      metadata: { athlete_compass: item.lookupKey },
    },
  });
  console.log(`# Créé ${item.lookupKey} → ${created.id}`);
  return created.id;
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    console.error("Manquant : STRIPE_SECRET_KEY (sk_test_… ou sk_live_…).");
    process.exit(1);
  }

  const stripe = new Stripe(key);
  const lines = [];

  for (const item of CATALOG) {
    const id = await ensurePrice(stripe, item);
    lines.push(`${item.envName}=${id}`);
  }

  console.log("\n--- Copier dans .env ou Vercel ---\n");
  for (const line of lines) console.log(line);
  console.log("\nVérifie le mode (test vs live) de ta clé : les price_… suivent le même mode.\n");
}

main().catch((err) => {
  console.error(err?.message ?? err);
  process.exit(1);
});
