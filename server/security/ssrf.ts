import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "0.0.0.0",
  "metadata.google.internal",
]);

function isPrivateIpv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateIpv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (normalized.startsWith("fe80:")) return true;
  return false;
}

export function isBlockedIp(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return isPrivateIpv4(ip);
  if (version === 6) return isPrivateIpv6(ip);
  return true;
}

export async function assertPublicUrl(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (BLOCKED_HOSTNAMES.has(host) || host.endsWith(".local")) {
    throw new Error("URL points to a restricted host.");
  }
  if (isIP(host)) {
    if (isBlockedIp(host)) {
      throw new Error("URL points to a private network address.");
    }
    return;
  }
  const records = await lookup(host, { all: true });
  for (const record of records) {
    if (isBlockedIp(record.address)) {
      throw new Error("URL resolves to a private network address.");
    }
  }
}
