import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'sonner';
import VisitTracker from '@/components/VisitTracker';

export const metadata: Metadata = {
  title: 'Lycaronz Designs - Custom Tailoring & Fashion',
  description: 'Modern tailoring and fashion e-commerce shop. Exquisite style, perfect fit.',
  keywords: ['Lycaronz', 'Lycaronz Designs', 'Tailoring', 'Custom Tailoring', 'Dressmaking', 'Boutique', 'Kampala'],
  openGraph: {
    title: 'Lycaronz Designs',
    description: 'Exquisite Style, Perfect Fit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lycaronz Designs',
    description: 'Exquisite Style, Perfect Fit',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <Providers>
          {children}
          <VisitTracker />
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
