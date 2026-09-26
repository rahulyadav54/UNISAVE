import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <defs>
          <linearGradient id="unisave-grad" x1="4" y1="4" x2="28" y2="28">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="9" fill="url(#unisave-grad)" />
        <path
          d="M10 11V21C10 23.5 12 25 14.5 25H18"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M22 11V18C22 20.5 20 22 17.5 22H14"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="22" cy="21" r="2" fill="white" />
        <path
          d="M21 21L19.5 23.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-semibold tracking-tight text-foreground">
        UNISAVE
      </span>
    </div>
  );
}
