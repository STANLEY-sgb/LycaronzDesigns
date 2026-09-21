import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Toaster } from 'sonner';
import VisitTracker from '@/components/VisitTracker';
import MobileBottomNav from '@/components/MobileBottomNav';
import { BUSINESS_INFO } from '@/lib/constants';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const serifFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['600', '700', '800', '900'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0D1F',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://lycaronzdesigns.com'),
  title: {
    default: 'LYCARONZ DESIGNS | Haute Couture & Bespoke Tailoring Atelier',
    template: '%s | LYCARONZ DESIGNS',
  },
  description:
    'Kampala’s premier fashion atelier for bespoke African couture, custom tailored suits, breathtaking wedding gowns, and precision alterations at Jemba Plaza.',
  keywords: [
    'LYCARONZ DESIGNS',
    'Lycaronz Designs',
    'Bespoke Tailoring Kampala',
    'African Fashion Uganda',
    'Ankara Dresses',
    'Custom Wedding Gowns',
    'Men Custom Suits',
    'Jemba Plaza Tailors',
    'Dressmaking Kampala',
    'Haute Couture Uganda',
  ],
  authors: [{ name: 'LYCARONZ DESIGNS' }],
  creator: 'LYCARONZ DESIGNS',
  publisher: 'LYCARONZ DESIGNS',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  openGraph: {
    title: 'LYCARONZ DESIGNS | Haute Couture & Bespoke Tailoring',
    description:
      'Exquisite bespoke fashion, master tailoring, and signature silhouettes. Visit our Jemba Plaza atelier in Kampala.',
    url: 'https://lycaronzdesigns.com',
    siteName: 'LYCARONZ DESIGNS',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'LYCARONZ DESIGNS Haute Couture',
      },
    ],
    locale: 'en_UG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LYCARONZ DESIGNS | Haute Couture Atelier',
    description: 'Bespoke tailoring, custom African couture, and designer bridal gowns in Kampala.',
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: BUSINESS_INFO.name,
    description: BUSINESS_INFO.tagline,
    url: 'https://lycaronzdesigns.com',
    telephone: BUSINESS_INFO.primaryPhone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.location,
      addressLocality: 'Kampala',
      addressCountry: 'UG',
    },
    openingHours: 'Mo-Sa 08:00-19:00',
    priceRange: 'UGX',
    image: 'https://lycaronzdesigns.com/images/logo.png',
  };

  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#FAF8F5] text-gray-900 font-sans antialiased selection:bg-amber-400 selection:text-black">
        <Providers>
          {children}
          <VisitTracker />
          <MobileBottomNav />
          <Toaster 
            position="top-center" 
            richColors 
            toastOptions={{
              style: {
                borderRadius: '16px',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
