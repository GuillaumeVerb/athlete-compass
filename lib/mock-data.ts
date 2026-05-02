import type { PerformanceInput, UserProfile } from "@/lib/types";

export const DEMO_PROFILE: UserProfile = {
  age: 32,
  sex: "homme",
  heightCm: 178,
  weightKg: 78,
  waistCm: 84,
  goal: "crossfit",
  frequency: "4-5",
  equipment: [
    "rower",
    "bike",
    "kettlebells",
    "dumbbells",
    "barbell",
    "box",
  ],
  constraints: ["commercial_gym"],
};

export const DEMO_PERFORMANCE: PerformanceInput = {
  row1k: "03:32",
  row2k: "07:15",
  run5k: "24:20",
  pullups: 10,
  frontSquat5: 105,
  ohp5: 60,
  deadlift5: 140,
  burpees50: "08:45",
  farmerCarry: "40/35",
  hollowHold: "01:20",
};
