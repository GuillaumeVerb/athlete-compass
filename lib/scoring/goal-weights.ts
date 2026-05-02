import type { PrimaryGoal, ScoreBreakdown } from "@/lib/types";

export type PillarKey = keyof ScoreBreakdown;

/** Pondérations par objectif — prompt 03 (normalisées sur piliers présents) */
export function goalPillarWeights(goal: PrimaryGoal): Record<PillarKey, number> {
  switch (goal) {
    case "crossfit":
      return {
        force: 0.3,
        cardioIntense: 0.25,
        muscularEndurance: 0.2,
        endurance: 0.15,
        coreCarry: 0.1,
      };
    case "hyrox":
      return {
        endurance: 0.3,
        cardioIntense: 0.25,
        muscularEndurance: 0.25,
        force: 0.1,
        coreCarry: 0.1,
      };
    case "recomp":
      return {
        force: 0.3,
        muscularEndurance: 0.25,
        endurance: 0.2,
        cardioIntense: 0.15,
        coreCarry: 0.1,
      };
    case "endurance":
      return {
        endurance: 0.4,
        cardioIntense: 0.2,
        force: 0.15,
        muscularEndurance: 0.15,
        coreCarry: 0.1,
      };
    case "strength_aesthetics":
      return {
        force: 0.45,
        coreCarry: 0.15,
        cardioIntense: 0.15,
        muscularEndurance: 0.15,
        endurance: 0.1,
      };
    default:
      return {
        force: 0.2,
        cardioIntense: 0.2,
        endurance: 0.2,
        muscularEndurance: 0.2,
        coreCarry: 0.2,
      };
  }
}
