"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "@/lib/supabase/server";

const TRAVELER_COOKIE = "seoul_crafted_email";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getTravelerEmail(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(TRAVELER_COOKIE)?.value ?? null;
}

export type BookingFormState = {
  ok?: boolean;
  error?: string;
};

export async function createCuratedBooking(
  _prev: BookingFormState | undefined,
  formData: FormData,
): Promise<BookingFormState> {
  const routeSlug = String(formData.get("route") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  const date = String(formData.get("date") ?? "").trim() || null;
  const people = Number(formData.get("people") ?? 1);

  if (!email || !email.includes("@")) return { ok: false, error: "Enter a valid email." };
  if (!routeSlug) return { ok: false, error: "Route missing." };
  if (people < 1 || people > 6) return { ok: false, error: "Group size 1–6." };

  // Use public client for the route lookup (anonymous, but routes table
  // has a public-read RLS policy for published rows).
  const supabase = await createClient();
  const { data: route, error: routeErr } = await supabase
    .from("routes")
    .select("id, price_cents")
    .eq("slug", routeSlug)
    .eq("published", true)
    .maybeSingle();
  if (routeErr || !route) return { ok: false, error: "Route not found." };

  // Customer writes go through the service-role client (RLS would otherwise
  // block anon INSERTs).
  const admin = await createAdminClient();
  const { error } = await admin.from("bookings").insert({
    customer_email: email,
    customer_name: name,
    route_id: route.id,
    booking_date: date,
    people,
    status: "pending",
    price_cents: route.price_cents * people,
  });
  if (error) return { ok: false, error: error.message };

  const jar = await cookies();
  jar.set(TRAVELER_COOKIE, email, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });

  revalidatePath("/trips");
  redirect("/trips?new=1");
}

export async function createCustomIntake(
  _prev: BookingFormState | undefined,
  formData: FormData,
): Promise<BookingFormState> {
  const mode = String(formData.get("mode") ?? "guided");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim() || null;
  const date = String(formData.get("date") ?? "").trim() || null;
  const people = Number(formData.get("people") ?? 1);
  const pace = String(formData.get("pace") ?? "balanced");
  const interests = formData.getAll("interests").map(String);

  if (!email || !email.includes("@")) return { ok: false, error: "Enter a valid email." };
  if (people < 1 || people > 6) return { ok: false, error: "Group size 1–6." };

  const price_cents = mode === "route-only" ? 1800 : 12000;

  const noteLines = [
    `mode: ${mode}`,
    `pace: ${pace}`,
    interests.length > 0 ? `interests: ${interests.join(", ")}` : null,
  ].filter(Boolean) as string[];

  const admin = await createAdminClient();
  const { error } = await admin.from("bookings").insert({
    customer_email: email,
    customer_name: name,
    booking_date: date,
    people,
    status: "pending",
    price_cents,
    note: noteLines.join("\n"),
  });
  if (error) return { ok: false, error: error.message };

  const jar = await cookies();
  jar.set(TRAVELER_COOKIE, email, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
  });

  revalidatePath("/trips");
  redirect("/trips?new=1");
}
