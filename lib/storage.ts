"use client";

import type { PerformanceInput, UserProfile } from "@/lib/types";

const PROFILE_KEY = "ac_profile_v1";
const PERF_KEY = "ac_performance_v1";

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

export function loadPerformance(): PerformanceInput | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PERF_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PerformanceInput;
  } catch {
    return null;
  }
}

export function savePerformance(p: PerformanceInput) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERF_KEY, JSON.stringify(p));
}
