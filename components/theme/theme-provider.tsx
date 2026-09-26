"use client";

import * as React from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const ThemeContext = React.createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  resolvedTheme: "dark",
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark");
  const [resolvedTheme, setResolvedTheme] = React.useState<"dark" | "light">("dark");

  React.useEffect(() => {
    const saved = localStorage.getItem("unisave-theme") as Theme | null;
    if (saved && ["dark", "light", "system"].includes(saved)) {
      setThemeState(saved);
    }
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const activeTheme =
        theme === "system" ? (media.matches ? "dark" : "light") : theme;

      root.classList.remove("dark", "light");
      root.classList.add(activeTheme);
      root.setAttribute("data-theme", activeTheme);
      setResolvedTheme(activeTheme);
    };

    applyTheme();

    if (theme === "system") {
      const listener = () => applyTheme();
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, [theme]);

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem("unisave-theme", nextTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}

