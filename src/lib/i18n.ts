import { cookies } from "next/headers";

export type Lang = "en" | "zh" | "ja" | "vi";

const LANG_COOKIE = "seoul_crafted_lang";
const VALID: Lang[] = ["en", "zh", "ja", "vi"];

export async function getLang(): Promise<Lang> {
  const jar = await cookies();
  const val = jar.get(LANG_COOKIE)?.value as Lang | undefined;
  return val && VALID.includes(val) ? val : "en";
}

type I18nRow = {
  lang: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
};

/**
 * Pick the i18n row matching the current lang. Falls back to EN, then to any
 * row that has content, then to an empty record.
 */
export function pickI18n<T extends I18nRow>(
  rows: T[] | null | undefined,
  lang: Lang,
): T | undefined {
  if (!rows || rows.length === 0) return undefined;
  const primary = rows.find((r) => r.lang === lang && (r.title || r.description));
  if (primary) return primary;
  const en = rows.find((r) => r.lang === "en" && (r.title || r.description));
  if (en) return en;
  return rows.find((r) => r.title || r.description) ?? rows[0];
}

export const LANG_LABELS: Record<Lang, { native: string; english: string; flag: string }> = {
  en: { native: "English", english: "English", flag: "🇺🇸" },
  zh: { native: "中文", english: "Chinese", flag: "🇨🇳" },
  ja: { native: "日本語", english: "Japanese", flag: "🇯🇵" },
  vi: { native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
};

export { LANG_COOKIE };
