"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type TeamFormState = {
  ok?: boolean;
  error?: string;
};

export async function addAdmin(
  _prev: TeamFormState | undefined,
  formData: FormData,
): Promise<TeamFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Enter a valid email." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("admins")
    .upsert({ email, name }, { onConflict: "email" });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/team");
  return { ok: true };
}

export async function removeAdmin(email: string, _formData: FormData) {
  // Don't let an admin remove themselves.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || user.email === email) {
    throw new Error("You can't remove yourself.");
  }

  const { error } = await supabase.from("admins").delete().eq("email", email);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/team");
}
