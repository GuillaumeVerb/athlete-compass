import type {
  AthleticProfileId,
  PerformanceInput,
  ScoreBreakdown,
  ScoreResult,
  UserProfile,
} from "@/lib/types";
import { TEST_PROTOCOLS } from "@/lib/tests/test-protocols";
import { estimateAthleticAge } from "./athletic-age";
import { cardioIntenseFromRow1k } from "./cardio";
import { coreCarryScore } from "./core-carry";
import { enduranceScore } from "./endurance";
import { forceScore } from "./force";
import { weightedHybridScore } from "./hybrid-score";
import { muscularEnduranceScore } from "./muscular-endurance";
import {
  computeNextBestMovePlan,
  computeNextBestMoveSummary,
} from "./next-best-move";
import { computePerformanceGap } from "./performance-gap";
import {
  pickProfile,
  profileDescription,
  profileLabel,
} from "./profiles";
import {
  computeReliabilityPct,
  listMissingTestKeys,
} from "./reliability";
import { qualityLabelFr, scoreToQuality } from "./utils";

function pillarName(key: keyof ScoreBreakdown): string {
  switch (key) {
    case "cardioIntense":
      return "Cardio intense";
    case "endurance":
      return "Endurance";
    case "force":
      return "Force";
    case "muscularEndurance":
      return "Résistance musculaire";
    case "coreCarry":
      return "Core & carry";
    default:
      return "";
  }
}

function pickLimiter(b: ScoreBreakdown): {
  key: keyof ScoreBreakdown;
  v: number;
} {
  const entries = (Object.keys(b) as (keyof ScoreBreakdown)[]).map((k) => ({
    key: k,
    v: b[k],
  }));
  const withData = entries.filter((e) => e.v != null) as {
    key: keyof ScoreBreakdown;
    v: number;
  }[];
  if (withData.length === 0) return { key: "endurance", v: 0 };
  return withData.reduce((a, c) => (c.v < a.v ? c : a));
}

function pickNextTest(perf: PerformanceInput, b: ScoreBreakdown): {
  id: string;
  label: string;
} {
  const missing = listMissingTestKeys(perf);
  if (missing.length > 0) {
    const id = missing[0];
    return { id, label: TEST_PROTOCOLS[id].title };
  }
  if ((b.cardioIntense ?? 0) >= 65) {
    return { id: "row2k", label: TEST_PROTOCOLS.row2k.title };
  }
  return { id: "row1k", label: TEST_PROTOCOLS.row1k.title };
}

function goals4Weeks(
  limiterKey: keyof ScoreBreakdown,
  profileId: AthleticProfileId,
): string[] {
  const g: string[] = [
    "Stabiliser 3 séances qualité / semaine minimum.",
    "Tracer 1 indicateur simple (rameur, burpees, force) à retester J+21.",
  ];
  if (profileId === "strength_gap") {
    g.push("Bloc force : squat + tirage 2× / semaine avec journal de charges.");
  }
  if (profileId === "endurance_gap") {
    g.push("Volume Z2 : +10–15 % sur 2 semaines si sommeil et RPE le permettent.");
  }
  if (profileId === "muscular_endurance_gap") {
    g.push("Circuit reps 10–12 min 2× / semaine (burpees, tirage, push).");
  }
  if (limiterKey === "endurance" || limiterKey === "cardioIntense") {
    g.push("Ajouter 1 sortie longue facile (respiration, allure stable).");
  }
  if (limiterKey === "force") {
    g.push("Progression charge : +2,5 % sur lifts prioritaires sur 2 semaines.");
  }
  return g;
}

export function computeScoreResult(
  profile: UserProfile,
  perf: PerformanceInput,
): ScoreResult {
  const breakdown: ScoreBreakdown = {
    cardioIntense: cardioIntenseFromRow1k(perf.row1k, profile.sex),
    endurance: enduranceScore(perf, profile.sex),
    force: forceScore({
      weightKg: profile.weightKg,
      sex: profile.sex,
      frontSquat5: perf.frontSquat5,
      ohp5: perf.ohp5,
      deadlift5: perf.deadlift5,
    }),
    muscularEndurance: muscularEnduranceScore(perf, profile.sex),
    coreCarry: coreCarryScore(perf, profile.sex),
  };

  const hybridScore = weightedHybridScore(breakdown, profile.goal);
  const reliabilityPct = computeReliabilityPct(perf);
  const athleticAge = estimateAthleticAge(profile.age, hybridScore);
  const profileId = pickProfile(breakdown);
  const { key: limiterKey, v: limiterVal } = pickLimiter(breakdown);
  const limiter = `${pillarName(limiterKey)} (${limiterVal}/100)`;
  const performanceGap = computePerformanceGap(hybridScore, profile.goal);
  const next = pickNextTest(perf, breakdown);
  const q = scoreToQuality(hybridScore);
  const plan = computeNextBestMovePlan(limiterKey, profileId, perf);

  return {
    hybridScore,
    hybridLabel: qualityLabelFr(q),
    reliabilityPct,
    athleticAge,
    realAge: profile.age,
    athleticDelta: athleticAge - profile.age,
    breakdown,
    profileId,
    profileLabel: profileLabel(profileId),
    profileDescription: profileDescription(profileId),
    limiter,
    performanceGap,
    nextBestMove: computeNextBestMoveSummary(limiterKey, profileId, perf),
    nextBestMovePlan: plan,
    nextTestId: next.id,
    nextTestLabel: next.label,
    goals4Weeks: goals4Weeks(limiterKey, profileId),
  };
}

export { listMissingTestTitles, listMissingTestKeys } from "./reliability";
