/**
 * Contrats TypeScript pour la persistance cloud (V2+).
 * La V1 n’importe pas Supabase : ces types documentent la cible commune API / DB.
 */

import type { PlanWeek } from "@/lib/plans/generate-plan";
import type {
  NextBestMovePlan,
  PerformanceInput,
  ScoreBreakdown,
  UserProfile,
} from "@/lib/types";

// Ré-export des types métier déjà canoniques côté app.
export type { PerformanceInput, ScoreBreakdown, UserProfile };

/** Origine du bilan — analytics & filtre historique (V3). */
export type AssessmentSource = "manual" | "retest_30d" | "import";

/** Bilan persisté = snapshot du résultat moteur + lien utilisateur. */
export interface Assessment {
  id: string;
  userId: string;
  profileId: string | null;
  createdAt: string;
  hybridScore: number;
  athleticAge: number;
  reliabilityPct: number;
  profileLabel: string;
  limiter: string;
  nextBestMovePlan: NextBestMovePlan;
  breakdown: ScoreBreakdown;
  goals4Weeks: string[];
  performanceSnapshot: PerformanceInput;
  /** V3 : chaîne avant/après et segmentation retest. */
  source?: AssessmentSource;
  previousAssessmentId?: string | null;
}

/** Rapport premium : JSON servi à l’UI + PDF optionnel. */
export interface PremiumReport {
  id: string;
  userId: string;
  assessmentId: string;
  status: "draft" | "ready" | "failed";
  createdAt: string;
  /** Sections détaillées : Performance Gap, limiteur long, etc. */
  reportJson: Record<string, unknown>;
  pdfUrl: string | null;
}

/** Plan 4 semaines sérialisable (même forme que la génération locale). */
export type Plan4Weeks = {
  weeks: PlanWeek[];
  generatedAt: string;
  assessmentId: string;
};

export type PurchaseProductKey = "bilan_9" | "plan_19" | "pack_29";

export type PurchaseStatus = "pending" | "paid" | "refunded";

export interface Purchase {
  id: string;
  userId: string | null;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  productKey: PurchaseProductKey;
  amountCents: number;
  currency: string;
  status: PurchaseStatus;
  createdAt: string;
}

/** Ligne liste « Mes bilans » sans tout le JSON breakdown (V3). */
export interface AssessmentListItem {
  id: string;
  createdAt: string;
  hybridScore: number;
  athleticAge: number;
  reliabilityPct: number;
  profileLabel: string;
  limiter: string;
  source?: AssessmentSource;
  previousAssessmentId?: string | null;
}

/** Delta affiché comparateur avant → après (V3). */
export interface AssessmentCompareDelta {
  hybridScoreDelta: number;
  athleticAgeDelta: number;
  reliabilityPctDelta: number;
  limiterChanged: boolean;
  fromAssessmentId: string;
  toAssessmentId: string;
}

/** Feedback fin de semaine pour adaptation plan (V4). */
export type PlanWeekFatigue = "low" | "ok" | "high";

export interface PlanWeekFeedback {
  id: string;
  planInstanceId: string;
  weekIndex: number;
  fatigue: PlanWeekFatigue;
  sessionsCompletedCount?: number;
  note: string | null;
  createdAt: string;
}

/** Traçabilité régénération plan (V4). */
export type PlanAdaptationReason =
  | "profile_change"
  | "weekly_feedback"
  | "manual_regen";

export interface PlanAdaptationEvent {
  id: string;
  fromPlanInstanceId: string | null;
  toPlanInstanceId: string;
  reason: PlanAdaptationReason;
  payload: Record<string, unknown> | null;
  createdAt: string;
}
