"use client";

import { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function filenameFromContentDisposition(header: string | null): string | null {
  if (!header) return null;
  const m = /filename\*?=(?:UTF-8''|")?([^";\n]+)"?/i.exec(header);
  const raw = m?.[1]?.trim();
  if (!raw) return null;
  try {
    return decodeURIComponent(raw.replace(/"/g, ""));
  } catch {
    return raw.replace(/"/g, "");
  }
}

export function ReportPdfDownloadButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/report/pdf", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });
      const type = res.headers.get("Content-Type") ?? "";
      if (!res.ok) {
        const text = await res.text();
        setError(text.trim() || `Erreur ${res.status}`);
        return;
      }
      if (!type.includes("pdf")) {
        const text = await res.text();
        setError(text.trim() || "Réponse inattendue (pas un PDF).");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        filenameFromContentDisposition(res.headers.get("Content-Disposition")) ??
        "rapport-athlete-compass-aperçu.pdf";
      a.rel = "noopener";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Téléchargement impossible.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <span className="mt-2 block">
      <Button
        type="button"
        variant="ghost"
        className="h-auto min-h-0 justify-start p-0 font-medium text-neon underline hover:bg-transparent hover:text-neon"
        disabled={loading}
        onClick={onClick}
      >
        {loading ? (
          <>
            <Loader2 className="mr-1 inline size-4 animate-spin" aria-hidden />
            Préparation du PDF…
          </>
        ) : (
          "Télécharger un PDF (aperçu)"
        )}
      </Button>{" "}
      — extrait du bilan serveur (informatif, pas un document médical).
      {error ? (
        <span className="mt-2 block rounded-lg border border-destructive/40 bg-destructive/10 px-2 py-1.5 text-xs text-foreground/95">
          {error}
        </span>
      ) : null}
    </span>
  );
}
