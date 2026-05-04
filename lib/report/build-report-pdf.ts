import { PDFDocument, StandardFonts, rgb, type PDFPage } from "pdf-lib";
import type { PurchaseProductKey } from "@/lib/future/cloud-types";
import { productKeyLabelFr } from "@/lib/purchase/product-key-label";
import type { ReportSnapshotV1 } from "@/lib/purchase/report-snapshot-types";

const PAGE_W = 595;
const PAGE_H = 842;
const M = 50;
const LINE = 14;
const MAX_W = 90;

function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length <= maxChars) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w.length > maxChars ? `${w.slice(0, maxChars - 1)}…` : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

/**
 * PDF synthétique (aperçu) — pas un document médical.
 */
export async function buildReportPdf(input: {
  productKey: PurchaseProductKey;
  snapshot: ReportSnapshotV1;
}): Promise<Uint8Array> {
  const { snapshot, productKey } = input;
  const { result, savedAt } = snapshot;

  const pdf = await PDFDocument.create();
  let currentPage: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = PAGE_H - M;
  const draw = (text: string, opts?: { bold?: boolean; size?: number }) => {
    const size = opts?.size ?? 11;
    const f = opts?.bold ? fontBold : font;
    for (const line of wrapWords(text, MAX_W)) {
      if (y < M + LINE) {
        currentPage = pdf.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - M;
      }
      currentPage.drawText(line, {
        x: M,
        y,
        size,
        font: f,
        color: rgb(0.12, 0.12, 0.12),
      });
      y -= size + 4;
    }
  };

  draw("Athlete Compass — Rapport (aperçu)", { bold: true, size: 16 });
  y -= 6;
  draw(`Offre : ${productKeyLabelFr(productKey)}`, { bold: true, size: 12 });
  draw(`Bilan figé le ${savedAt}`, { size: 10 });
  y -= 8;

  draw(`Hybrid Score : ${result.hybridScore} — ${result.hybridLabel}`, {
    bold: true,
    size: 12,
  });
  draw(`Âge athlétique : ${result.athleticAge} ans (âge réel ${result.realAge})`);
  draw(`Fiabilité du score : ${result.reliabilityPct} %`);
  draw(`Profil : ${result.profileLabel}`);
  draw(`Limiteur principal : ${result.limiter}`);
  draw(`Performance Gap : ${result.performanceGap}`);
  y -= 6;
  draw(`Next Best Move — ${result.nextBestMovePlan.title}`, { bold: true });
  draw(result.nextBestMovePlan.reason);
  draw(result.nextBestMovePlan.action);
  y -= 6;
  draw("Objectifs 4 semaines :", { bold: true });
  for (const g of result.goals4Weeks.slice(0, 6)) {
    draw(`• ${g}`);
  }
  y -= 12;
  draw(
    "Document informatif — ne remplace pas un avis médical ni un suivi individualisé. " +
      "Les exports PDF complets et l’historique cloud sont prévus en V2+.",
    { size: 9 },
  );

  return pdf.save();
}
