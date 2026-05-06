import { Suspense } from "react";
import { BilansClient } from "./bilans-client";

function BilansFallback() {
  return (
    <div className="animate-pulse space-y-8 pb-24 lg:pb-10">
      <div className="h-9 w-48 rounded-lg bg-surface-elevated" />
      <div className="h-32 max-w-2xl rounded-2xl bg-surface-elevated/80" />
      <div className="h-64 rounded-2xl bg-surface-elevated/80" />
    </div>
  );
}

export default function BilansPage() {
  return (
    <Suspense fallback={<BilansFallback />}>
      <BilansClient />
    </Suspense>
  );
}
