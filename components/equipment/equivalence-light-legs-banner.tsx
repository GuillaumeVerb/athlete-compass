"use client";

import { useEffect, useState } from "react";
import { loadProfile } from "@/lib/storage";
import type { UserProfile } from "@/lib/types";

export function EquivalenceLightLegsBanner() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  const active = profile?.constraints?.includes("light_legs");
  if (!active) return null;

  return (
    <div className="rounded-2xl border border-[#f5b942]/40 bg-[#f5b942]/[0.09] p-4 text-sm text-[#e8eaf0]">
      <p className="font-medium text-[#f5b942]">Contrainte active : moins de cuisses</p>
      <p className="mt-2 text-[#c5cad8] leading-relaxed">
        Les cartes surlignées rappellent des options généralement plus digestes
        pour les quadriceps. Ajuste toujours selon ta sensation du jour.
      </p>
    </div>
  );
}
