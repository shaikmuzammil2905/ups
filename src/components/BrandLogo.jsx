import React from 'react';

export default function BrandLogo({ brandId, className = "h-8 md:h-10", showName = false }) {
  switch (brandId?.toLowerCase()) {
    case 'apc':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <span className="text-xl md:text-2xl font-black text-[#dc2626] tracking-tighter leading-none italic">
            APC
          </span>
          <span className="text-[7px] md:text-[8px] font-semibold text-gray-500 uppercase tracking-tight">
            by Schneider Electric
          </span>
        </div>
      );

    case 'delta':
      return (
        <div className={`flex items-center gap-1.5 justify-center ${className}`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0284c7] fill-current flex-shrink-0">
            <path d="M12 2L2 22h20L12 2zm0 6l5 10H7l5-10z" />
          </svg>
          <span className="text-lg md:text-xl font-black text-[#0284c7] tracking-wider">
            DELTA
          </span>
        </div>
      );

    case 'luminous':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-lg md:text-xl font-black text-[#0369a1] tracking-wide uppercase px-2 py-0.5 rounded">
            LUMINOUS
          </span>
        </div>
      );

    case 'microtek':
      return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
          <span className="text-base md:text-lg font-black text-[#dc2626] tracking-tight leading-none">
            MICROTEK
          </span>
          <span className="text-[6px] md:text-[7px] font-bold text-[#0284c7] tracking-wider uppercase mt-0.5">
            TECHNOLOGY WE LIVE
          </span>
        </div>
      );

    case 'vertiv':
      return (
        <div className={`flex items-center gap-1.5 justify-center ${className}`}>
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-black fill-current">
            <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" fill="currentColor" />
          </svg>
          <span className="text-base md:text-lg font-black text-black tracking-widest uppercase">
            VERTIV
          </span>
        </div>
      );

    case 'numeric':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-lg md:text-xl font-bold text-[#0284c7] lowercase tracking-normal">
            numeric
          </span>
        </div>
      );

    case 'elnova':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-lg md:text-xl font-extrabold text-[#0f2b48] lowercase tracking-wide">
            elnova
          </span>
        </div>
      );

    case 'exide':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-lg md:text-2xl font-black text-[#dc2626] tracking-tighter uppercase font-mono">
            EXIDE
          </span>
        </div>
      );

    case 'amaron':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-lg md:text-xl font-black text-[#16a34a] tracking-wider uppercase">
            AMARON
          </span>
        </div>
      );

    case 'quanta':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <span className="text-lg md:text-xl font-black text-[#0f172a] tracking-widest uppercase">
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
