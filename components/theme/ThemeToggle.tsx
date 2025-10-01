"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-white/40 bg-white/70 p-2 text-gray-700 shadow-sm transition hover:bg-white dark:border-slate-600/70 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-700"
      }
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
