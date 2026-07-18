import BlogCard from './BlogCard';
import { getPostsForHomeSection } from '@/lib/blog';
import Link from 'next/link';

export default function BlogSection() {
  const posts = getPostsForHomeSection(3);

  return (
    <section
      id="blogs"
      className="page-section bg-[var(--landing-bg)]"
      aria-labelledby="blogs-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="blogs-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              From the blog
            </h2>
            <p className="mt-1 text-sm text-gray-500">Insights on logistics, delivery, and operations</p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors"
          >
            View all →
          </Link>
        </div>

        <div
          className="scrollbar-hide flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {posts.map((post, i) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              snippet={post.excerpt}
              imageSrc={post.featuredImage}
              imageAlt={post.featuredImageAlt}
              href={`/blog/${post.slug}`}
              priority={i === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
