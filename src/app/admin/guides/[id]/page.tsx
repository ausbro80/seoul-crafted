import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { GuideForm } from "../guide-form";
import { updateGuide, deleteGuide } from "../actions";
import { createClient } from "@/lib/supabase/server";

type GuideRow = {
  id: string;
  name: string;
  photo_url: string | null;
  bio: string | null;
  languages: string[] | null;
  active: boolean;
  rating: number | null;
};

export default async function EditGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: guide } = await supabase
    .from("guides")
    .select("id, name, photo_url, bio, languages, active, rating")
    .eq("id", id)
    .maybeSingle<GuideRow>();

  if (!guide) notFound();

  const bound = updateGuide.bind(null, guide.id);

  return (
    <PageShell
      title={guide.name}
      description={guide.active ? "Active guide" : "Inactive"}
      actions={
        <form action={deleteGuide.bind(null, guide.id)}>
          <Button
            type="submit"
            variant="ghost"
            className="text-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
          >
            Delete
          </Button>
        </form>
      }
    >
      <GuideForm
        action={bound}
        submitLabel="Save changes"
        defaults={{
          name: guide.name,
          photo_url: guide.photo_url,
          bio: guide.bio,
          languages: guide.languages ?? [],
          active: guide.active,
          rating: guide.rating,
        }}
      />
    </PageShell>
  );
}
