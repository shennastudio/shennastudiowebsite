'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Mobile/Tablet: Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5 text-slate-200" />
      </button>

      {/* Desktop: Always Visible Search Bar */}
      <form onSubmit={handleSearch} className="hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bracelets..."
            className="w-56 xl:w-64 pl-10 pr-10 py-2 border border-white/10 rounded-full bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Mobile/Tablet: Full Screen Search Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-slate-950 z-50 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full text-slate-200"
            >
              <X className="h-6 w-6" />
            </button>
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bracelets..."
                  className="w-full pl-10 pr-4 py-3 border border-white/10 rounded-lg bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                  autoFocus
                />
              </div>
            </form>
          </div>

          {/* Quick Search Suggestions */}
          <div className="p-4">
            <p className="text-sm text-slate-400 mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Sea Turtle', 'Ocean Wave', 'Blue Beads', 'Conservation'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 bg-slate-900/80 text-cyan-300 rounded-full text-sm hover:bg-white/10 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
