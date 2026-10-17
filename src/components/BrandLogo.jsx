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

  // Helper to test if image is an unsplash background photo (not a logo)
  const isUnsplash = (url) => typeof url === 'string' && url.includes('images.unsplash.com');

  // Dynamic image uploaded in Admin CMS / Supabase
  const uploadedLogo = !imgError ? (
    (logoUrl && !isUnsplash(logoUrl) ? logoUrl : null) ||
    (foundBrand?.logo_url && !isUnsplash(foundBrand.logo_url) ? foundBrand.logo_url : null) ||
    (foundBrand?.logoUrl && !isUnsplash(foundBrand.logoUrl) ? foundBrand.logoUrl : null) ||
    (foundBrand?.logo && !isUnsplash(foundBrand.logo) ? foundBrand.logo : null) ||
    (foundBrand?.banner_url && !isUnsplash(foundBrand.banner_url) ? foundBrand.banner_url : null) ||
    (foundBrand?.bannerUrl && !isUnsplash(foundBrand.bannerUrl) ? foundBrand.bannerUrl : null) ||
    (foundBrand?.image && !isUnsplash(foundBrand.image) ? foundBrand.image : null) ||
    (bannerUrl && !isUnsplash(bannerUrl) ? bannerUrl : null)
  ) : null;

  // 1. If static transparent/dark high-res logo asset matches and no uploaded logo overrides it
  const staticAsset = STATIC_LOGOS[bId];
  if (staticAsset && (!uploadedLogo || isUnsplash(uploadedLogo))) {
    if (staticAsset.isLight) {
      return (
        <div className={`flex items-center justify-center w-full h-full p-1 ${className}`}>
          <img
            src={staticAsset.src}
            alt={alt || staticAsset.alt}
            className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-200"
            loading="lazy"
          />
        </div>
      );
    }
    return (
      <div className={`flex items-center justify-center w-full h-full p-1 ${className}`}>
        <div className="bg-slate-900 rounded-xl w-full h-full flex items-center justify-center px-3 py-2">
          <img
            src={staticAsset.src}
            alt={alt || staticAsset.alt}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  // 2. If dynamic uploaded logo/banner exists from Admin / Supabase, render it
  if (uploadedLogo) {
    return (
      <div className={`flex items-center justify-center w-full h-full p-1 ${className}`}>
        <img
          src={uploadedLogo}
          alt={alt || foundBrand?.name || brandId || 'Brand Logo'}
          onError={() => setImgError(true)}
          className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-200"
          loading="lazy"
        />
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
