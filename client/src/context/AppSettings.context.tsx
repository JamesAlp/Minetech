'use client';

import { ReactNode } from "react";

export type AppSettings = {
  darkMode: boolean;
};

const DEFAULTS: AppSettings = {
  darkMode: false
};

export function ThemeProvider({ children }: { children: ReactNode; }) {

}