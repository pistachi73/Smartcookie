/**
 * URL detection and validation utilities
 */

export interface DetectedUrl {
  url: string;
  startIndex: number;
  endIndex: number;
  text: string;
}

const allowedTlds = new Set([
  "com",
  "net",
  "org",
  "jp",
  "de",
  "uk",
  "fr",
  "br",
  "it",
  "ru",
  "es",
  "me",
  "gov",
  "pl",
  "ca",
  "au",
  "cn",
  "co",
  "in",
  "nl",
  "edu",
  "info",
  "eu",
  "ch",
  "id",
  "at",
  "kr",
  "cz",
  "mx",
  "be",
  "tv",
  "se",
  "tr",
  "tw",
  "al",
  "ua",
  "ir",
  "vn",
  "cl",
  "sk",
  "ly",
  "cc",
  "to",
  "no",
  "fi",
  "us",
  "pt",
  "dk",
  "ar",
  "hu",
  "tk",
  "gr",
  "il",
  "news",
  "ro",
  "my",
  "biz",
  "ie",
  "za",
  "nz",
  "sg",
  "ee",
  "th",
  "io",
  "xyz",
  "pe",
  "bg",
  "hk",
  "rs",
  "lt",
  "link",
  "ph",
  "club",
  "si",
  "site",
  "mobi",
  "by",
  "cat",
  "wiki",
  "la",
  "ga",
  "xxx",
  "cf",
  "hr",
  "ng",
  "jobs",
  "online",
  "kz",
  "ug",
  "gq",
  "ae",
  "is",
  "lv",
  "pro",
  "fm",
  "tips",
  "ms",
  "sa",
  "app",
]);

/**
 * Regular expression to detect URLs in text
 * Matches http/https URLs with optional www subdomain
 */
const URL_REGEX = /(https?:\/\/[^\s]+)/gi;

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detects all URLs in a given text and returns their positions
 */
export function detectUrls(text: string): DetectedUrl[] {
  console.log({ text });
  const urls: DetectedUrl[] = [];

  // Reset regex lastIndex to ensure we start from the beginning
  URL_REGEX.lastIndex = 0;

  let match = URL_REGEX.exec(text);
  while (match !== null) {
    const url = match[1];

    // Validate the URL
    if (url && isValidUrl(url)) {
      urls.push({
        url,
        startIndex: match.index,
        endIndex: match.index + url.length,
        text: url,
      });
    }

    match = URL_REGEX.exec(text);
  }

  return urls;
}

export function extractUrls(text: string): string[] {
  if (typeof text !== "string") return [];

  // Regex explanation:
  // - (https?:\/\/) → optional scheme
  // - (www\.) → optional www.
  // - ([a-z0-9-]+\.)+[a-z]{2,} → domain.tld (handles subdomains)
  // - (\/[^\s]*)? → optional path/query/hash
  const urlRegex =
    /\b((?:https?:\/\/|www\.)?(?:[a-z0-9-]+\.)+([a-z]{2,})(?:\/[^\s]*)?)(?=$|\s|[.,!?;:])/gi;

  const matches = text.matchAll(urlRegex);
  const results: string[] = [];

  for (const match of matches) {
    const url = match[1] as string;
    const tld = match[2]?.toLowerCase() ?? "";

    // Skip if TLD not in the whitelist
    if (!allowedTlds.has(tld)) continue;

    // Validate
    if (/^https?:\/\//i.test(url)) {
      if (isValidUrl(url)) results.push(url);
    } else {
      if (isValidUrl(`http://${url}`)) results.push(url);
    }
  }

  return results;
}

/**
 * Gets the first valid URL from text
 */
export function getFirstUrl(text: string): string | null {
  const urls = detectUrls(text);
  return urls.length > 0 ? (urls[0]?.url ?? null) : null;
}

/**
 * Checks if text contains any valid URLs
 */
export function hasUrls(text: string): boolean {
  return detectUrls(text).length > 0;
}
