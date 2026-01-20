'use client';

import { useEffect, useState } from 'react';

// Type declarations for Google Translate
declare global {
  interface Window {
    google?: {
      translate: {
        TranslateElement: {
          new (config: {
            pageLanguage: string;
            includedLanguages: string;
            layout: number;
            autoDisplay: boolean;
          }, element: string | HTMLElement): void;
          InlineLayout: {
            SIMPLE: number;
          };
        };
      };
    };
  }
}

export function LanguageSelector() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if Google Translate is loaded and initialize
    const initTranslate = () => {
      if (typeof window !== 'undefined' && window.google?.translate) {
        // Clean up any existing translation elements
        const existingElement = document.querySelector('.goog-te-combo');
        if (existingElement) {
          existingElement.remove();
        }

        try {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,zh,ja,ko,ar,ru',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          }, 'google_translate_element');
        } catch (e) {
          console.error('Error initializing Google Translate:', e);
        }
      }
    };

    // Wait for Google Translate to load
    const checkGoogle = setInterval(() => {
      if (typeof window !== 'undefined' && window.google?.translate) {
        clearInterval(checkGoogle);
        initTranslate();
      }
    }, 100);

    return () => {
      clearInterval(checkGoogle);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-9 bg-slate-100 rounded-lg animate-pulse" />
    );
  }

  return (
    <div className="flex items-center">
      <div id="google_translate_element" className="flex items-center" />
    </div>
  );
}
