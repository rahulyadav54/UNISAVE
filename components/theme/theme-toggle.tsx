"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const next =
    theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon =
    theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

