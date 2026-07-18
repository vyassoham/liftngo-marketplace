'use client';

import { useEffect, useRef, useState } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  imageUrl: string | null;
}

interface StorefrontNavProps {
  categories: Category[];
  accentColor: string;
}

export default function StorefrontNav({ categories, accentColor }: StorefrontNavProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync active category pill with scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map((c) =>
        document.getElementById(`section-${c.id}`)
      );

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140) {
          setActiveCategory(categories[i].id);
          return;
        }
      }
      setActiveCategory('all');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  const scrollToSection = (id: string) => {
    setActiveCategory(id);
    if (id === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`section-${id}`);
    if (!el) return;
    const offset = 80; // height of sticky nav
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Scroll the pill into view when it changes
  useEffect(() => {
    if (!scrollRef.current) return;
    const active = scrollRef.current.querySelector('[data-active="true"]') as HTMLElement;
    if (active) {
      active.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [activeCategory]);

  if (categories.length === 0) return null;

  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none"
        >
          {/* "All" pill */}
          <button
            data-active={activeCategory === 'all'}
            onClick={() => scrollToSection('all')}
            className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 flex-shrink-0"
            style={
              activeCategory === 'all'
                ? {
                    background: accentColor,
                    color: '#fff',
                    boxShadow: `0 2px 8px ${accentColor}55`,
                  }
                : {
                    background: '#F3F4F6',
                    color: '#374151',
                  }
            }
          >
            All
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              data-active={activeCategory === category.id}
              onClick={() => scrollToSection(category.id)}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 flex-shrink-0 flex items-center gap-1.5"
              style={
                activeCategory === category.id
                  ? {
                      background: accentColor,
                      color: '#fff',
                      boxShadow: `0 2px 8px ${accentColor}55`,
                    }
                  : {
                      background: '#F3F4F6',
                      color: '#374151',
                    }
              }
            >
              {category.icon && (
                <span className="text-sm leading-none">{category.icon}</span>
              )}
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
