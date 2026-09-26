export type PlatformId =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "twitter"
  | "reddit"
  | "pinterest"
  | "vimeo"
  | "threads"
  | "unknown";

export interface PlatformMeta {
  id: PlatformId;
  name: string;
  slug: string;
  color: string;
  patterns: string[];
}

