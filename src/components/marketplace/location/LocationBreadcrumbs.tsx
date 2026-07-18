import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface LocationBreadcrumbsProps {
  locationName: string;
}

export default function LocationBreadcrumbs({ locationName }: LocationBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Locations' },
    { name: locationName },
  ];

  return (
    <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ol className="flex h-12 items-center space-x-2 text-sm text-gray-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.name} className="flex items-center">
                {index > 0 && <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />}
                
                {isLast ? (
                  <span className="font-semibold text-gray-900" aria-current="page">
                    {item.name}
                  </span>
                ) : item.href ? (
                  <Link 
                    href={item.href}
                    className="flex items-center hover:text-orange-600 transition-colors"
                  >
                    {index === 0 ? <Home className="mr-1.5 h-4 w-4" /> : null}
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-gray-500">{item.name}</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
