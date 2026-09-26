"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { PlatformMeta } from "@/types/platform";
import { Card } from "@/components/ui/card";
import { PlatformLogo } from "./platform-logo";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { easeOut } from "@/lib/motion";

export function PlatformCard({
  platform,
  className,
  index = 0,
}: {
  platform: PlatformMeta;
  className?: string;
  index?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn("h-full", className)}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: easeOut }}
    >
      <Link href={`/${platform.slug}`} className="group block h-full">
        <motion.div
          whileHover={reduce ? undefined : { y: -4, scale: 1.01 }}
          whileTap={reduce ? undefined : { scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
        >
          <Card className="relative h-full overflow-hidden p-5 transition-shadow duration-300 group-hover:border-violet-500/35 group-hover:shadow-lg dark:group-hover:shadow-violet-500/15">
            <motion.div
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl"
              style={{ backgroundColor: platform.color }}
              initial={{ opacity: 0.07 }}
              whileHover={{ opacity: 0.18, scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
            <div className="flex items-center gap-4">
              <motion.div whileHover={reduce ? undefined : { rotate: [-2, 2, 0] }} transition={{ duration: 0.35 }}>
                <PlatformLogo platform={platform.id} size="md" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{platform.name}</p>
                <p className="text-xs text-muted-foreground">Public media URLs</p>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-500"
                aria-hidden
              />
            </div>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}
