import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[var(--input-border)] bg-[var(--input-bg)] px-4 py-2 text-base text-foreground placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-inner dark:shadow-black/20",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
