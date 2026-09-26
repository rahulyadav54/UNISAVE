import type { PlatformId, PlatformMeta } from "@/types/platform";

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "youtube",
    name: "YouTube",
    slug: "youtube",
    color: "#FF0000",
    patterns: [
      "(?:https?://)?(?:www\\.)?(?:youtube\\.com|youtu\\.be)/",
      "(?:https?://)?(?:www\\.)?youtube\\.com/shorts/",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    slug: "instagram",
    color: "#E4405F",
    patterns: [
      "(?:https?://)?(?:www\\.)?instagram\\.com/",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    slug: "tiktok",
    color: "#00F2EA",
    patterns: [
      "(?:https?://)?(?:www\\.)?tiktok\\.com/",
      "(?:https?://)?vm\\.tiktok\\.com/",
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    slug: "facebook",
    color: "#1877F2",
    patterns: [
      "(?:https?://)?(?:www\\.)?facebook\\.com/",
      "(?:https?://)?(?:www\\.)?fb\\.watch/",
    ],
  },
  {
    id: "twitter",
    name: "X",
    slug: "twitter",
    color: "#1DA1F2",
    patterns: [
      "(?:https?://)?(?:www\\.)?(?:twitter\\.com|x\\.com)/",
    ],
  },
  {
    id: "reddit",
    name: "Reddit",
    slug: "reddit",
    color: "#FF4500",
    patterns: [
      "(?:https?://)?(?:www\\.)?reddit\\.com/",
      "(?:https?://)?(?:www\\.)?redd\\.it/",
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    slug: "pinterest",
    color: "#E60023",
    patterns: [
      "(?:https?://)?(?:www\\.)?pinterest\\.com/",
      "(?:https?://)?pin\\.it/",
    ],
  },
  {
    id: "vimeo",
    name: "Vimeo",
    slug: "vimeo",
    color: "#1AB7EA",
    patterns: [
      "(?:https?://)?(?:www\\.)?vimeo\\.com/",
    ],
  },
  {
    id: "threads",
    name: "Threads",
    slug: "threads",
    color: "#FFFFFF",
    patterns: [
      "(?:https?://)?(?:www\\.)?threads\\.net/",
    ],
  },
];

export function detectPlatform(url: string): PlatformId {
  const trimmed = url.trim();
  for (const platform of PLATFORMS) {
    if (platform.patterns.some((patternStr) => new RegExp(patternStr, "i").test(trimmed))) {
      return platform.id;
    }
  }
  return "unknown";
}

export function getPlatformMeta(id: PlatformId): PlatformMeta | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

