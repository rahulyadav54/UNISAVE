import type { AnalyzeResult, MediaFormat, MediaInfo } from "@/types/media";
import type { PlatformId } from "@/types/platform";
import { stableFormatIdFromKey } from "./format-mapper";

interface OEmbedResponse {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
  html?: string;
  provider_name?: string;
}

export async function tryFallbackAnalysis(
  url: string,
  platform: PlatformId,
): Promise<AnalyzeResult | null> {
  try {
    switch (platform) {
      case "youtube":
        return await extractYouTube(url);
      case "vimeo":
        return await extractVimeo(url);
      case "tiktok":
        return await extractTikTok(url);
      case "facebook":
        return await extractFacebook(url);
      case "reddit":
        return await extractReddit(url);
      case "twitter":
        return await extractTwitter(url);
      case "pinterest":
        return await extractPinterest(url);
      default:
        return await extractGenericOEmbed(url, platform);
    }
  } catch (err) {
    console.error(`[FallbackExtractor] Error extracting ${platform} (${url}):`, err);
    return null;
  }
}

async function extractFacebook(url: string): Promise<AnalyzeResult | null> {
  try {
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Sec-Fetch-Mode": "navigate",
    };

    let targetUrl = url;
    // Resolve redirects for share/short links
    try {
      const headRes = await fetch(url, {
        method: "GET",
        headers,
        redirect: "follow",
      });
      if (headRes.url && headRes.url !== url) {
        targetUrl = headRes.url;
      }
      const html = await headRes.text();

      // Extract title
      const titleMatch =
        html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i) ||
        html.match(/<title>([^<]*)<\/title>/i);
      const title = titleMatch ? titleMatch[1].replace(/ \| Facebook$/i, "").trim() : "Facebook Video";

      // Extract thumbnail
      const thumbMatch =
        html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i) ||
        html.match(/"preferred_thumbnail":{"image":{"uri":"([^"]+)"/i);
      const rawThumb = thumbMatch ? thumbMatch[1] : undefined;
      const thumbnail = rawThumb
        ? decodeURIComponent(rawThumb.replace(/\\u0025/g, "%").replace(/\\\//g, "/").replace(/&amp;/g, "&"))
        : undefined;

      // Extract HD/SD video links if embedded
      const hdMatch =
        html.match(/"browser_native_hd_url":"([^"]+)"/) ||
        html.match(/"playable_url_quality_hd":"([^"]+)"/) ||
        html.match(/"hd_src":"([^"]+)"/) ||
        html.match(/"hd_src_no_ratelimit":"([^"]+)"/);

      const sdMatch =
        html.match(/"browser_native_sd_url":"([^"]+)"/) ||
        html.match(/"playable_url":"([^"]+)"/) ||
        html.match(/"sd_src":"([^"]+)"/) ||
        html.match(/"sd_src_no_ratelimit":"([^"]+)"/) ||
        html.match(/<meta\s+property="og:video"\s+content="([^"]*)"/i) ||
        html.match(/<meta\s+property="og:video:url"\s+content="([^"]*)"/i);

      const cleanUrl = (str?: string) =>
        str
          ? str.replace(/\\u0026/g, "&").replace(/\\\//g, "/").replace(/&amp;/g, "&")
          : undefined;

      const hdDirect = cleanUrl(hdMatch?.[1]);
      const sdDirect = cleanUrl(sdMatch?.[1]);

      const formats: MediaFormat[] = [];

      if (hdDirect) {
        formats.push({
          id: stableFormatIdFromKey(`fb-hd-${targetUrl}`),
          type: "video",
          format: "mp4",
          quality: "HD 1080p / 720p",
          resolution: "HD",
          label: "HD High Definition",
          available: true,
          ytdlpFormatId: hdDirect.startsWith("http") ? hdDirect : "bestvideo+bestaudio/best",
        });
      }

      if (sdDirect) {
        formats.push({
          id: stableFormatIdFromKey(`fb-sd-${targetUrl}`),
          type: "video",
          format: "mp4",
          quality: "SD",
          resolution: "SD",
          label: "SD Standard Definition",
          available: true,
          ytdlpFormatId: sdDirect.startsWith("http") ? sdDirect : "best[ext=mp4]/best",
        });
      }

      // Default high quality formats with yt-dlp format selectors
      if (formats.length === 0) {
        formats.push(
          {
            id: stableFormatIdFromKey(`fb-best-${targetUrl}`),
            type: "video",
            format: "mp4",
            quality: "Best",
            resolution: "HD",
            label: "HD Video (Video + Audio)",
            available: true,
            ytdlpFormatId: "bestvideo+bestaudio/best[ext=mp4]/hd/sd/best",
          },
          {
            id: stableFormatIdFromKey(`fb-sd-gen-${targetUrl}`),
            type: "video",
            format: "mp4",
            quality: "SD",
            resolution: "SD",
            label: "SD Standard Quality",
            available: true,
            ytdlpFormatId: "sd/best[height<=480]/best",
          },
        );
      }

      formats.push({
        id: stableFormatIdFromKey(`fb-audio-${targetUrl}`),
        type: "audio",
        format: "m4a",
        quality: "Audio",
        label: "Audio Sound Track",
        available: true,
        ytdlpFormatId: "bestaudio/best",
      });

      return {
        success: true,
        platform: "facebook",
        media: {
          title,
          creator: "Facebook Creator",
          thumbnail,
          platform: "facebook",
          isPublic: true,
        },
        formats,
      };
    } catch {
      // Return structured fallback
      return {
        success: true,
        platform: "facebook",
        media: {
          title: "Facebook Video",
          creator: "Facebook",
          platform: "facebook",
          isPublic: true,
        },
        formats: [
          {
            id: stableFormatIdFromKey(`fb-best-${url}`),
            type: "video",
            format: "mp4",
            quality: "HD",
            label: "HD Video with Sound",
            available: true,
            ytdlpFormatId: "bestvideo+bestaudio/best[ext=mp4]/hd/sd/best",
          },
          {
            id: stableFormatIdFromKey(`fb-audio-${url}`),
            type: "audio",
            format: "m4a",
            quality: "Audio",
            label: "Audio Track",
            available: true,
            ytdlpFormatId: "bestaudio/best",
          },
        ],
      };
    }
  } catch {
    return null;
  }
}

