"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  "URL detected",
  "Platform identified",
  "Fetching media information",
  "Preparing available formats",
];

export function AnalyzeProgress({ activeStep }: { activeStep: number }) {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-foreground">Analyzing your link...</p>
      <ul className="mt-4 space-y-3">
        {steps.map((step, index) => {
          const done = index < activeStep;
          const current = index === activeStep;
          return (
            <motion.li
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : current ? (
                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
              ) : (
                <Circle className="h-4 w-4 text-zinc-600" />
              )}
              <span className={done || current ? "text-foreground" : ""}>
                {step}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </Card>
  );
}
