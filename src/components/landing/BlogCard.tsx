import Image from '@/components/OptimizedImage';
import Link from 'next/link';

export interface BlogCardProps {
  title: string;
  snippet: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
  priority?: boolean;
}

export default function BlogCard({ title, snippet, imageSrc, imageAlt, href, priority = false }: BlogCardProps) {
  return (
    <article
      className="group relative flex flex-shrink-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-shadow hover:shadow-[var(--shadow-elevated)] w-[min(80vw,18rem)] sm:w-[min(72vw,20rem)] md:w-full"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-44 overflow-hidden">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 80vw, 33vw"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
          {snippet}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-light)]"
        >
          Read more
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
