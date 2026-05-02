export type Sex = "homme" | "femme" | "autre";

export type TrainingFrequency =
  | "1-2"
  | "3"
  | "4-5"
  | "6+";

export type PrimaryGoal =
  | "crossfit"
  | "hyrox"
  | "recomp"
  | "endurance"
  | "strength_aesthetics";

export type EquipmentKey =
  | "rower"
  | "skierg"
  | "bike"
  | "incline_treadmill"
  | "kettlebells"
  | "dumbbells"
  | "barbell"
  | "sled"
  | "box"
  | "cable";

export type ConstraintKey =
  | "no_running"
  | "light_legs"
  | "3_days_max"
  | "short_sessions"
  | "commercial_gym";

export interface UserProfile {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  goal: PrimaryGoal;
  frequency: TrainingFrequency;
  equipment: EquipmentKey[];
  constraints: ConstraintKey[];
}

export interface PerformanceInput {
  row1k?: string;
  row2k?: string;
  run5k?: string;
  pullups?: number;
  frontSquat5?: number;
  ohp5?: number;
  deadlift5?: number;
  burpees50?: string;
  farmerCarry?: string;
  hollowHold?: string;
}

export type AthleticProfileId =
  | "moteur_court"
  | "strong_slow"
  | "diesel"
  | "crossfit_build"
  | "hyrox_ready"
  | "balanced_hybrid"
  | "under_recovered"
  | "strength_gap"
  | "endurance_gap"
  | "muscular_endurance_gap";

export interface ScoreBreakdown {
  cardioIntense: number | null;
  endurance: number | null;
  force: number | null;
  muscularEndurance: number | null;
  coreCarry: number | null;
}

export interface NextBestMovePlan {
  title: string;
  reason: string;
  action: string;
  frequency: string;
  impact: string;
}

export interface ScoreResult {
  hybridScore: number;
  hybridLabel: string;
  reliabilityPct: number;
  athleticAge: number;
  realAge: number;
  athleticDelta: number;
  breakdown: ScoreBreakdown;
  profileId: AthleticProfileId;
  profileLabel: string;
  profileDescription: string;
  limiter: string;
  performanceGap: number;
  nextBestMove: string;
  nextBestMovePlan: NextBestMovePlan;
  nextTestId: string;
  nextTestLabel: string;
  goals4Weeks: string[];
}
