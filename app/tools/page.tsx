import Link from "next/link";
import { Card } from "@/components/ui/card";

const tools = [
  {
    title: "Video Downloader",
    href: "/",
    description: "Paste a public video URL on the homepage to analyze and download.",
    available: true,
  },
  {
    title: "Media Information",
    href: "/",
    description: "Analyze a link to view title, duration, creator, and available formats.",
    available: true,
  },
  {
    title: "Thumbnail Fetcher",
    href: "/tools/thumbnail",
    description: "Fetch the preview image URL for a supported public media link.",
    available: true,
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Tools</h1>
      <p className="mt-3 text-base text-muted-foreground">
        UNISAVE tools for analyzing and extracting public media metadata.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.title} className="p-6 transition-all hover:border-violet-500/35">
            <h2 className="text-lg font-bold text-foreground">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
            {tool.available ? (
              <Link href={tool.href} className="mt-4 inline-flex items-center text-sm font-semibold text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300">
                Open tool →
              </Link>
            ) : (
              <p className="mt-4 text-xs font-medium text-muted-foreground">Coming soon</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

