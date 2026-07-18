'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      router.back();
    }
  };

  const content = (
    <div className={`flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}>
      <ArrowLeft className="h-5 w-5" />
      <span className="font-medium">{label}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} onClick={handleClick}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={handleClick} className="border-0 bg-transparent p-0 cursor-pointer">
      {content}
    </button>
  );
}
