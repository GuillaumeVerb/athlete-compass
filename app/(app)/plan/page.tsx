import { WeekPlan } from "@/components/plan/week-plan";
import { generateFourWeekPlan } from "@/lib/plans/generate-plan";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function PlanPage() {
  const weeks = generateFourWeekPlan();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-3xl font-semibold text-white">
          Plan 4 semaines
        </h1>
        <p className="text-[#9aa3b8] mt-2 max-w-2xl">
          Structure type pour un athlète hybride — à personnaliser selon ton
          limiteur (version démo).
        </p>
      </div>
      <WeekPlan weeks={weeks} />
      <MedicalDisclaimer />
    </div>
  );
}
