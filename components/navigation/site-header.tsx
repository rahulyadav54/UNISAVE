"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { easeOut } from "@/lib/motion";

const links = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/platforms", label: "Platforms" },
  { href: "/api-docs", label: "API" },
  { href: "/about", label: "About" },
];


export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <motion.header
      initial={reduce ? false : { y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: easeOut }}
      className="sticky top-0 z-50 border-b border-[var(--header-border)] bg-[var(--header-bg)] shadow-sm backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04, ease: easeOut }}
            >
              <Link
                href={link.href}
                className="relative rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground transition hover:bg-violet-500/10 hover:text-foreground"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <ThemeToggle />
          <Button variant="secondary" size="sm" asChild>
            <Link href="/dashboard">Sign In</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <motion.div
        className={cn("border-t border-[var(--card-border)] md:hidden overflow-hidden")}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.25, ease: easeOut }}
      >
        <nav className="flex flex-col gap-1 px-4 py-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-violet-500/10"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex items-center gap-2">
            <ThemeToggle />
            <Button variant="secondary" size="sm" asChild className="flex-1">
              <Link href="/dashboard">Sign In</Link>
            </Button>
          </div>
        </nav>
      </motion.div>
    </motion.header>
  );
}
