import { Suspense } from "react";
import { NextTestContent } from "./next-test-content";

export default function NextTestPage() {
  return (
    <Suspense
      fallback={
        <div className="h-40 animate-pulse rounded-2xl bg-surface-elevated" />
      }
    >
      <NextTestContent />
    </Suspense>
  );
}
