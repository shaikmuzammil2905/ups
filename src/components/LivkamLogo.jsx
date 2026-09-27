import React from 'react';
import { Link } from 'react-router-dom';

export default function LivkamLogo({ variant = 'default', className = '', showTagline = true }) {
  const isDark = variant === 'dark' || variant === 'footer';

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Circle Bolt Emblem */}
      <div className="relative w-10 h-10 md:w-11 md:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
          {/* Outer Ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            fill="none" 
            stroke="#16a34a" 
            strokeWidth="6"
            strokeDasharray="260 20"
          />
          {/* Inner Navy Arc */}
          <circle 
            cx="50" 
            cy="50" 
            r="38" 
            fill="none" 
            stroke="#0f2b48" 
            strokeWidth="4" 
            strokeDasharray="180 60"
            strokeDashoffset="45"
          />
          {/* Glowing Green Lightning Bolt */}
          <path 
            d="M54 18 L32 50 L48 50 L42 82 L70 46 L52 46 Z" 
            fill="#16a34a" 
            stroke={isDark ? "#ffffff" : "#0f2b48"}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col justify-center">
        <div className="flex items-baseline">
          <span className={`text-2xl md:text-[28px] font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-[#0f2b48]'}`}>
            Livkam
          </span>
        </div>
        <span className={`text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase leading-tight mt-0.5 ${isDark ? 'text-gray-300' : 'text-[#0f2b48]'}`}>
          POWER TECHNOLOGIES
        </span>
        {showTagline && (
          <span className="text-[8px] md:text-[9px] font-semibold text-[#16a34a] tracking-tight italic leading-none mt-0.5">
            Smart Power. Sustainable Future.
          </span>
        )}
      </div>
    </Link>
  );
}
