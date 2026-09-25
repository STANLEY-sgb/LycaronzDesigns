'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { BUSINESS_INFO } from '@/lib/constants';

interface ProductCardProps {
  id: string;
  name: string;
  price: number | null;
  image?: string | null;
  imageUrl?: string | null;
  category: string;
  description?: string | null;
  video?: string | null;
  featured?: boolean;
}

export default function ProductCard({
  id,
  name,
  price,
  image,
  imageUrl,
  category,
}: ProductCardProps) {
  const selectedMedia = imageUrl || image || '';
  const [imgError, setImgError] = useState(false);

  const formattedPrice =
    price && price > 0 ? `UGX ${price.toLocaleString()}` : 'Custom Quote';

  const directWhatsappUrl = `https://wa.me/${BUSINESS_INFO.primaryWhatsappRaw}?text=${encodeURIComponent(
    `Hello Lycaronz Designs! I would like to order/inquire about "${name}" (${formattedPrice}).`
  )}`;

  return (
    <article className="group relative bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-500 flex flex-col h-full w-full min-w-0">

      {/* Product Image Frame */}
      <Link
        href={`/product/${id}`}
        className="block relative aspect-[4/5] bg-gray-100 overflow-hidden"
        aria-label={`View details for ${name}`}
      >
        {selectedMedia && !imgError ? (
          <Image
            src={selectedMedia}
            alt={`${name} – ${category} by LYCARONZ DESIGNS`}
            fill
            sizes="(max-width: 640px) 95vw, (max-width: 1024px) 48vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#0A0D1F]/5 via-slate-100 to-amber-50">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-primary font-black text-xl mb-2">
              LD
            </div>
            <span className="font-black text-gray-500 uppercase tracking-widest text-[11px] line-clamp-2">
              {name}
            </span>
          </div>
        )}

        {/* Ambient Gradient on Hover */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          aria-hidden="true"
        />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-[#0A0D1F]/90 backdrop-blur-md text-amber-300 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.15em] shadow-md border border-amber-400/30 flex items-center gap-1">
            <Sparkles size={9} className="text-amber-400" aria-hidden="true" />
            <span className="max-w-[90px] truncate">{category}</span>
          </span>
        </div>

        {/* View Details Floating Chip */}
        <div
          className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          aria-hidden="true"
        >
          <span className="px-3 py-1.5 rounded-xl bg-white text-gray-900 font-bold text-xs shadow-xl flex items-center gap-1">
            <span>Details</span>
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>

      {/* Card Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div className="min-w-0">
          <Link href={`/product/${id}`}>
            <h3 className="font-black text-sm sm:text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight mb-1">
              {name}
            </h3>
          </Link>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
            Haute Couture • Bespoke
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100 gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
              Price
            </span>
            <span className="text-gray-950 font-black text-sm sm:text-base tracking-tight truncate">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Inquire about ${name} on WhatsApp`}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-50 hover:bg-green-100 text-[#25D366] flex items-center justify-center transition-all border border-green-200 active:scale-95"
            >
              <MessageCircle size={15} aria-hidden="true" />
            </a>

            <Link
              href={`/product/${id}`}
              aria-label={`View full details for ${name}`}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0A0D1F] hover:bg-primary text-white flex items-center justify-center transition-all shadow-sm active:scale-95"
            >
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
