import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

/** JSON stocké dans `premium_reports.report_json` (V2). */
export type PremiumReportJsonV1 = {
  version: 1;
  productKey: PurchaseProductKey;
  snapshot: ReportSnapshotV1;
};

export function buildPremiumReportJsonV1(
  productKey: PurchaseProductKey,
  snapshot: ReportSnapshotV1,
): PremiumReportJsonV1 {
  return { version: 1, productKey, snapshot };
}
