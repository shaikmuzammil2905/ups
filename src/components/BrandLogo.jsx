import React from 'react';
import apcLogo from '../assets/brand-apc.png';
import deltaLogo from '../assets/brand-delta.png';
import microtekLogo from '../assets/brand-microtek.png';
import luminousLogo from '../assets/brand-luminous.png';
import vertivLogo from '../assets/brand-vertiv.png';

export default function BrandLogo({ brandId, className = "h-8 md:h-10", showName = false }) {
  switch (brandId?.toLowerCase()) {
    case 'apc':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img
            src={apcLogo}
            alt="APC by Schneider Electric"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );

    case 'delta':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img
            src={deltaLogo}
            alt="Delta Power Solutions"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );

    case 'luminous':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img
            src={luminousLogo}
            alt="Luminous Power Technologies"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );

    case 'microtek':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img
            src={microtekLogo}
            alt="Microtek International"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );

    case 'vertiv':
      return (
        <div className={`flex items-center justify-center ${className}`}>
          <img
            src={vertivLogo}
            alt="Vertiv Liebert Power Systems"
            className="max-h-full max-w-full object-contain"
          />
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
