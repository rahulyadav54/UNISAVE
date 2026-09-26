"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link2, X, Clipboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { detectPlatform } from "@/lib/platforms";
import { PlatformIcon } from "@/components/platform/platform-icon";
import type { PlatformId } from "@/types/platform";

interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  loading?: boolean;
}

export function UrlInput({ value, onChange, onAnalyze, loading }: UrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const platform = value.trim() ? detectPlatform(value) : "unknown";
  const [focused, setFocused] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        inputRef.current?.focus();
      }
    } catch {
      // clipboard permission denied
    }
  };

  return (
    <motion.div
      className="url-input-shell relative rounded-2xl p-[1px]"
      animate={
        reduce
          ? undefined
          : focused
            ? {
                boxShadow: [
                  "0 0 0 0 rgba(139, 92, 246, 0)",
                  "0 0 24px 3px rgba(99, 102, 241, 0.25)",
                  "0 0 0 0 rgba(139, 92, 246, 0)",
                ],
              }
            : { boxShadow: "0 0 0 0 rgba(139, 92, 246, 0)" }
      }
      transition={focused ? { duration: 2.5, repeat: Infinity } : { duration: 0.2 }}
    >
      <div
        className={`relative rounded-2xl border bg-[var(--card-bg)] p-2.5 shadow-[var(--card-shadow)] backdrop-blur-xl transition-all duration-300 ${
          focused
            ? "border-violet-500/50 ring-2 ring-violet-500/20"
            : "border-[var(--input-border)] hover:border-violet-500/30"
        }`}
      >
        <div className="pointer-events-none absolute left-5 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2.5 text-muted-foreground">
          <Link2 className="h-5 w-5 text-violet-500/80" />
          {platform !== "unknown" && (
            <motion.div
              key={platform}
              initial={reduce ? false : { scale: 0.7, opacity: 0, x: -5 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="flex items-center gap-1.5 rounded-full border border-violet-500/25 bg-violet-500/10 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md"
            >
              <PlatformIcon platform={platform as PlatformId} className="pointer-events-auto" />
              <span className="capitalize">{platform}</span>
            </motion.div>
          )}
        </div>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onAnalyze();
          }}
          placeholder="Paste video, reel, post or media URL..."
          className={`h-12 border-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground/70 pr-40 shadow-none focus-visible:ring-0 ${
            platform !== "unknown" ? "pl-44 sm:pl-52" : "pl-12"
          }`}
          aria-label="Media URL"
        />
        <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1.5">
          {value ? (
            <motion.button
              type="button"
              className="rounded-xl p-2 text-muted-foreground transition hover:bg-violet-500/10 hover:text-foreground"
              aria-label="Clear URL"
              onClick={() => onChange("")}
              whileTap={reduce ? undefined : { scale: 0.9 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              className="hidden sm:flex items-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-violet-500/10 hover:text-foreground hover:border-violet-500/30"
              onClick={handlePaste}
              whileTap={reduce ? undefined : { scale: 0.95 }}
            >
              <Clipboard className="h-3.5 w-3.5" />
              Paste
            </motion.button>
          )}
          <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
            <Button
              type="button"
              onClick={onAnalyze}
              disabled={loading || !value.trim()}
              className="h-10 px-5 font-semibold shadow-md shadow-violet-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing...
                </span>
              ) : (
                "Analyze"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

