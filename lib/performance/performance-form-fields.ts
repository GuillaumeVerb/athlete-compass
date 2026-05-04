import type { PerformanceInput } from "@/lib/types";

export type PerformanceFormFieldType = "time" | "number" | "text";

export type PerformanceFormFieldMeta = {
  key: keyof PerformanceInput;
  title: string;
  unit: string;
  placeholder?: string;
  type: PerformanceFormFieldType;
};

/** Métadonnées des champs — même ordre que l’UI `/performances` (onglet Perf). */
export const PERFORMANCE_FORM_FIELDS: PerformanceFormFieldMeta[] = [
  {
    key: "row1k",
    title: "1 km rameur",
    unit: "mm:ss",
    placeholder: "03:32",
    type: "time",
  },
  {
    key: "row2k",
    title: "2 km rameur",
    unit: "mm:ss",
    placeholder: "07:15",
    type: "time",
  },
  {
    key: "run5k",
    title: "5 km course",
    unit: "mm:ss",
    placeholder: "24:20",
    type: "time",
  },
  {
    key: "pullups",
    title: "Tractions strictes",
    unit: "reps",
    type: "number",
  },
  {
    key: "frontSquat5",
    title: "Front squat ×5",
    unit: "kg",
    type: "number",
  },
  {
    key: "ohp5",
    title: "Développé militaire ×5",
    unit: "kg",
    type: "number",
  },
  {
    key: "deadlift5",
    title: "Deadlift ×5",
    unit: "kg",
    type: "number",
  },
  {
    key: "burpees50",
    title: "50 burpees",
    unit: "mm:ss",
    placeholder: "08:45",
    type: "time",
  },
  {
    key: "farmerCarry",
    title: "Farmer carry",
    unit: "m / s",
    placeholder: "40/35",
    type: "text",
  },
  {
    key: "hollowHold",
    title: "Hollow hold",
    unit: "mm:ss",
    placeholder: "01:20",
    type: "time",
  },
];
