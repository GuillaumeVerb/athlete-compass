import type { PerformanceTestKey } from "@/lib/tests/test-protocols";

export type SessionKind =
  | "force_upper"
  | "force_lower"
  | "zone2"
  | "metcon_short"
  | "hybrid_core"
  | "test_retest"
  | "recovery_active";

export interface PlanSessionExercise {
  name: string;
  prescription: string;
  cue?: string;
}

export interface PlanSessionBlock {
  label: string;
  exercises: PlanSessionExercise[];
}

export interface PlanSession {
  title: string;
  tags: string[];
  kind: SessionKind;
  durationMin: number;
  sessionObjective: string;
  blocks: PlanSessionBlock[];
  shortVersion: string;
  substitution?: string;
  /** Champs `/performances` à saisir en lien avec cette séance. */
  relatedPerformanceKeys?: PerformanceTestKey[];
}

export interface PlanWeek {
  week: number;
  weekTheme: string;
  objective: string;
  objectiveChecks: string[];
  focus: string;
  coherencePct: number;
  sessions: PlanSession[];
}
