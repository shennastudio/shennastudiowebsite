import { useState, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  actualMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

// Check system preference
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Update CSS variables based on theme
function applyTheme(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.setProperty('--background-primary', '#0f1419');
    root.style.setProperty('--background-secondary', '#1a1f2e');
    root.style.setProperty('--background-tertiary', '#242b3d');
    root.style.setProperty('--background-elevated', '#2a3245');
    root.style.setProperty('--text-primary', '#f0f4f8');
    root.style.setProperty('--text-secondary', '#a0aec0');
    root.style.setProperty('--text-muted', '#718096');
    root.style.setProperty('--border-color', '#374151');
    root.style.setProperty('--accent-primary', '#06b6d4');
    root.style.setProperty('--accent-secondary', '#22d3ee');
    root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)');
    root.style.setProperty('--success-color', '#10b981');
    root.style.setProperty('--warning-color', '#f59e0b');
    root.style.setProperty('--error-color', '#ef4444');
    root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.3)');
    root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3)');
    root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.3)');
    root.style.setProperty('--shadow-glow', '0 0 20px rgba(6, 182, 212, 0.3)');
  } else {
    root.classList.remove('dark');
    root.style.setProperty('--background-primary', '#f8fafc');
    root.style.setProperty('--background-secondary', '#ffffff');
    root.style.setProperty('--background-tertiary', '#f1f5f9');
    root.style.setProperty('--background-elevated', '#ffffff');
    root.style.setProperty('--text-primary', '#0f172a');
    root.style.setProperty('--text-secondary', '#475569');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--border-color', '#e2e8f0');
    root.style.setProperty('--accent-primary', '#0891b2');
    root.style.setProperty('--accent-secondary', '#06b6d4');
    root.style.setProperty('--accent-gradient', 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)');
    root.style.setProperty('--success-color', '#059669');
    root.style.setProperty('--warning-color', '#d97706');
    root.style.setProperty('--error-color', '#dc2626');
    root.style.setProperty('--shadow-sm', '0 1px 2px 0 rgb(0 0 0 / 0.05)');
    root.style.setProperty('--shadow-md', '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)');
    root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)');
    root.style.setProperty('--shadow-glow', '0 0 20px rgba(8, 145, 178, 0.2)');
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      actualMode: typeof window !== 'undefined' ? getSystemTheme() : 'dark',
      
      setMode: (mode) => {
        set({ mode });
        const actual = mode === 'system' ? getSystemTheme() : mode;
        set({ actualMode: actual });
        applyTheme(actual);
      },
      
      toggleMode: () => {
        const current = get().actualMode;
        const next = current === 'light' ? 'dark' : 'light';
        set({ actualMode: next, mode: next });
        applyTheme(next);
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const actual = state.mode === 'system' ? getSystemTheme() : state.mode;
          setTimeout(() => applyTheme(actual), 0);
        }
      },
    }
  )
);

// Initialize theme on mount
export function initializeTheme() {
  if (typeof window === 'undefined') return;
  
  const stored = localStorage.getItem('theme-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const mode = parsed.state?.mode || 'system';
      const actual = mode === 'system' ? getSystemTheme() : mode;
      applyTheme(actual);
    } catch {
      applyTheme('dark');
    }
  }
}

// Hook to use theme in components
export function useTheme() {
  const { mode, actualMode, setMode, toggleMode } = useThemeStore();
  return { mode, actualMode, setMode, toggleMode };
}

// CSS Variables for use in styled components
export const themeVars = {
  background: {
    primary: 'var(--background-primary)',
    secondary: 'var(--background-secondary)',
    tertiary: 'var(--background-tertiary)',
    elevated: 'var(--background-elevated)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },
  border: 'var(--border-color)',
  accent: {
    primary: 'var(--accent-primary)',
    secondary: 'var(--accent-secondary)',
    gradient: 'var(--accent-gradient)',
  },
  status: {
    success: 'var(--success-color)',
    warning: 'var(--warning-color)',
    error: 'var(--error-color)',
  },
  shadow: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    glow: 'var(--shadow-glow)',
  },
};
