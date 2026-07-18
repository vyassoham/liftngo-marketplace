'use client';

import Image from '@/components/OptimizedImage';
import { SITE_NAME, LOGO_PATH } from '@/lib/site';

/**
 * Compact app roadmap banner — native apps coming soon; mobile web is live.
 */
export default function AppDownloadSection() {
  return (
    <section
      id="download"
      className="page-section w-full bg-[var(--landing-bg)]"
      aria-labelledby="download-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-[var(--color-primary)] p-2.5 sm:h-16 sm:w-16">
              <div className="grid h-full w-full place-items-center rounded-lg bg-white p-1.5">
                <Image
                  src={LOGO_PATH}
                  alt={`${SITE_NAME} logo`}
                  width={72}
                  height={40}
                  className="h-auto w-full max-h-7 object-contain"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="download-heading" className="text-lg font-semibold text-gray-900 sm:text-xl">
                Native apps coming soon
              </h2>
              <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                Customer and Driver apps for Play Store &amp; App Store are in development.{' '}
                <strong className="font-medium text-gray-700">Right now</strong>, use Liftngo in your browser on any phone — fully functional on mobile web.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
