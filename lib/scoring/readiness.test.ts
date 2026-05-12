import { describe, expect, it } from "vitest";
import { MOCK_DAILY_WELLNESS } from "@/lib/mock/daily";
import { computeReadiness, type ReadinessInput } from "@/lib/scoring/readiness";

describe("computeReadiness", () => {
  it("donne un score borné 0–100 pour les données démo daily", () => {
    const r = computeReadiness(MOCK_DAILY_WELLNESS);
    expect(r.readinessScore).toBeGreaterThanOrEqual(0);
    expect(r.readinessScore).toBeLessThanOrEqual(100);
    expect(["excellent", "good", "moderate", "low", "very_low"]).toContain(r.status);
    expect(r.recommendedSessionType.length).toBeGreaterThan(0);
    expect(r.explanation.length).toBeGreaterThan(0);
  });

  it("sommeil court (< 6 h) → warning sommeil", () => {
    const input: ReadinessInput = {
      sleepHours: 5.5,
      sleepQuality: 3,
      fatigue: 4,
      soreness: 3,
      motivation: 6,
      previousDayIntensity: "moderate",
      weeklyTrainingLoad: "normal",
    };
    const r = computeReadiness(input);
    expect(r.readinessScore).toBeLessThan(65);
    expect(r.warningMessage).toMatch(/Sommeil court/i);
  });

  it("charge hebdo très haute + readiness moyen → warning redistribution", () => {
    const input: ReadinessInput = {
      sleepHours: 6.5,
      sleepQuality: 2,
      fatigue: 7,
      soreness: 4,
      motivation: 5,
      previousDayIntensity: "hard",
      weeklyTrainingLoad: "very_high",
    };
    const r = computeReadiness(input);
    expect(r.readinessScore).toBeLessThan(60);
    expect(r.warningMessage).toMatch(/Charge hebdomadaire/i);
  });

  it("fatigue et courbatures élevées → évitements ciblés", () => {
    const input: ReadinessInput = {
      sleepHours: 7,
      sleepQuality: 3,
      fatigue: 8,
      soreness: 7,
      motivation: 5,
      previousDayIntensity: "easy",
      weeklyTrainingLoad: "normal",
    };
    const r = computeReadiness(input);
    expect(r.avoidToday.some((x) => x.includes("Metcon"))).toBe(true);
    expect(r.avoidToday.some((x) => x.includes("Double séance"))).toBe(true);
  });

  it("bonne récupération → statut favorable et type push ou train_normal", () => {
    const input: ReadinessInput = {
      sleepHours: 8.5,
      sleepQuality: 5,
      fatigue: 2,
      soreness: 1,
      motivation: 8,
      restingHeartRate: 52,
      previousDayIntensity: "rest",
      weeklyTrainingLoad: "low",
    };
    const r = computeReadiness(input);
    expect(r.readinessScore).toBeGreaterThanOrEqual(68);
    expect(["excellent", "good"]).toContain(r.status);
    expect(["push", "train_normal"]).toContain(r.recommendationType);
  });

  it("peu de pas vs objectif → pénalité légère et consigne associée", () => {
    const base: ReadinessInput = {
      sleepHours: 7.5,
      sleepQuality: 4,
      fatigue: 3,
      soreness: 2,
      motivation: 6,
      previousDayIntensity: "moderate",
      weeklyTrainingLoad: "normal",
    };
    const without = computeReadiness(base);
    const withLowSteps = computeReadiness({
      ...base,
      stepsToday: 1500,
      stepsGoal: 10_000,
    });
    expect(withLowSteps.readinessScore).toBeLessThan(without.readinessScore);
    expect(withLowSteps.avoidToday.some((x) => x.includes("pas"))).toBe(true);
  });
});
