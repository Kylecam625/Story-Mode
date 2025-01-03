import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Theme {
  name: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
  cursorColor: string;
  particleColor: string;
}

export const THEMES = {
  purple: {
    name: 'Purple Dream',
    primary: 'rgb(168, 85, 247)', // purple-500
    accent: 'rgb(147, 51, 234)', // purple-600
    background: 'rgb(31, 41, 55)', // gray-800
    text: 'rgb(192, 132, 252)', // purple-400
    cursorColor: 'rgba(168, 85, 247, 0.6)',
    particleColor: 'rgba(168, 85, 247, 0.4)'
  },
  emerald: {
    name: 'Emerald Forest',
    primary: 'rgb(16, 185, 129)', // emerald-500
    accent: 'rgb(5, 150, 105)', // emerald-600
    background: 'rgb(6, 78, 59)', // emerald-900
    text: 'rgb(110, 231, 183)', // emerald-300
    cursorColor: 'rgba(16, 185, 129, 0.6)',
    particleColor: 'rgba(16, 185, 129, 0.4)'
  },
  rose: {
    name: 'Rose Garden',
    primary: 'rgb(244, 63, 94)', // rose-500
    accent: 'rgb(225, 29, 72)', // rose-600
    background: 'rgb(28, 25, 23)', // stone-900
    text: 'rgb(251, 113, 133)', // rose-400
    cursorColor: 'rgba(244, 63, 94, 0.6)',
    particleColor: 'rgba(244, 63, 94, 0.4)'
  },
  sky: {
    name: 'Ocean Breeze',
    primary: 'rgb(14, 165, 233)', // sky-500
    accent: 'rgb(2, 132, 199)', // sky-600
    background: 'rgb(30, 41, 59)', // slate-800
    text: 'rgb(56, 189, 248)', // sky-400
    cursorColor: 'rgba(14, 165, 233, 0.6)',
    particleColor: 'rgba(14, 165, 233, 0.4)'
  }
} as const;

interface ThemeStore {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: THEMES.purple,
      setTheme: (theme) => set({ currentTheme: theme })
    }),
    {
      name: 'theme-storage'
    }
  )
);