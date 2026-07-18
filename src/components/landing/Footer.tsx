'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from '@/components/OptimizedImage';
import { SITE_NAME, BRAND, LOGO_PATH, ONE_LINE_PITCH } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SOCIAL_LINKS } from '@/config/env';

type FooterLink = { href: string; label: string };

function FooterNavColumn({ idSlug, title, links }: { idSlug: string; title: string; links: readonly FooterLink[] }) {
  const headingId = `footer-nav-${idSlug}`;
  return (
    <nav className="min-w-0" aria-labelledby={headingId}>
      <h3 id={headingId} className="text-sm font-semibold text-white tracking-wide">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
        {links.map(({ href, label }) => (
          <li key={`${idSlug}:${href}:${label}`}>
            <Link href={href} className="transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 rounded">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const SERVICES: FooterLink[] = [
  { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
  { href: '/services', label: 'All services' },
  { href: ROUTES.FARE_CALCULATOR, label: 'Fare calculator' },
  { href: ROUTES.FLEET_BRANDING, label: 'Fleet branding' },
  { href: '/whatsapp-delivery-service', label: 'WhatsApp delivery' },
  { href: ROUTES.PLANS, label: 'Plans & pricing' },
];

const REGIONS: FooterLink[] = [
  { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida & Delhi NCR' },
  { href: ROUTES.B2B_TRANSPORT, label: 'B2B transport' },
  { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu Shyam Ji' },
  { href: '/logistics-khatu', label: 'Khatu corridor' },
  { href: '/b2b-logistics-rajasthan', label: 'Rajasthan logistics' },
  { href: '/hyperlocal-delivery-service', label: 'Hyperlocal delivery' },
];

const COMPANY: FooterLink[] = [
  { href: ROUTES.ABOUT, label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQs' },
  { href: '/careers', label: 'Careers' },
  { href: ROUTES.BECOME_DRIVER, label: 'Become a driver' },
  { href: ROUTES.CONTACT, label: 'Contact' },
  { href: '/legal-company-information', label: 'Legal info' },
];

const SOCIAL_ITEMS = [
  {
    key: 'youtube',
    href: SOCIAL_LINKS.youtube,
    label: 'YouTube',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: 'x',
    href: SOCIAL_LINKS.x,
    label: 'X',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    href: SOCIAL_LINKS.linkedin,
    label: 'LinkedIn',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    href: SOCIAL_LINKS.instagram,
    label: 'Instagram',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    key: 'facebook',
    href: SOCIAL_LINKS.facebook,
    label: 'Facebook',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [legalExpanded, setLegalExpanded] = useState(false);

  return (
    <footer className="w-full bg-gray-900 text-white" lang="en-IN">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Main grid: Brand + 3 nav columns */}
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4" aria-label={`${SITE_NAME} — home`}>
              <Image
                src={LOGO_PATH}
                alt={SITE_NAME}
                width={180}
                height={52}
                className="h-8 w-auto max-w-[180px] object-contain object-left"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">{BRAND?.shortDescription ?? ''}</p>

            {/* Social icons */}
            <div className="mt-6 flex gap-1">
              {SOCIAL_ITEMS.map((s) => (
                <a
                  key={s.key}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-lg text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={`${SITE_NAME} on ${s.label}`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterNavColumn idSlug="services" title="Services" links={SERVICES} />
          <FooterNavColumn idSlug="regions" title="Regions" links={REGIONS} />
          <FooterNavColumn idSlug="company" title="Company" links={COMPANY} />
        </div>

        {/* Legal collapsible */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <button
            type="button"
            onClick={() => setLegalExpanded(!legalExpanded)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <p className="text-sm font-semibold text-white">LiftnGo Logistics</p>
              <p className="mt-0.5 text-xs text-gray-500">Operated by Maalvahak Mobility · Puran Chand HUF</p>
            </div>
            <svg
              className={`h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200 ${legalExpanded ? 'rotate-180' : ''}`}
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
            data-open={legalExpanded ? 'true' : 'false'}
          >
            <div className="faq-answer-inner">
              <div className="mt-4 rounded-xl border border-gray-700/50 bg-gray-800/40 px-5 py-5">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs sm:grid-cols-3">
                  <div>
                    <p className="text-gray-500">GSTIN</p>
                    <p className="font-mono text-gray-300">07AAVHP9623B1ZT</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Udyam Reg. No.</p>
                    <p className="font-mono text-gray-300">UDYAM-DL-10-0108269</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Business Type</p>
                    <p className="text-gray-300">Logistics, Transport & Delivery</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-gray-300">liftngohuf@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Website</p>
                    <p className="text-gray-300">www.goliftngo.com</p>
                  </div>
                  <div className="flex items-end">
                    <Link
                      href="/legal-company-information"
                      className="inline-flex items-center gap-1 rounded-md border border-gray-600 bg-gray-700/60 px-3 py-1.5 text-[11px] font-semibold text-gray-300 transition-colors hover:border-gray-500 hover:text-white"
                    >
                      Full details →
                    </Link>
                  </div>
                </div>
                <p className="mt-4 border-t border-gray-700/50 pt-3 text-[11px] leading-relaxed text-gray-500">
                  LiftnGo Logistics is a brand operated by Maalvahak Mobility, a business unit of Puran Chand HUF. All services, invoices, contracts, and communications are provided under the registered business entity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start gap-4 border-t border-gray-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors">Sitemap</a>
          </div>
          <p className="text-sm text-gray-500">
            © {year} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
