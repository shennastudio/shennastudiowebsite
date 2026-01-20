'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇲🇽' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export function LanguageSelector() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [googleTranslateReady, setGoogleTranslateReady] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Find Google Translate dropdown
  const findGoogleTranslateSelect = useCallback((): HTMLSelectElement | null => {
    return document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  }, []);

  // Attempt to change language via Google Translate
  const attemptLanguageChange = useCallback((langCode: string): boolean => {
    const select = findGoogleTranslateSelect();
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }, [findGoogleTranslateSelect]);

  // Handle language change
  const handleLanguageChange = useCallback((langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    const selectedLang = languages.find(l => l.code === langCode);

    // Apply RTL for Arabic
    if (selectedLang?.dir === 'rtl') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = langCode;
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = langCode;
    }

    // Try to change via Google Translate immediately
    if (!attemptLanguageChange(langCode)) {
      // Retry with exponential backoff
      let attempts = 0;
      const maxAttempts = 10;
      const baseDelay = 100;

      const retry = () => {
        attempts++;
        const delay = Math.min(baseDelay * Math.pow(1.5, attempts - 1), 1000);

        if (attemptLanguageChange(langCode)) {
          console.log(`[LanguageSelector] Successfully changed to ${langCode} on attempt ${attempts}`);
          return;
        }

        if (attempts < maxAttempts) {
          retryTimeoutRef.current = setTimeout(retry, delay);
        } else {
          console.warn(`[LanguageSelector] Failed to change language to ${langCode} after ${maxAttempts} attempts`);
        }
      };

      retryTimeoutRef.current = setTimeout(retry, baseDelay);
    }
  }, [attemptLanguageChange, findGoogleTranslateSelect]);

  useEffect(() => {
    setMounted(true);

    // Poll for Google Translate to be ready
    const checkGoogleTranslate = setInterval(() => {
      const select = findGoogleTranslateSelect();
      if (select && !googleTranslateReady) {
        setGoogleTranslateReady(true);
        // Sync current language from Google Translate
        if (select.value) {
          setCurrentLang(select.value);
        }
      }
    }, 200);

    // Listen for language changes made via Google Translate widget
    const handleGoogleTranslateChange = () => {
      const select = findGoogleTranslateSelect();
      if (select && select.value) {
        setCurrentLang(select.value);
        const selectedLang = languages.find(l => l.code === select.value);
        if (selectedLang?.dir === 'rtl') {
          document.documentElement.dir = 'rtl';
          document.documentElement.lang = select.value;
        } else {
          document.documentElement.dir = 'ltr';
          document.documentElement.lang = select.value;
        }
      }
    };

    // Observe for new elements being added (Google Translate loads dynamically)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            const element = node as Element;
            if (element.classList?.contains('goog-te-combo')) {
              setGoogleTranslateReady(true);
              // Try to sync language
              const select = element as HTMLSelectElement;
              if (select.value) {
                setCurrentLang(select.value);
              }
            }
          }
        });
      });
    });

    document.body && observer.observe(document.body, { childList: true, subtree: true });

    // Also listen to the select's change event
    document.addEventListener('mouseup', handleGoogleTranslateChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(checkGoogleTranslate);
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mouseup', handleGoogleTranslateChange);
      observer.disconnect();
    };
  }, [findGoogleTranslateSelect, googleTranslateReady]);

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="w-28 h-9 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm"
        aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="text-gray-700 font-medium hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden max-h-80 overflow-y-auto">
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left ${
                    currentLang === lang.code
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {currentLang === lang.code && (
                    <svg className="w-4 h-4 ml-auto text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
