import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/livkam-logo.png';

export default function LivkamLogo({ variant = 'default', className = '', showTagline = true }) {
  const isDark = variant === 'dark' || variant === 'footer';

  return (
    <Link to="/" className={`inline-flex items-center group select-none ${className}`}>
      {isDark ? (
        <div className="bg-white/95 backdrop-blur-xs px-4 py-2 rounded-xl shadow-xs inline-flex items-center transition-transform duration-300 group-hover:scale-[1.02]">
          <img 
            src={logoImg} 
            alt="Livkam Power Technologies" 
            className="h-12 sm:h-14 md:h-16 w-auto object-contain mix-blend-multiply"
          />
        </div>
      ) : (
        <img 
          src={logoImg} 
          alt="Livkam Power Technologies - Smart Power. Sustainable Future." 
          className="h-12 sm:h-16 md:h-20 lg:h-22 max-h-[88px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] mix-blend-multiply"
        />
      )}
    </Link>
  );
}
