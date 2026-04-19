// MyMemory-based free translation for chat messages.
// Used server-side only (inside server actions) so there's no CORS or key concern.

export type ChatLang = "en" | "zh" | "ja" | "vi" | "ko";

export const CHAT_LANGS: ChatLang[] = ["en", "zh", "ja", "vi", "ko"];

// MyMemory expects BCP-47-ish codes.
const MEMORY_CODE: Record<ChatLang, string> = {
  en: "en-US",
  zh: "zh-CN",
  ja: "ja-JP",
  vi: "vi-VN",
  ko: "ko-KR",
};

// Decode the handful of HTML entities MyMemory sometimes returns.
function decodeHtml(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

async function translateOne(
  text: string,
  from: ChatLang,
  to: ChatLang,
): Promise<string> {
  if (from === to || !text) return text;

  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text);
  url.searchParams.set("langpair", `${MEMORY_CODE[from]}|${MEMORY_CODE[to]}`);

  try {
    const res = await fetch(url.toString(), {
      signal: AbortSignal.timeout(4000),
      // Avoid Next.js caching this response.
      cache: "no-store",
    });
    if (!res.ok) return text;
    const json = (await res.json()) as {
      responseData?: { translatedText?: string };
    };
    const out = json?.responseData?.translatedText;
    if (typeof out === "string" && out.length > 0) return decodeHtml(out);
    return text;
  } catch {
    return text;
  }
}

/**
 * Translate a single message into every supported chat language in parallel.
 * The source language's entry is the original text, verbatim. Unknown source
 * defaults to "en". Failures fall back to the original text so callers can
 * always read something.
 */
export async function translateForAllLanguages(
  text: string,
  sourceLang: string | null | undefined,
): Promise<Record<ChatLang, string>> {
  const src: ChatLang = (CHAT_LANGS as string[]).includes(String(sourceLang))
    ? (sourceLang as ChatLang)
    : "en";

  const entries = await Promise.all(
    CHAT_LANGS.map(async (to) => [to, await translateOne(text, src, to)] as const),
  );
  const result = Object.fromEntries(entries) as Record<ChatLang, string>;
  result[src] = text;
  return result;
}

export function isChatLang(x: unknown): x is ChatLang {
  return (CHAT_LANGS as unknown[]).includes(x);
}
