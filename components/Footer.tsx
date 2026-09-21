'use client';

import Link from 'next/link';
import { BUSINESS_INFO } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Lycaronz Designs</h3>
            <p className="text-gray-300">{BUSINESS_INFO.tagline}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Custom Tailoring</li>
              <li>Repairs & Alterations</li>
              <li>Fitting Services</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-300 text-sm mb-2">{BUSINESS_INFO.location}</p>
            <p className="text-gray-300 text-sm mb-2">
              {BUSINESS_INFO.phone.split('/').map((p, i) => (
                <span key={i}>
                  <a href={`tel:${p.replace(/\D/g, '')}`} className="hover:underline">{p.trim()}</a>{i < BUSINESS_INFO.phone.split('/').length - 1 ? ' / ' : ''}
                </span>
              ))}
            </p>
            <p className="text-gray-300 text-sm mb-2">
              {BUSINESS_INFO.whatsapp.split('/').map((w, i) => (
                <span key={i}>
                  <a href={`https://wa.me/${w.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition">{w.trim()}</a>{i < BUSINESS_INFO.whatsapp.split('/').length - 1 ? ' / ' : ''}
                </span>
              ))}
            </p>
            <p className="text-gray-300 text-sm"><a href={`mailto:${BUSINESS_INFO.email}`} className="hover:underline">{BUSINESS_INFO.email}</a></p>
          </div>
        </div>

        <div className="border-t border-gray-500 pt-8 text-center text-gray-300">
          <p>&copy; 2026 Lycaronz Designs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
