import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function LimiterCard({ text }: { text: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limiteur principal</CardTitle>
        <CardDescription>
          Ce qui freine le plus ton profil hybride sur les tests renseignés —
          orientation d&apos;entraînement, pas diagnostic médical.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/95">{text}</p>
      </CardContent>
    </Card>
  );
}
