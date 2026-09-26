import { createHash } from "node:crypto";
import { assertPublicUrl } from "./ssrf";

const MAX_URL_LENGTH = 2048;

export interface UrlValidationResult {
  valid: boolean;
  normalized?: string;
  error?: string;
  errorCode?: string;
}

export async function validateMediaUrl(raw: string): Promise<UrlValidationResult> {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { valid: false, error: "Please enter a URL.", errorCode: "EMPTY_URL" };
  }
  if (trimmed.length > MAX_URL_LENGTH) {
    return { valid: false, error: "URL is too long.", errorCode: "URL_TOO_LONG" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return {
      valid: false,
      error: "That doesn't look like a valid media URL.",
      errorCode: "INVALID_URL",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return {
      valid: false,
      error: "Only HTTP and HTTPS URLs are supported.",
      errorCode: "INVALID_PROTOCOL",
    };
  }

  if (parsed.username || parsed.password) {
    return {
      valid: false,
      error: "URLs with credentials are not allowed.",
      errorCode: "CREDENTIALS_IN_URL",
    };
  }

  try {
    await assertPublicUrl(parsed.hostname);
  } catch {
    return {
      valid: false,
      error: "That URL is not allowed for security reasons.",
      errorCode: "SSRF_BLOCKED",
    };
  }

  return { valid: true, normalized: parsed.toString() };
}

export function hashUrl(url: string): string {
  return createHash("sha256").update(url).digest("hex").slice(0, 32);
}
