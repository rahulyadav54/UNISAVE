import type { ReactNode } from "react";
import type { PlatformId } from "@/types/platform";
import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "h-9 w-9 rounded-xl [&_svg]:h-4 [&_svg]:w-4",
  md: "h-12 w-12 rounded-2xl [&_svg]:h-6 [&_svg]:w-6",
  lg: "h-14 w-14 rounded-2xl [&_svg]:h-7 [&_svg]:w-7",
};

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center shadow-sm ring-1 ring-black/5 dark:ring-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

function LogoSvg({ id }: { id: PlatformId }) {
  switch (id) {
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .6 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.3.6 9.3.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"
            className="text-white"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.25" fill="white" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M16.5 3h-2.2v11.9a2.8 2.8 0 1 1-2.8-2.8c.2 0 .5 0 .7.1V10a5.3 5.3 0 1 0 5.3 5.3V8.6c1 .7 2.2 1.1 3.5 1.1V7.5c-1.8 0-3.3-.7-4.5-1.9V3z"
            className="text-white"
          />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"
            className="text-white"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M18.9 2.25h3.68l-8.04 9.19L24 21.75h-7.41l-5.79-7.57-6.63 7.57H.96l8.6-9.83L0 2.25h7.59l5.23 6.91 6.08-6.91zm-1.29 17.52h2.04L6.49 4.41H4.28l13.33 15.36z"
            className="text-white dark:text-white"
          />
        </svg>
      );
    case "reddit":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.74c.69 0 1.25.56 1.25 1.25a1.25 1.25 0 0 1-2.5 0c0-.69.56-1.25 1.25-1.25zM12 5.5c-3.31 0-6.01 2.4-6.56 5.52-.02.12-.03.24-.03.36 0 .41.34.75.75.75h.17a5.5 5.5 0 0 0-.17 1.37c0 2.76 2.69 5 6 5s6-2.24 6-5a5.5 5.5 0 0 0-.17-1.37h.17c.41 0 .75-.34.75-.75 0-.12-.01-.24-.03-.36C18.01 7.9 15.31 5.5 12 5.5zM8.25 13.5a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm7.5 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm-2.92 3.38c-.97.97-2.54 1-3.58.03-.47-.43-.12-1.16.52-1.16.3 0 .57.15.74.38.45.54 1.18.54 1.63 0 .17-.23.44-.38.74-.38.64 0 .99.73.52 1.16z"
            className="text-white"
          />
        </svg>
      );
    case "pinterest":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.43 7.63 11.17-.11-.95-.2-2.42.04-3.46.22-.94 1.41-5.96 1.41-5.96s-.36-.72-.36-1.78c0-1.67.97-2.91 2.17-2.91 1.02 0 1.52.77 1.52 1.69 0 1.03-.66 2.57-1 3.99-.29 1.2.6 2.17 1.78 2.17 2.14 0 3.78-2.25 3.78-5.5 0-2.87-2.06-4.88-5.01-4.88-3.41 0-5.42 2.56-5.42 5.21 0 1.03.4 2.14.89 2.74a.36.36 0 0 1 .08.34l-.33 1.36c-.05.22-.18.27-.41.16-1.54-.72-2.5-2.97-2.5-4.78 0-3.89 2.83-7.45 8.16-7.45 4.29 0 7.61 3.04 7.61 7.1 0 4.26-2.69 7.69-6.42 7.69-1.25 0-2.43-.65-2.83-1.42l-.77 2.93c-.28 1.08-1.04 2.43-1.55 3.25C9.57 23.81 10.76 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"
            className="text-white"
          />
        </svg>
      );
    case "vimeo":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M23.98 6.19s-.07-1.46-.6-2.11c-.58-.68-1.54-.67-1.54-.67l-4.88.03s-.36-.05-.63.11-.44.37-.44.37-.35.23-.23.72.55 1.65 1.18 3.4.7 1.95.74 2.3-.08.26-.53.03-1.52-.98-2.85-1.95-1.6-1.24-2.82-1.3-.24-.01-.42.03-.57.1-.44.2-.32.64-.32.64s.12.75.28 1.55c.27 1.28.58 2.62.58 2.62s.03.2-.07.31c-.07.09-.2.12-.2.12l-1.14.07s-.85.05-1.98-1.01c-1.38-1.38-2.92-4.3-2.92-4.3s-.22-.44-.02-.68c.17-.2.5-.26.5-.26l4.55-.03s.24-.03.41.08c.13.09.21.29.21.29s.39 1.53.91 2.88c1.11 2.88 1.55 3.03 1.73 2.85.42-.42.3-3.37.3-3.37s-.02-.98.29-1.12c.23-.1.54.07 1.35.99.95 1.07 1.33 1.37 1.33 1.37s.12.08.21.05c.09-.03.06-.27.06-.27s-.04-1.7.38-1.95c.37-.22 1.08.23 2.42 1.38 1.65 1.4 1.84 1.3 1.84 1.3s.18-.06.3-.18c.12-.12.08-.37.08-.37l-.07-4.89zM4.68 8.66H.99s-.14.08-.02.27c.03.05.22.42 1.05 1.2.98.92 1.15 1.03 1.15 1.03s.09.06.05.19-.09.27-.09.27l-.42 2.52s-.03.24.08.33c.11.09.33.02.33.02l2.05-.03s1.08-.07 1.8-1.01c.88-1.15 1.92-3.28 1.92-3.28s.1-.2.02-.31c-.07-.1-.24-.07-.24-.07H4.68z"
            className="text-white"
          />
        </svg>
      );
    case "threads":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path
            d="M12.186 0C8.096 0 4.954 1.839 2.774 4.75c2.31 1.947 3.79 4.72 3.99 7.82-.02-.35-.03-.7-.03-1.06 0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8c-.36 0-.71-.02-1.06-.06 3.1.2 5.87 1.68 7.82 3.99C22.161 19.046 24 15.904 24 11.814 24 5.295 18.705 0 12.186 0zm-1.12 5.45c2.76 0 5 2.24 5 5 0 .34-.04.68-.1 1.01.48-2.98 2.9-5.26 5.93-5.26.34 0 .67.03 1 .08-1.2-2.1-3.47-3.53-6.07-3.53-3.86 0-7 3.14-7 7 0 2.6 1.43 4.87 3.53 6.07-.05-.33-.08-.66-.08-1 0-3.03 2.47-5.5 5.5-5.5-.79 0-1.54.17-2.22.47.64-1.38 2.03-2.35 3.64-2.35-1.1 0-2.1.45-2.82 1.17a3.49 3.49 0 0 0-1.05-2.59z"
            className="text-zinc-900 dark:text-white"
          />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" className="text-violet-500" />
        </svg>
      );
  }
}

const brandBg: Record<PlatformId, string> = {
  youtube: "bg-[#FF0000]",
  instagram: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  tiktok: "bg-[#010101] dark:bg-zinc-900",
  facebook: "bg-[#1877F2]",
  twitter: "bg-zinc-900",
  reddit: "bg-[#FF4500]",
  pinterest: "bg-[#E60023]",
  vimeo: "bg-[#1AB7EA]",
  threads: "bg-zinc-100 dark:bg-zinc-900",
  unknown: "bg-violet-500",
};

export function PlatformLogo({
  platform,
  size = "md",
  className,
}: {
  platform: PlatformId;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  return (
    <Icon className={cn(sizeMap[size], brandBg[platform], className)}>
      <LogoSvg id={platform} />
    </Icon>
  );
}
