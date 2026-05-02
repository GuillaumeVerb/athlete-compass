import { Suspense } from "react";
import { NextTestContent } from "./next-test-content";

export default function NextTestPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse h-40 rounded-2xl bg-[#181c26]" />
      }
    >
      <NextTestContent />
    </Suspense>
  );
}
