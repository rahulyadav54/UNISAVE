"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { PLATFORMS } from "@/lib/platforms";
import { Card } from "@/components/ui/card";
import { MediaDownloader } from "@/components/downloader/media-downloader";
import { DownloadHistory } from "@/components/downloader/download-history";
import { PlatformCard } from "@/components/platform/platform-card";
import { Reveal } from "@/components/motion/reveal";
import { easeOut, fadeUpItem, staggerContainer } from "@/lib/motion";
import { Zap, Globe, Workflow, Smartphone, Shield, Sparkles, ChevronDown } from "lucide-react";

const features = [
  { title: "Fast processing", desc: "Optimized analyze and download pipeline.", icon: Zap },
  { title: "Multiple platforms", desc: "Modular adapters for major media sites.", icon: Globe },
  { title: "Simple workflow", desc: "Paste, analyze, choose a format, save.", icon: Workflow },
  { title: "Mobile friendly", desc: "Designed for touch and small screens.", icon: Smartphone },
  { title: "Privacy-conscious", desc: "Recent history stays in your browser.", icon: Shield },
  { title: "Modern interface", desc: "Premium UI with subtle motion in any theme.", icon: Sparkles },
];

const faqs = [
  {
    q: "Can UNISAVE download private or restricted content?",
    a: "No. UNISAVE only works with publicly accessible media and does not bypass authentication, DRM, or paywalls.",
  },
  {
    q: "Do you remove watermarks?",
    a: "No. UNISAVE presents legitimately available source variants and does not manipulate watermarks.",
  },
  {
    q: "Do I need an account?",
    a: "Basic usage works without an account. Optional accounts will unlock dashboard features in future releases.",
  },
  {
    q: "Is UNISAVE completely free to use?",
    a: "Yes! UNISAVE is 100% free for public link analysis and media downloading without any registration required.",
  },
];

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
      {children}
    </h2>
  );
}

export function SupportedPlatformsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionTitle>Supported Platforms</SectionTitle>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-muted-foreground sm:text-base">
          Paste a public link from any major network below — we detect the source automatically.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORMS.map((p, i) => (
          <PlatformCard key={p.id} platform={p} index={i} />
        ))}
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const reduce = useReducedMotion();
  const steps = [
    { n: "01", title: "Paste Link", desc: "Drop any public video, reel, or media URL into UNISAVE." },
    { n: "02", title: "Analyze Formats", desc: "We instantly detect the platform and extract available qualities." },
    { n: "03", title: "Instant Save", desc: "Select video or audio format and download directly to your device." },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionTitle>How It Works</SectionTitle>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-muted-foreground">
          Three simple steps to save high quality media from anywhere.
        </p>
      </Reveal>
      <motion.div
        className="mt-10 grid gap-5 md:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {steps.map((s) => (
          <motion.div
            key={s.n}
            variants={fadeUpItem}
            whileHover={reduce ? undefined : { y: -5 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <Card className="relative h-full p-6 transition-all duration-300 hover:border-violet-500/40 hover:shadow-xl">
              <span className="inline-block rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1 font-mono text-sm font-bold text-violet-500 dark:text-violet-300">
                {s.n}
              </span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export function FeaturesSection() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionTitle>Engineered for Speed & Quality</SectionTitle>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-muted-foreground">
          Built with modern web standards for a seamless experience on any device.
        </p>
      </Reveal>
      <motion.div
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <motion.div key={f.title} variants={fadeUpItem}>
              <motion.div
                whileHover={reduce ? undefined : { y: -4 }}
                transition={{ type: "spring", stiffness: 380, damping: 26 }}
              >
                <Card className="group h-full p-6 transition-all duration-300 hover:border-violet-500/35 hover:shadow-lg">
                  <div className="mb-4 inline-flex rounded-2xl bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-violet-500/15 p-3 text-violet-500 transition-all duration-300 group-hover:scale-110 group-hover:from-indigo-500/25 group-hover:to-violet-500/25 dark:text-violet-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionTitle>Frequently Asked Questions</SectionTitle>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-muted-foreground">
          Everything you need to know about UNISAVE media processing.
        </p>
      </Reveal>
      <motion.div
        className="mt-10 space-y-3.5"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        {faqs.map((f, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div key={f.q} variants={fadeUpItem}>
              <Card className="overflow-hidden transition-all duration-300 hover:border-violet-500/35">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left font-semibold text-foreground transition hover:text-violet-500"
                >
                  <span className="text-base">{f.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-violet-500" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: easeOut }}
                    >
                      <div className="border-t border-[var(--card-border)] px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionTitle>Ready to Save Media?</SectionTitle>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm font-medium text-muted-foreground">
          Paste your video or reel link above and download in seconds.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <MediaDownloader />
      </Reveal>
      <Reveal delay={0.15} className="mt-10">
        <DownloadHistory />
      </Reveal>
    </section>
  );
}