async function extractYouTube(url: string): Promise<AnalyzeResult | null> {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(oembedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as OEmbedResponse;

  let videoId = "";
  const match = url.match(/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)/);
  if (match && match[1]?.length === 11) {
    videoId = match[1];
  }

  const thumbnail = videoId
    ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
    : data.thumbnail_url || "";

  const media: MediaInfo = {
    title: data.title || "YouTube Video",
    creator: data.author_name || "YouTube Creator",
    thumbnail,
    platform: "youtube",
    isPublic: true,
    watermarkNote: "Direct audio & video streams available.",
  };

  const formats: MediaFormat[] = [
    {
      id: stableFormatIdFromKey(`yt-best-${videoId || url}`),
      type: "video",
      format: "mp4",
      quality: "Best",
      label: "HD 1080p / 720p Video",
      resolution: "1080p",
      available: true,
      ytdlpFormatId: "22/18/best[ext=mp4]/best",
    },
    {
      id: stableFormatIdFromKey(`yt-720-${videoId || url}`),
      type: "video",
      format: "mp4",
      quality: "720p",
      label: "720p High Quality",
      resolution: "720p",
      available: true,
      ytdlpFormatId: "22/best[height<=720]/18/best",
    },
    {
      id: stableFormatIdFromKey(`yt-360-${videoId || url}`),
      type: "video",
      format: "mp4",
      quality: "360p",
      label: "360p Fast Download",
      resolution: "360p",
      available: true,
      ytdlpFormatId: "18/best[height<=360]/best",
    },
    {
      id: stableFormatIdFromKey(`yt-audio-${videoId || url}`),
      type: "audio",
      format: "m4a",
      quality: "Audio",
      label: "High Quality MP3 / M4A Audio",
      available: true,
      ytdlpFormatId: "140/bestaudio/best",
    },
  ];

  return {
    success: true,
    platform: "youtube",
    media,
    formats,
  };
}

