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

/**
 * Charges / contexte optionnels pour certains tests chronométrés ou portages.
 * Sert à comparer des retests honnêtement ; **non utilisé** dans le calcul du score.
 */
export interface PerformanceLoadNotes {
  /** Wall ball ×150 — masse du ballon (kg). */
  wallBall150Kg?: number;
  /** Chipper thrusters DB — somme des deux haltères (kg), ex. 45 si 22,5 + 22,5. */
  hybridDbChipperDbTotalKg?: number;
  /** 100 KB swings — poids de la kettlebell (kg). */
  kbSwing100Kg?: number;
  farmerCarryKg?: number;
  sandbagCarryKg?: number;
  sledCarryKg?: number;
}

export interface PerformanceInput {
  row1k?: string;
  /** 500 m SkiErg — mm:ss (cardio intense, croisé avec 1 km rameur). */
  skiErg500?: string;
  /** 400 m piste — mm:ss (cardio intense / vitesse). */
  run400m?: string;
  row2k?: string;
  run5k?: string;
  /** 10 km course — mm:ss (endurance). */
  run10k?: string;
  /** 1000 m tapis incliné (ex. 2 %) — mm:ss (endurance). */
  run1kIncline?: string;
  /** 1000 m BikeErg — mm:ss (endurance / moteur). */
  bikeErg1k?: string;
  /** 2000 m BikeErg — mm:ss. */
  bikeErg2k?: string;
  /** 2000 m SkiErg — mm:ss. */
  skiErg2k?: string;
  pullups?: number;
  /** Dips parallèles stricts — reps max sur un set. */
  dipsStrict?: number;
  /** Toes-to-bar stricts — reps max sur un set (résistance musculaire). */
  toesToBar?: number;
  /** Wall ball ×150 (charges standardisées au protocole) — mm:ss. */
  wallBall150?: string;
  /** 100 air squats — mm:ss. */
  airSquat100?: string;
  /** Montées de corde strictes en 2 min — reps. */
  ropeClimb2min?: number;
  /** Double-unders en 1 min — reps. */
  doubleUnders1min?: number;
  /** Pompes strictes — reps max sur un set. */
  pushupsStrict?: number;
  /** Fentes alternées sans charge : pas en 2 min — reps (1 pas = 1 fente). */
  lunges2min?: number;
  /**
   * Chipper chronométré : 30 DB thrusters + 30 burpees + 150 DU
   * (charges au protocole) — mm:ss.
   */
  hybridDbChipper?: string;
  frontSquat5?: number;
  /** Back squat ×3 — kg (force jambes). */
  backSquat3?: number;
  /** Développé militaire strict debout — barre, ×5 (kg). */
  ohp5?: number;
  /** Rowing T-bar (machine) — charge en kg pour 10 reps strictes. */
  tbarRow10?: number;
  deadlift5?: number;
  burpees50?: string;
  farmerCarry?: string;
  /** Sandbag carry — m/s comme farmer (ex. 40/45). */
  sandbagCarry?: string;
  /** Sled push ou pull 50 m — m/s (ex. 50/55). */
  sledCarry?: string;
  hollowHold?: string;
  /** L-sit parallèles — mm:ss. */
  lSitHold?: string;
  /** Développé couché ×5 — kg (barre). */
  benchPress5?: number;
  /** HSPU stricts — reps max sur un set (mur). */
  hspuStrict?: number;
  /** Muscle-ups stricts (barre ou anneaux) — reps en 2 min. */
  muscleUp2min?: number;
  /** Assault / Echo Bike — calories en 1 minute. */
  echoBikeCal1min?: number;
  /** Echo Bike — temps pour 10 calories (mm:ss). */
  echoBike10cal?: string;
  /** Echo Bike — temps pour 30 calories (mm:ss). */
  echoBike30cal?: string;
  /** Bulgarian split squat — somme des deux haltères (kg) pour 8 reps par jambe. */
  bulgarianSplitSquat8?: number;
  /** Box jump — hauteur max propre (cm). */
  boxJumpMaxCm?: number;
  /** 400 m piscine — mm:ss. */
  swim400m?: string;
  /** 100 kettlebell swings (american) — mm:ss, poids au protocole. */
  kbSwing100?: string;
  loadNotes?: PerformanceLoadNotes;
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
