import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LimiterCard({ text }: { text: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Limiteur principal</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-foreground/95">{text}</p>
      </CardContent>
    </Card>
  );
}