async function extractVimeo(url: string): Promise<AnalyzeResult | null> {
  const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`;
  const res = await fetch(oembedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 UNISAVE" },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as OEmbedResponse;

  return {
    success: true,
    platform: "vimeo",
    media: {
      title: data.title || "Vimeo Video",
      creator: data.author_name || "Vimeo Creator",
      thumbnail: data.thumbnail_url,
      platform: "vimeo",
      isPublic: true,
    },
    formats: [
      {
        id: stableFormatIdFromKey(`vimeo-best-${url}`),
        type: "video",
        format: "mp4",
        quality: "Best",
        label: "Best Quality Video",
        available: true,
        ytdlpFormatId: "bestvideo+bestaudio/best",
      },
      {
        id: stableFormatIdFromKey(`vimeo-audio-${url}`),
        type: "audio",
        format: "m4a",
        quality: "Audio",
        label: "Audio Track",
        available: true,
        ytdlpFormatId: "bestaudio/best",
      },
    ],
  };
}

async function extractTikTok(url: string): Promise<AnalyzeResult | null> {
  const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
  const res = await fetch(oembedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 UNISAVE" },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as OEmbedResponse;

  return {
    success: true,
    platform: "tiktok",
    media: {
      title: data.title || "TikTok Video",
      creator: data.author_name || "TikTok Creator",
      thumbnail: data.thumbnail_url,
      platform: "tiktok",
      isPublic: true,
      watermarkNote: "Direct clean video stream.",
    },
    formats: [
      {
        id: stableFormatIdFromKey(`tiktok-best-${url}`),
        type: "video",
        format: "mp4",
        quality: "HD",
        label: "HD Video",
        available: true,
        ytdlpFormatId: "best",
      },
      {
        id: stableFormatIdFromKey(`tiktok-audio-${url}`),
        type: "audio",
        format: "m4a",
        quality: "Audio",
        label: "Audio Sound",
        available: true,
        ytdlpFormatId: "bestaudio/best",
      },
    ],
  };
}

async function extractReddit(url: string): Promise<AnalyzeResult | null> {
  try {
    const jsonUrl = url.split("?")[0].replace(/\/$/, "") + ".json";
    const res = await fetch(jsonUrl, {
      headers: { "User-Agent": "Mozilla/5.0 UNISAVE-Media-Tool/1.0" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const post = json[0]?.data?.children[0]?.data;
    if (!post) return null;

    const title = post.title || "Reddit Media";
    const author = post.author || "Reddit User";
    const thumbnail = post.thumbnail && post.thumbnail.startsWith("http") ? post.thumbnail : undefined;

    return {
      success: true,
      platform: "reddit",
      media: {
        title,
        creator: `u/${author}`,
        thumbnail,
        platform: "reddit",
        isPublic: true,
      },
      formats: [
        {
          id: stableFormatIdFromKey(`reddit-best-${url}`),
          type: "video",
          format: "mp4",
          quality: "Best",
          label: "Original Media",
          available: true,
          ytdlpFormatId: "bestvideo+bestaudio/best",
        },
      ],
    };
  } catch {
    return null;
  }
}

async function extractTwitter(url: string): Promise<AnalyzeResult | null> {
  // Try vxTwitter / fxTwitter API endpoint for Twitter / X media
  try {
    const apiMatch = url.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
    if (!apiMatch) return null;
    const [, username, statusId] = apiMatch;
    const fxUrl = `https://api.fxtwitter.com/${username}/status/${statusId}`;
    const res = await fetch(fxUrl, {
      headers: { "User-Agent": "Mozilla/5.0 UNISAVE" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const tweet = data.tweet;
    if (!tweet) return null;

    const title = tweet.text?.slice(0, 80) || `Post by @${tweet.author?.screen_name || username}`;
    const thumbnail = tweet.media?.videos?.[0]?.thumbnail_url || tweet.media?.photos?.[0]?.url;

    return {
      success: true,
      platform: "twitter",
      media: {
        title,
        creator: `@${tweet.author?.screen_name || username}`,
        thumbnail,
        platform: "twitter",
        isPublic: true,
      },
      formats: [
        {
          id: stableFormatIdFromKey(`twitter-best-${url}`),
          type: "video",
          format: "mp4",
          quality: "HD",
          label: "High Definition Video",
          available: true,
          ytdlpFormatId: "bestvideo+bestaudio/best",
        },
      ],
    };
  } catch {
    return null;
  }
}

async function extractPinterest(url: string): Promise<AnalyzeResult | null> {
  const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(url)}`;
  const res = await fetch(oembedUrl, {
    headers: { "User-Agent": "Mozilla/5.0 UNISAVE" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as OEmbedResponse;

  return {
    success: true,
    platform: "pinterest",
    media: {
      title: data.title || "Pinterest Pin",
      creator: data.author_name || "Pinterest Creator",
      thumbnail: data.thumbnail_url,
      platform: "pinterest",
      isPublic: true,
    },
    formats: [
      {
        id: stableFormatIdFromKey(`pinterest-best-${url}`),
        type: "video",
        format: "mp4",
        quality: "Best",
        label: "Full Quality Pin",
        available: true,
        ytdlpFormatId: "best",
      },
    ],
  };
}

async function extractGenericOEmbed(
  url: string,
  platform: PlatformId,
): Promise<AnalyzeResult | null> {
  return null;
}
