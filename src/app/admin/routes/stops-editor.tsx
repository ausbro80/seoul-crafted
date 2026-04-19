import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { addStop, deleteStop, moveStop } from "./actions";

type Stop = {
  id: string;
  position: number;
  time_label: string | null;
  title: string;
  duration_min: number | null;
  note: string | null;
};

export function StopsEditor({
  routeId,
  stops,
}: {
  routeId: string;
  stops: Stop[];
}) {
  const sorted = stops.slice().sort((a, b) => a.position - b.position);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Itinerary stops</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No stops yet. Add the first one below.
          </p>
        ) : (
          <ol className="space-y-2">
            {sorted.map((s, i) => (
              <li
                key={s.id}
                className="flex items-start gap-2 rounded-lg border p-3"
              >
                <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-full border text-xs font-semibold">
                  {s.position}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium">{s.title}</div>
                    {s.time_label ? (
                      <span className="whitespace-nowrap text-xs text-muted-foreground">
                        {s.time_label}
                      </span>
                    ) : null}
                  </div>
                  {s.duration_min ? (
                    <div className="text-xs text-muted-foreground">
                      {s.duration_min} min
                    </div>
                  ) : null}
                  {s.note ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {s.note}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <form action={moveStop.bind(null, routeId, s.id, "up")}>
                    <Button
                      type="submit"
                      size="icon-sm"
                      variant="ghost"
                      disabled={i === 0}
                      aria-label="Move up"
                    >
                      <ChevronUp />
                    </Button>
                  </form>
                  <form action={moveStop.bind(null, routeId, s.id, "down")}>
                    <Button
                      type="submit"
                      size="icon-sm"
                      variant="ghost"
                      disabled={i === sorted.length - 1}
                      aria-label="Move down"
                    >
                      <ChevronDown />
                    </Button>
                  </form>
                  <form action={deleteStop.bind(null, routeId, s.id)}>
                    <Button
                      type="submit"
                      size="icon-sm"
                      variant="ghost"
                      className="text-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
                      aria-label="Delete"
                    >
                      <Trash2 />
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ol>
        )}

        <form
          action={addStop.bind(null, routeId)}
          className="grid grid-cols-1 gap-3 rounded-lg border border-dashed p-3 sm:grid-cols-4"
        >
          <div className="space-y-1 sm:col-span-2">
            <Label htmlFor={`title-${routeId}`} className="text-xs">
              Title
            </Label>
            <Input
              id={`title-${routeId}`}
              name="title"
              required
              placeholder="Bukchon Hanok village"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`time-${routeId}`} className="text-xs">
              Time
            </Label>
            <Input
              id={`time-${routeId}`}
              name="time_label"
              placeholder="9:30"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor={`dur-${routeId}`} className="text-xs">
              Duration (min)
            </Label>
            <Input
              id={`dur-${routeId}`}
              name="duration_min"
              type="number"
              step="5"
              min="5"
              placeholder="45"
            />
          </div>
          <div className="space-y-1 sm:col-span-4">
            <Label htmlFor={`note-${routeId}`} className="text-xs">
              Note
            </Label>
            <Input
              id={`note-${routeId}`}
              name="note"
              placeholder="Meet at the main gate. Shoes off at the teahouse."
            />
          </div>
          <div className="sm:col-span-4">
            <Button type="submit" size="sm">
              Add stop
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
