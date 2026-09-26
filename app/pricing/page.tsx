import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
        <Sparkles className="h-3.5 w-3.5" /> 100% Free & Unlimited Media Processing
      </div>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        No Paywalls. No Limits. Ever.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg">
        UNISAVE is completely free to use for analyzing and downloading public media from all supported platforms.
      </p>

      <Card className="mt-10 p-8 sm:p-10 shadow-xl border-violet-500/30 text-left">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-[var(--card-border)] pb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">Unlimited Access Plan</h2>
            <p className="mt-1 text-sm font-medium text-muted-foreground">Unlimited public link analysis & high-speed media downloads</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-5xl font-black text-foreground">$0</span>
            <span className="text-sm font-semibold text-muted-foreground"> / forever</span>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "100% Free for unlimited downloads",
            "No credit card or subscription required",
            "No account or sign-up needed",
            "High-speed server media extraction",
            "Multiple video & audio quality formats",
            "Zero watermarks added by UNISAVE",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--card-border)] flex justify-center">
          <Button size="lg" className="px-8 font-bold shadow-lg shadow-violet-500/25" asChild>
            <Link href="/">Start Saving Media Now</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}


