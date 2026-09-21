'use client';

import Image from 'next/image';

export interface LogoProps {
  /** Size preset or pixel dimension */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /** Custom className applied to the outer circular wrapper */
  className?: string;
  /** Whether this logo image should be loaded with priority */
  priority?: boolean;
  /** Whether to show the luxury gold border ring (default: true) */
  showRing?: boolean;
  /** Alt text for accessibility */
  alt?: string;
}

const SIZE_MAP = {
  xs: { box: 'w-7 h-7', px: 28, pad: 'p-0.5' },
  sm: { box: 'w-9 h-9', px: 36, pad: 'p-0.5' },
  md: { box: 'w-11 h-11 xs:w-12 xs:h-12', px: 48, pad: 'p-1' },
  lg: { box: 'w-14 h-14 sm:w-16 sm:h-16', px: 64, pad: 'p-1.5' },
  xl: { box: 'w-24 h-24 sm:w-28 sm:h-28', px: 112, pad: 'p-2.5' },
};

/**
 * Official LYCARONZ DESIGNS circular luxury medallion logo.
 * Precision-cut circular cameo framed with a metallic gold jewelry rim,
 * subtle inner bevel, and soft ambient golden halo.
 */
export default function Logo({
  size = 'md',
  className = '',
  priority = false,
  showRing = true,
  alt = 'LYCARONZ DESIGNS Official Logo',
}: LogoProps) {
  const isPreset = typeof size === 'string' && size in SIZE_MAP;
  const config = isPreset ? SIZE_MAP[size as keyof typeof SIZE_MAP] : null;
  const customPx = typeof size === 'number' ? size : 48;

  return (
    <div
      className={`relative rounded-full shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
        showRing
          ? 'p-[2px] sm:p-[2.5px] bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-500 shadow-[0_0_18px_rgba(251,191,36,0.35)] hover:shadow-[0_0_26px_rgba(251,191,36,0.55)]'
          : ''
      } ${config ? config.box : ''} ${className}`}
      style={!config ? { width: customPx, height: customPx } : undefined}
    >
      {/* Inner white circle with subtle inner shadow & gold rim separation */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-inner flex items-center justify-center border border-amber-200/40">
        {/* Ambient top glass reflection highlight */}
        <div
          className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10 rounded-t-full"
          aria-hidden="true"
        />

        <Image
          src="/images/logo.png"
          alt={alt}
          fill
          priority={priority}
          sizes={config ? `${config.px}px` : `${customPx}px`}
          className={`object-contain rounded-full select-none ${
            config ? config.pad : 'p-1'
          }`}
        />
      </div>
    </div>
  );
}
