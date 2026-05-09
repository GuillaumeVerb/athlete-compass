/**
 * Vérifie les prérequis V2 (Supabase, Stripe checkout, webhook, Resend, cron)
 * sans afficher de secret. Charge `.env.local` puis `.env` à la racine.
 *
 *   pnpm check:v2
 *   npm run check:v2
 */
/* eslint-disable @typescript-eslint/no-require-globals -- script Node */

const fs = require("fs");
const path = require("path");

function loadEnvFile(rel) {
  const envPath = path.join(process.cwd(), rel);
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq <= 0) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

function t(v) {
  return Boolean(v && String(v).trim());
}

const supabaseBrowser = t(process.env.NEXT_PUBLIC_SUPABASE_URL) && t(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const supabaseAdmin =
  t(process.env.NEXT_PUBLIC_SUPABASE_URL) && t(process.env.SUPABASE_SERVICE_ROLE_KEY);
const stripeSecret = t(process.env.STRIPE_SECRET_KEY);
const stripeWebhook = t(process.env.STRIPE_WEBHOOK_SECRET);
const stripePrices =
  stripeSecret &&
  t(process.env.STRIPE_PRICE_BILAN_9) &&
  t(process.env.STRIPE_PRICE_PLAN_19) &&
  t(process.env.STRIPE_PRICE_PACK_29);
const stripeCheckout = stripePrices;
const resendEmail = t(process.env.RESEND_API_KEY) && t(process.env.RESEND_FROM_EMAIL);
const cronRetest = t(process.env.CRON_SECRET);
const appUrl = t(process.env.NEXT_PUBLIC_APP_URL);
const purchaseSigning = t(process.env.PURCHASE_SIGNING_SECRET);

function explicitBaseUrl() {
  const u = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (u) return u.replace(/\/$/, "");
  const v = process.env.VERCEL_URL?.trim();
  if (v) return `https://${v.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

const rows = [
  ["NEXT_PUBLIC_APP_URL (recommandé succès Stripe / canonical)", appUrl, "Défini par défaut en local → http://localhost:3000 si absent"],
  ["Supabase navigateur (NEXT_PUBLIC_SUPABASE_* )", supabaseBrowser, "Optionnel V1 ; utile client + auth future"],
  ["Supabase service role (admin)", supabaseAdmin, "Requis pour persister purchases / snapshots côté serveur"],
  ["STRIPE_SECRET_KEY", stripeSecret, "Mode test sk_test_… puis prod"],
  ["STRIPE_PRICE_BILAN_9 / PLAN_19 / PACK_29", stripePrices, "pnpm stripe:seed-catalog pour créer les prix"],
  ["Checkout utilisable (clé + 3 prix)", stripeCheckout, "Aligné sur isStripeCheckoutConfigured()"],
  ["STRIPE_WEBHOOK_SECRET (whsec_…)", stripeWebhook, "stripe listen → forward webhook local"],
  ["PURCHASE_SIGNING_SECRET (optionnel)", purchaseSigning, "Sinon signature cookie = dérivée de STRIPE_SECRET_KEY"],
  ["Resend (email post-achat)", resendEmail, "Optionnel"],
  ["CRON_SECRET (rappels retest)", cronRetest, "Optionnel ; Vercel cron"],
];

console.log("\nAthlete Compass — prérequis V2 (aucun secret affiché)\n");
console.log("Base URL utilisée pour les redirections Stripe :", explicitBaseUrl(), "\n");

let maxW = 0;
for (const [label] of rows) maxW = Math.max(maxW, label.length);

for (const [label, ok, hint] of rows) {
  const mark = ok ? "✓" : "✗";
  const pad = " ".repeat(maxW - label.length);
  console.log(`${mark}  ${label}${pad}  ${hint}`);
}

console.log("\n---");
if (!stripeCheckout) {
  console.log(
    "Checkout : inactif tant que STRIPE_SECRET_KEY + les 3 STRIPE_PRICE_* ne sont pas définis.",
  );
  console.log("  → Voir docs/V2_A_FAIRE.md et : pnpm stripe:seed-catalog\n");
  process.exitCode = 1;
} else if (!stripeWebhook) {
  console.log(
    "Checkout OK — pense à STRIPE_WEBHOOK_SECRET pour que le webhook enregistre l’achat en base.",
  );
  console.log("  → Terminal 1 : pnpm dev   Terminal 2 : pnpm stripe:listen\n");
  process.exitCode = 0;
} else {
  console.log("Stripe checkout + webhook : variables présentes.");
  console.log("  → curl POST /api/checkout puis paiement test 4242… (voir docs/V2_SETUP.md)\n");
  process.exitCode = 0;
}
