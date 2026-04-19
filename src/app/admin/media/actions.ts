"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MediaUploadState = {
  ok?: boolean;
  error?: string;
  uploaded?: number;
};

function sanitizeName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function probeDimensions(_bytes: ArrayBuffer) {
  // Placeholder — actual probing would use sharp/image-size. Leave null for now.
  return { width: null, height: null };
}

export async function uploadMedia(
  _prev: MediaUploadState | undefined,
  formData: FormData,
): Promise<MediaUploadState> {
  const files = formData.getAll("files").filter((f) => f instanceof File) as File[];
  if (files.length === 0) return { ok: false, error: "Pick one or more files to upload." };

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let uploaded = 0;
  for (const file of files) {
    if (file.size === 0) continue;
    const bytes = await file.arrayBuffer();
    const stamp = Date.now();
    const safe = sanitizeName(file.name) || `upload-${stamp}`;
    const path = `${stamp}-${safe}`;

    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });
    if (upErr) return { ok: false, error: upErr.message, uploaded };

    const { width, height } = await probeDimensions(bytes);
    const { error: insErr } = await supabase.from("media").insert({
      path,
      filename: file.name,
      mime: file.type || null,
      size_bytes: file.size,
      width,
      height,
      uploaded_by: user?.email ?? null,
    });
    if (insErr) {
      await supabase.storage.from("media").remove([path]);
      return { ok: false, error: insErr.message, uploaded };
    }
    uploaded += 1;
  }

  revalidatePath("/admin/media");
  return { ok: true, uploaded };
}

export async function deleteMedia(id: string, path: string, _formData: FormData) {
  const supabase = await createClient();
  const { error: rmErr } = await supabase.storage.from("media").remove([path]);
  if (rmErr) throw new Error(rmErr.message);
  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/media");
}
