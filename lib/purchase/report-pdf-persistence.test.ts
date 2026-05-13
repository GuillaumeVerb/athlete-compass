import { describe, expect, it } from "vitest";
import { reportPdfStorageObjectPath } from "./report-pdf-persistence";

describe("reportPdfStorageObjectPath", () => {
  it("dérive un chemin stable par session Stripe", () => {
    expect(reportPdfStorageObjectPath("cs_test_abc")).toBe("cs_test_abc/rapport-aperçu-v1.pdf");
  });
});
