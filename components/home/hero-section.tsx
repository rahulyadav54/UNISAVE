"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MediaDownloader } from "@/components/downloader/media-downloader";
import { PLATFORMS } from "@/lib/platforms";
import { PlatformLogo } from "@/components/platform/platform-logo";
import { easeOut, staggerContainer, scaleIn } from "@/lib/motion";

export function HeroSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-18">
      {/* Background Animated Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-blue-500/10 blur-3xl"
          animate={reduce ? undefined : { y: [0, -20, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-28 -right-16 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl dark:bg-violet-600/20"
          animate={reduce ? undefined : { y: [0, 18, 0], x: [0, -12, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 left-[-5%] h-64 w-64 rounded-full bg-blue-500/15 blur-3xl"
          animate={reduce ? undefined : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Live Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="mx-auto mb-6 inline-flex items-center gap-2.5 rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]/80 px-4 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-600" />
          </span>
          Universal media toolkit · 9 supported platforms
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
          className="hero-title-glow text-5xl font-black tracking-tight sm:text-7xl"
        >
          UNISAVE
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.5, ease: easeOut }}
          className="mt-4 text-xl font-bold tracking-tight text-[var(--hero-subtitle)] sm:text-2xl"
        >
          One Link. One Place. Save What Matters.
        </motion.p>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14, duration: 0.5, ease: easeOut }}
          className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-muted-foreground sm:text-base"
        >
          Analyze and process publicly accessible media from your favorite platforms —
          all from one simple, lightning-fast interface.
        </motion.p>

        {/* Media Downloader Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: easeOut }}
          className="mt-10 text-left"
        >
          <MediaDownloader />
        </motion.div>

        {/* Platform Icons Ribbon */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)]/80 px-5 py-3.5 shadow-[var(--card-shadow)] backdrop-blur-md"
        >
          {PLATFORMS.map((p) => (
            <motion.div
              key={p.id}
              variants={scaleIn}
              whileHover={reduce ? undefined : { scale: 1.12, y: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <PlatformLogo platform={p.id} size="sm" className="opacity-95 transition-opacity hover:opacity-100" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

