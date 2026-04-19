"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

const VALID: Lang[] = ["en", "zh", "ja", "vi"];

export async function setLang(formData: FormData) {
  const raw = String(formData.get("lang") ?? "en");
  const lang = (VALID as string[]).includes(raw) ? (raw as Lang) : "en";
  const jar = await cookies();
  jar.set(LANG_COOKIE, lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
