'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const isProd = process.env.NODE_ENV === 'production';

export default function RootError({
 error,
 reset,
}: {
 error: Error & { digest?: string };
 reset: () => void;
}) {
 useEffect(() => {
  console.error(error);
 }, [error]);

 return (
  <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4">
   {/* Icon */}
   <div className="grid h-16 w-16 place-items-center rounded-2xl bg-red-50">
    <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
   </div>

   <div className="text-center">
    <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
    <p className="mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">
     {isProd ? 'An unexpected error occurred. Please try again or return to the homepage.' : error.message}
    </p>
   </div>

   <div className="flex gap-3">
    <button
     type="button"
     onClick={reset}
     className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
     Try again
    </button>
    <Link
     href={ROUTES.HOME}
     className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300"
    >
     Go home
    </Link>
   </div>
  </div>
 );
}
