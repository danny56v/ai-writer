"use client";

import { createContext, useContext } from "react";

type ThemeContextValue = {
  theme: "light";
  toggleTheme: () => void;
  setTheme: () => void;
};

const defaultValue: ThemeContextValue = {
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
};

const ThemeContext = createContext<ThemeContextValue>(defaultValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeContext.Provider value={defaultValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
