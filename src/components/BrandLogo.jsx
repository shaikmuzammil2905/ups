import React from 'react';
import apcLogo from '../assets/brand-apc.png';
import deltaLogo from '../assets/brand-delta.png';
import microtekLogo from '../assets/brand-microtek.png';
import luminousLogo from '../assets/brand-luminous.png';
import vertivLogo from '../assets/brand-vertiv.png';

// Wrapper for logos with white/light backgrounds — shown as-is
function LightLogo({ src, alt, className }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
}

// Wrapper for logos with dark/black backgrounds — shown in a dark pill so logo is clearly visible
function DarkLogo({ src, alt, className }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="bg-slate-900 rounded-xl w-full h-full flex items-center justify-center px-3 py-2">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>
    </div>
  );
}

export default function BrandLogo({ brandId, className = "h-12 md:h-14", showName = false }) {
  switch (brandId?.toLowerCase()) {
    case 'apc':
      // APC has white background — show directly
      return <LightLogo src={apcLogo} alt="APC by Schneider Electric" className={className} />;

    case 'delta':
      // Delta has black background — wrap in dark pill
      return <DarkLogo src={deltaLogo} alt="Delta Power Solutions" className={className} />;

    case 'luminous':
      // Luminous has black background — wrap in dark pill
      return <DarkLogo src={luminousLogo} alt="Luminous Power Technologies" className={className} />;

    case 'microtek':
      // Microtek has black background — wrap in dark pill
      return <DarkLogo src={microtekLogo} alt="Microtek International" className={className} />;

    case 'vertiv':
      // Vertiv has black background — wrap in dark pill
      return <DarkLogo src={vertivLogo} alt="Vertiv Liebert Power Systems" className={className} />;

    case 'numeric':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-xl md:text-2xl font-bold text-[#0284c7] lowercase tracking-normal">
            numeric
          </span>
        </div>
      );

    case 'elnova':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-xl md:text-2xl font-extrabold text-[#0f2b48] lowercase tracking-wide">
            elnova
          </span>
        </div>
      );

    case 'exide':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-xl md:text-3xl font-black text-[#dc2626] tracking-tighter uppercase font-mono">
            EXIDE
          </span>
        </div>
      );

    case 'amaron':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-xl md:text-2xl font-black text-[#16a34a] tracking-wider uppercase">
            AMARON
          </span>
        </div>
      );

    case 'quanta':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-xl md:text-2xl font-black text-[#0f172a] tracking-widest uppercase">
            QUANTA
          </span>
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center font-bold text-gray-700 ${className}`}>
          {brandId}
        </div>
      );
  }
}
