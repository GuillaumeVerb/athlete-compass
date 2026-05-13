import type { PurchaseReceiptLine } from "@/lib/purchase/fetch-purchase-receipt-line";
import { productKeyLabelFr } from "@/lib/purchase/product-key-label";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";

function formatPaidAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function formatCookieUntil(expUnix: number): string {
  return new Date(expUnix * 1000).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(cents: number, currency: string): string {
  const cur = currency.trim().toUpperCase() || "EUR";
  try {
    return (cents / 100).toLocaleString("fr-FR", {
      style: "currency",
      currency: cur,
      minimumFractionDigits: 2,
    });
  } catch {
    return `${(cents / 100).toFixed(2)} ${cur}`;
  }
}

/** Historique minimal « dernier achat » (cookie + optionnellement ligne `purchases`). */
export function ReportLastPurchaseSummary({
  cookieProductKey,
  cookieExpUnix,
  receipt,
}: {
  cookieProductKey: PurchaseProductKey;
  cookieExpUnix: number;
  receipt: PurchaseReceiptLine | null;
}) {
  const labelFromCookie = productKeyLabelFr(cookieProductKey);
  const labelFromDb = receipt ? productKeyLabelFr(receipt.productKey) : null;
  const productMismatch =
    receipt && receipt.productKey !== cookieProductKey ? true : false;

  return (
    <section
      className="rounded-2xl border border-border bg-surface/35 px-4 py-3 text-sm"
      aria-labelledby="report-last-purchase-heading"
    >
      <h2
        id="report-last-purchase-heading"
        className="text-xs font-semibold uppercase tracking-[0.16em] text-muted"
      >
        Dernier achat
      </h2>
      <p className="mt-2 leading-relaxed text-foreground/95">
        <strong className="font-medium text-foreground">{labelFromCookie}</strong>
        {receipt ? (
          <>
            {" "}
            · {formatMoney(receipt.amountCents, receipt.currency)}
            {productMismatch ? (
              <span className="text-muted">
                {" "}
                (offre en base : {labelFromDb})
              </span>
            ) : null}
            <span className="text-muted"> · payé le {formatPaidAt(receipt.createdAt)}</span>
          </>
        ) : (
          <span className="text-muted">
            {" "}
            — détail caisse non affiché (base indisponible ou session sans persistance).
          </span>
        )}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        Accès à ce rapport dans <strong className="font-medium text-foreground/85">ce navigateur</strong>{" "}
        jusqu&apos;au {formatCookieUntil(cookieExpUnix)} (cookie sécurisé).
      </p>
    </section>
  );
}
