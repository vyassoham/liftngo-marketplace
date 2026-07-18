'use client';

import { useState } from 'react';
import type { FaqItem } from '@/data/faq';
import { trackSelectContent } from '@/lib/analytics';

interface FaqAccordionListProps {
  items: readonly FaqItem[];
  className?: string;
  analyticsScope?: string;
}

export default function FaqAccordionList({
  items,
  className = '',
  analyticsScope = 'faq',
}: FaqAccordionListProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {items.map(({ id, question, answer }) => {
        const isOpen = openId === id;
        return (
          <div key={id} className="rounded-xl border border-gray-200 bg-white transition-colors hover:border-gray-300">
            <button
              type="button"
              onClick={() => {
                const next = isOpen ? null : id;
                setOpenId(next);
                if (next) {
                  trackSelectContent('faq_accordion', id, { page: analyticsScope });
                }
              }}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-gray-900 transition-colors sm:text-base"
              aria-expanded={isOpen}
            >
              <span className="min-w-0 flex-1 pr-2">{question}</span>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              className="faq-answer-wrapper"
              data-open={isOpen ? 'true' : 'false'}
            >
              <div className="faq-answer-inner">
                <div className="px-5 pb-4 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
