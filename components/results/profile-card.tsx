import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ton profil</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-display text-xl font-semibold text-neon">
          {title}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}
