/** Lightweight trust signals — representative feedback from customer types. */
const ITEMS = [
  {
    quote: 'Finally one booking flow for cartons—no more ten phone calls to find a tempo in Khatu.',
    role: 'Retail shop owner · Rajasthan',
  },
  {
    quote: 'Upfront fare before the vehicle moves makes it easier to justify delivery to our finance team.',
    role: 'Wholesale distributor · NCR',
  },
  {
    quote: 'Same-day runs for kitchen supplies during peak season—drivers understand cargo, not ratings.',
    role: 'Restaurant operations · Hyperlocal',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="page-section bg-white" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="testimonials-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">
          What businesses say
        </h2>
        <p className="mt-2 text-gray-500 mb-10 sm:mb-12 text-sm sm:text-base">
          Feedback from B2B and high-frequency shippers
        </p>
        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          {ITEMS.map((item) => (
            <li
              key={item.quote}
              className="rounded-xl border border-gray-100 bg-[var(--landing-bg)] p-5 sm:p-6"
            >
              {/* Quote mark */}
              <svg className="h-6 w-6 text-[var(--color-accent)]/40 mb-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
              </svg>
              <blockquote className="text-sm leading-relaxed text-gray-700 sm:text-base">&ldquo;{item.quote}&rdquo;</blockquote>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">{item.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
