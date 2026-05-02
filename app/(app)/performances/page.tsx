import { PerformanceForm } from "@/components/forms/performance-form";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function PerformancesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-3xl font-semibold text-white tracking-tight">
          Performances
        </h1>
        <p className="text-[#9aa3b8] mt-2 max-w-2xl">
          Saisis les tests que tu as réellement passés. Les champs vides
          diminuent la fiabilité du score mais restent autorisés.
        </p>
      </div>
      <PerformanceForm initial={null} />
      <MedicalDisclaimer />
    </div>
  );
}
