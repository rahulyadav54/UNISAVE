import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] hover:scale-[1.02]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-violet-500/25 hover:brightness-110",
        secondary:
          "border border-[var(--card-border)] bg-[var(--card-bg)] text-foreground hover:border-violet-500/30 hover:bg-violet-500/5",
        ghost:
          "text-muted hover:bg-violet-500/10 hover:text-foreground",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
