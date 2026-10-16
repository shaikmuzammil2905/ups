import React, { useState } from 'react';
import { useBrands } from '../context/DataContext';
import apcLogo from '../assets/brand-apc.png';
import deltaLogo from '../assets/brand-delta.png';
import microtekLogo from '../assets/brand-microtek.png';
import luminousLogo from '../assets/brand-luminous.png';
import vertivLogo from '../assets/brand-vertiv.png';

// Fallback high-res static logos
const STATIC_LOGOS = {
  apc: { src: apcLogo, isLight: true, alt: 'APC by Schneider Electric' },
  delta: { src: deltaLogo, isLight: false, alt: 'Delta Power Solutions' },
  luminous: { src: luminousLogo, isLight: false, alt: 'Luminous Power Technologies' },
  microtek: { src: microtekLogo, isLight: false, alt: 'Microtek International' },
  vertiv: { src: vertivLogo, isLight: false, alt: 'Vertiv Liebert Power Systems' },
};

export default function BrandLogo({
  brand,
  brandId,
  logoUrl,
  bannerUrl,
  className = "h-12 md:h-14",
  showName = false,
  alt = ""
}) {
  const brands = useBrands();
  const [imgError, setImgError] = useState(false);

  // Resolve brand object and ID
  const bId = (brand?.id || brandId || '').toLowerCase();
  const bSlug = (brand?.slug || '').toLowerCase();
  const foundBrand = brand || brands?.find(b => 
    (b.id || '').toLowerCase() === bId || 
    (b.slug || '').toLowerCase() === bId ||
    (b.slug || '').toLowerCase() === bSlug ||
    (b.id || '').toLowerCase() === bSlug
  );

  // Dynamic image uploaded in Admin CMS / Supabase
  const dynamicImg = !imgError ? (
    logoUrl ||
    bannerUrl ||
    foundBrand?.banner_url ||
    foundBrand?.bannerUrl ||
    foundBrand?.logo_url ||
    foundBrand?.logoUrl ||
    foundBrand?.logo ||
    foundBrand?.image
  ) : null;

  // 1. If dynamic uploaded logo/banner exists from Admin, render it
  if (dynamicImg) {
    return (
      <div className={`flex items-center justify-center p-1.5 ${className}`}>
        <img
          src={dynamicImg}
          alt={alt || foundBrand?.name || brandId || 'Brand Logo'}
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain filter drop-shadow-xs"
          loading="lazy"
        />
      </div>
    );
  }

  // 2. If static transparent/dark logo asset matches
  const staticAsset = STATIC_LOGOS[bId];
  if (staticAsset) {
    if (staticAsset.isLight) {
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img
            src={staticAsset.src}
            alt={alt || staticAsset.alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="bg-slate-900 rounded-xl w-full h-full flex items-center justify-center px-3 py-2">
          <img
            src={staticAsset.src}
            alt={alt || staticAsset.alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    );
  }

  // 3. Fallback: Styled brand badge using admin-configured brand color and logoText
  const brandName = foundBrand?.name || brandId || 'Brand';
  const logoText = foundBrand?.logo_text || foundBrand?.logoText || brandName;
  const brandColor = foundBrand?.color || '#0f2b48';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span
        className="text-lg md:text-2xl font-black tracking-wider uppercase font-mono px-2 py-1 rounded"
        style={{ color: brandColor }}
      >
        {logoText}
      </span>
    </div>
  );
}
