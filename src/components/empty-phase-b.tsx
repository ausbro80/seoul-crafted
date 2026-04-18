import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function EmptyPhaseB({
  title,
  whatsNext,
}: {
  title: string;
  whatsNext: string[];
}) {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-row items-center gap-3">
        <Badge
          variant="secondary"
          className="bg-[var(--warn-soft)] text-[var(--warn)] hover:bg-[var(--warn-soft)]"
        >
          Phase B
        </Badge>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">
          This screen is scaffolded. Wiring up real data lands in the next phase:
        </p>
        <ul className="list-inside list-disc space-y-1 text-sm">
          {whatsNext.map((item) => (
            <li key={item} className="text-foreground/80">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
