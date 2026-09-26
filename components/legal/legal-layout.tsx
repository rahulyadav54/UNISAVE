import type { ReactNode } from "react";

export function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">{title}</h1>
      <div className="prose prose-invert mt-6 max-w-none space-y-4 text-sm leading-relaxed text-zinc-400">
        {children}
      </div>
    </div>
  );
}
