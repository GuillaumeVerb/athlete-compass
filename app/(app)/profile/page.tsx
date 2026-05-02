import { ProfileForm } from "@/components/forms/profile-form";
import { MedicalDisclaimer } from "@/components/disclaimer";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-display text-3xl font-semibold text-foreground tracking-tight">
          Profil athlète
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Ces informations servent à contextualiser tes performances et les
          scores relatifs (notamment la force / poids de corps).
        </p>
      </div>
      <ProfileForm initial={null} />
      <MedicalDisclaimer />
    </div>
  );
}
