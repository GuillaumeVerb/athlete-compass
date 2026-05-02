import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GoalsFourWeeksCard({ items }: { items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pistes sur 4 semaines</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2.5 pl-4 text-sm leading-relaxed text-muted">
          {items.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
