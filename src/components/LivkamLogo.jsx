import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/livkam-logo.png';

export default function LivkamLogo({ variant = 'default', className = '', showTagline = true }) {
  const isDark = variant === 'dark' || variant === 'footer';

  return (
    <Link to="/" className={`inline-flex items-center group select-none ${className}`}>
      {isDark ? (
        <div className="bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-xl shadow-xs inline-flex items-center transition-transform duration-300 group-hover:scale-[1.02]">
          <img 
            src={logoImg} 
            alt="Livkam Power Technologies" 
            className="h-10 md:h-12 w-auto object-contain mix-blend-multiply"
          />
        </div>
      ) : (
        <img 
          src={logoImg} 
          alt="Livkam Power Technologies - Smart Power. Sustainable Future." 
          className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02] mix-blend-multiply"
        />
      )}
    </Link>
  );
}
