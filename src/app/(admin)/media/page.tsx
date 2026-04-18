import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/page-shell";
import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "./upload-form";
import { CopyUrlButton } from "./media-copy-button";
import { deleteMedia } from "./actions";

export const dynamic = "force-dynamic";

type MediaRow = {
  id: string;
  path: string;
  filename: string;
  mime: string | null;
  size_bytes: number | null;
  uploaded_by: string | null;
  created_at: string;
};

function formatSize(bytes: number | null) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaPage() {
  const supabase = await createClient();
  const { data: media, error } = await supabase
    .from("media")
    .select("id, path, filename, mime, size_bytes, uploaded_by, created_at")
    .order("created_at", { ascending: false })
    .returns<MediaRow[]>();

  const withUrls = (media ?? []).map((m) => ({
    ...m,
    url: supabase.storage.from("media").getPublicUrl(m.path).data.publicUrl,
  }));

  return (
    <PageShell
      title="Media library"
      description="Upload route hero images, guide photos, marketing assets. Paste the URL into a Route's Hero image field."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>

      {error ? (
        <Card className="border-[var(--brand)] bg-[var(--brand-soft)]">
          <CardContent className="py-4 text-sm text-[var(--brand)]">
            Failed to load media: {error.message}
          </CardContent>
        </Card>
      ) : withUrls.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No media yet. Upload an image above to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {withUrls.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div
                className="aspect-square w-full bg-muted"
                style={{
                  backgroundImage: `url(${m.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <CardContent className="space-y-2 p-3">
                <div className="truncate text-xs font-medium" title={m.filename}>
                  {m.filename}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatSize(m.size_bytes)}</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CopyUrlButton url={m.url} />
                  <form action={deleteMedia.bind(null, m.id, m.path)}>
                    <Button
                      type="submit"
                      size="sm"
                      variant="ghost"
                      className="text-[var(--brand)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand)]"
                    >
                      Delete
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
