import { z } from "zod";
import type { PremiumReportJsonV1 } from "@/lib/purchase/premium-report-json";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

const premiumReportJsonV1Schema = z.object({
  version: z.literal(1),
  productKey: z.enum(["bilan_9", "plan_19", "pack_29"]),
  snapshot: z.object({
    version: z.literal(1),
    savedAt: z.string(),
    profile: z.unknown(),
    performance: z.unknown(),
    result: z.unknown(),
  }),
});

export function parsePremiumReportJsonV1(
  raw: unknown,
): PremiumReportJsonV1 | null {
  const r = premiumReportJsonV1Schema.safeParse(raw);
  if (!r.success) return null;
  return {
    version: 1,
    productKey: r.data.productKey,
    snapshot: r.data.snapshot as ReportSnapshotV1,
  };
}
