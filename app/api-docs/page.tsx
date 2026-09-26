import { Card } from "@/components/ui/card";

export default function ApiDocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">UNISAVE API</h1>
      <p className="mt-3 text-base text-muted-foreground">
        REST endpoints for analyzing and processing publicly accessible media. API keys and
        usage billing are planned for a future developer platform release.
      </p>

      <div className="mt-8 space-y-4">
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">POST /api/media/analyze</h2>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4 text-xs font-mono text-foreground">
{`{ "url": "https://example.com/media" }`}
          </pre>
        </Card>
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">POST /api/media/download</h2>
          <pre className="mt-3 overflow-x-auto rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] p-4 text-xs font-mono text-foreground">
{`{ "url": "...", "formatId": "format_..." }`}
          </pre>
        </Card>
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">GET /api/media/status/:jobId</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Poll job status until <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs text-foreground">completed</code> or{" "}
            <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs text-foreground">failed</code>.
          </p>
        </Card>
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">GET /api/health</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Service status, queue mode (<code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs text-foreground">memory</code> or{" "}
            <code className="rounded bg-[var(--input-bg)] px-1.5 py-0.5 text-xs text-foreground">redis</code>), and Redis connectivity.
          </p>
        </Card>
        <Card className="p-6 transition-all hover:border-violet-500/30">
          <h2 className="text-lg font-bold text-foreground">Rate Limits</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Default: 30 analyze requests and 20 download requests per minute per IP (Redis-backed
            when configured).
          </p>
        </Card>
      </div>
    </div>
  );
}

