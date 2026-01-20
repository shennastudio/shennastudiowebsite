'use client';

import { useEffect, useState, useRef } from 'react';

export function LanguageSelector() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const initGoogleTranslate = () => {
      if (typeof window !== 'undefined' && (window as any).google?.translate) {
        const existingCombo = document.querySelector('.goog-te-combo');
        if (existingCombo) {
          existingCombo.remove();
        }

        const existingBar = document.querySelector('.goog-te-banner-frame');
        if (existingBar) {
          existingBar.remove();
        }

        try {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,es,fr,de,it,pt,zh-CN,ja,ko,ar,ru,nl,pl,tr,vi,th,hi,uk,he',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            autoDisplay: false,
            multilanguagePage: true,
          }, 'google_translate_element');
        } catch (error) {
          console.error('Error initializing Google Translate:', error);
        }
      }
    };

    const checkGoogleLoaded = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).google?.translate) {
        clearInterval(checkGoogleLoaded);
        setTimeout(initGoogleTranslate, 100);
      }
    }, 50);

    return () => {
      clearInterval(checkGoogleLoaded);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center">
        <div className="w-32 h-9 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center relative" ref={containerRef}>
      <div 
        id="google_translate_element" 
        className="flex items-center min-w-[160px]"
      />
      
      <style jsx global>{`
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-menu-value:hover {
          text-decoration: none;
        }
        .goog-te-combo {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
          background-color: white;
          font-size: 14px;
          color: #0f766e;
          cursor: pointer;
          min-width: 150px;
        }
        .goog-te-combo:focus {
          outline: none;
          border-color: #0d9488;
          box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: inline !important;
        }
        .goog-te-spinner {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
