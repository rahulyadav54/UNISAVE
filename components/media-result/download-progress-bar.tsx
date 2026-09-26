"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DownloadProgressBarProps {
  progress: number;
}

const STATUS_STEPS = [
  { at: 0, text: "Initializing high-speed media stream..." },
  { at: 20, text: "Connecting to server and fetching chunks..." },
  { at: 45, text: "Downloading video & audio streams..." },
  { at: 70, text: "Processing and packaging media file..." },
  { at: 90, text: "Finalizing your download file..." },
  { at: 100, text: "Ready! Completing download..." },
];

export function DownloadProgressBar({ progress }: DownloadProgressBarProps) {
  // Smooth simulated progress that smoothly moves forward while real download is running
  const [displayProgress, setDisplayProgress] = useState(progress || 8);

  useEffect(() => {
    if (progress >= 100) {
      setDisplayProgress(100);
      return;
    }

    if (progress > displayProgress) {
      setDisplayProgress(progress);
    }

    // Gradually tick forward smoothly while waiting for server
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev < 30) return Math.min(prev + 3, 30);
        if (prev < 60) return Math.min(prev + 2, 60);
        if (prev < 85) return Math.min(prev + 1, 85);
        if (prev < 95) return Math.min(prev + 0.5, 95);
        return prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [progress, displayProgress]);

  const currentStep =
    STATUS_STEPS.slice()
      .reverse()
      .find((step) => displayProgress >= step.at) || STATUS_STEPS[0];

  const roundedPct = Math.round(displayProgress);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-background to-purple-950/20 p-5 shadow-lg backdrop-blur-md">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-violet-600/15 blur-2xl" />
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-purple-600/15 blur-2xl" />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-violet-500" />
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentStep.text}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold tracking-tight text-foreground"
              >
                {currentStep.text}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="font-mono text-sm font-bold text-violet-500 dark:text-violet-400">
            {roundedPct}%
          </span>
        </div>

        {/* High-tech animated progress bar */}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-[var(--input-bg)] shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-indigo-500"
            style={{ width: `${displayProgress}%` }}
            transition={{ type: "spring", stiffness: 40, damping: 15 }}
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
          <span>⚡ High-speed Cloud Accelerator</span>
          <span>Please keep this tab open</span>
        </div>
      </div>
    </div>
  );
}
