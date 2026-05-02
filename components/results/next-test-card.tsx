import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NextTestCard({
  testLabel,
  queryTest,
}: {
  testLabel: string;
  queryTest?: string;
}) {
  const href =
    queryTest != null
      ? `/next-test?test=${encodeURIComponent(queryTest)}`
      : "/next-test";
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prochain test recommandé</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-display text-lg font-semibold text-foreground">
          {testLabel}
        </p>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href={href}>Voir pourquoi</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
