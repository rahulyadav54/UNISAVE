"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

interface AdminStats {
  jobs?: Record<string, number>;
  queue?: {
    mode: string;
    redisConnected: boolean;
    bullmq?: { waiting: number; active: number } | null;
  };
  storage?: { expiredFilesRemoved: number };
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load admin stats.");
        return res.json();
      })
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">Admin</h1>
      <p className="mt-3 text-zinc-400">
        Queue and job metrics (no database). Set <code className="text-zinc-300">ADMIN_API_KEY</code>{" "}
        in production to protect the stats API.
      </p>

      {error && <p className="mt-6 text-sm text-red-300">{error}</p>}

      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <h2 className="font-medium text-white">Queue</h2>
            <p className="mt-2 text-sm text-zinc-400">
              Mode: <span className="text-white">{stats.queue?.mode}</span>
            </p>
            <p className="text-sm text-zinc-400">
              Redis:{" "}
              <span className="text-white">
                {stats.queue?.redisConnected ? "connected" : "not connected"}
              </span>
            </p>
            {stats.queue?.bullmq && (
              <p className="mt-2 text-sm text-zinc-400">
                BullMQ waiting {stats.queue.bullmq.waiting} · active{" "}
                {stats.queue.bullmq.active}
              </p>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="font-medium text-white">Jobs</h2>
            <pre className="mt-3 overflow-x-auto text-xs text-zinc-400">
              {JSON.stringify(stats.jobs, null, 2)}
            </pre>
          </Card>
        </div>
      )}
    </div>
  );
}
