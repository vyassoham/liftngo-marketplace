'use client';

import { MARKETPLACE_SUPPORT } from '@/lib/marketplace/constants';
import { Phone, MessageCircle, Globe } from 'lucide-react';

export default function MarketplaceFooter({ locationName }: { locationName?: string }) {
  const displayLocation = locationName ? `${locationName} Marketplace` : 'Liftngo Marketplace';

  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{displayLocation}</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your local businesses, delivered by Liftngo
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-orange-600">Powered by Liftngo</span>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Customer Support</h4>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <a href={`tel:${MARKETPLACE_SUPPORT.PHONE}`} className="hover:text-orange-600">
                  {MARKETPLACE_SUPPORT.PHONE}
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <a
                  href={`https://wa.me/${MARKETPLACE_SUPPORT.WHATSAPP}`}
                  className="hover:text-orange-600"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="/help" className="hover:text-orange-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-orange-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* For Merchants */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900">For Merchants</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>
                <a href="/grow-with-liftngo" className="hover:text-orange-600">
                  Partner with Us
                </a>
              </li>
              <li>
                <a href="/contact#business-enquiry" className="hover:text-orange-600">
                  List Your Business
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} Liftngo. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <a href="https://goliftngo.com" className="hover:text-orange-600">
                goliftngo.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
