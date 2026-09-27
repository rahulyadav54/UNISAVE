import type { PlatformId, PlatformMeta } from "@/types/platform";

export const PLATFORMS: PlatformMeta[] = [
  {
    id: "youtube",
    name: "YouTube",
    slug: "youtube",
    color: "#FF0000",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?(?:youtube\\.com|youtu\\.be)/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?youtube\\.com/shorts/",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    slug: "instagram",
    color: "#E4405F",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?instagram\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?instagr\\.am/",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    slug: "tiktok",
    color: "#00F2EA",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?tiktok\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?vm\\.tiktok\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?vt\\.tiktok\\.com/",
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    slug: "facebook",
    color: "#1877F2",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?facebook\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?fb\\.watch/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?fb\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?fb\\.me/",
    ],
  },
  {
    id: "twitter",
    name: "X",
    slug: "twitter",
    color: "#1DA1F2",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?(?:twitter\\.com|x\\.com)/",
    ],
  },
  {
    id: "reddit",
    name: "Reddit",
    slug: "reddit",
    color: "#FF4500",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?reddit\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?redd\\.it/",
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    slug: "pinterest",
    color: "#E60023",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?pinterest\\.com/",
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?pin\\.it/",
    ],
  },
  {
    id: "vimeo",
    name: "Vimeo",
    slug: "vimeo",
    color: "#1AB7EA",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?vimeo\\.com/",
    ],
  },
  {
    id: "threads",
    name: "Threads",
    slug: "threads",
    color: "#FFFFFF",
    patterns: [
      "(?:https?://)?(?:[a-zA-Z0-9_-]+\\.)?threads\\.net/",
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

