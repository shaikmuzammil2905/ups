import React, { useState } from 'react';
import { Zap, Battery, BatteryCharging, Cpu, Home, Wrench, ShieldAlert, Monitor } from 'lucide-react';

// Pre-defined category and product image map
const categoryImageMap = {
  'online-ups': '/images/products/online-ups.jpg',
  'smf-batteries': '/images/products/smf-battery.jpg',
  'tubular-batteries': '/images/products/tubular-battery.jpg',
  'lithium-ups-batteries': '/images/products/lithium-ups.jpg',
  'home-inverter': '/images/products/home-inverter.jpg',
  'ups-services': '/images/services/ups-technician.jpg',
  'stabilizer': '/images/products/stabilizer.jpg',
  'small-backups': '/images/products/small-backup.jpg',
};

export default function ProductImage({ 
  product, 
  categorySlug, 
  className = "w-full h-full",
  alt = ""
}) {
  const [imgError, setImgError] = useState(false);
  
  const cat = (categorySlug || product?.categoryId || '').toLowerCase();
  const name = (product?.name || '').toLowerCase();
  const brand = (product?.brandName || '').toLowerCase();

  // Determine matching image
  let imageSrc = product?.imageUrl || product?.image;

  if (!imageSrc || imageSrc.startsWith('data:image/svg')) {
    if (categoryImageMap[cat]) {
      imageSrc = categoryImageMap[cat];
    } else if (name.includes('tubular') || name.includes('tall')) {
      imageSrc = '/images/products/tubular-battery.jpg';
    } else if (name.includes('smf') || name.includes('vrla') || name.includes('quanta') || name.includes('12v')) {
      imageSrc = '/images/products/smf-battery.jpg';
    } else if (name.includes('lithium') || name.includes('lifepo4') || name.includes('bms')) {
      imageSrc = '/images/products/lithium-ups.jpg';
    } else if (name.includes('inverter') || name.includes('sine wave') || name.includes('zelio') || name.includes('cruze')) {
      imageSrc = '/images/products/home-inverter.jpg';
    } else if (name.includes('stabilizer') || name.includes('v-guard') || name.includes('voltage')) {
      imageSrc = '/images/products/stabilizer.jpg';
    } else if (name.includes('desktop') || name.includes('back-ups') || name.includes('600va') || name.includes('650va')) {
      imageSrc = '/images/products/small-backup.jpg';
    } else if (cat === 'ups-services' || name.includes('service') || name.includes('amc') || name.includes('installation')) {
      imageSrc = '/images/services/ups-technician.jpg';
    } else {
      imageSrc = '/images/products/online-ups.jpg';
    }
  }

  // If image loaded successfully
  if (!imgError && imageSrc) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white p-2 ${className}`}>
        <img
          src={imageSrc}
          alt={alt || product?.name || 'Livkam Power Technologies Product'}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback SVG display if error
  return (
    <div className={`flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 p-4 text-slate-400 ${className}`}>
      <Zap className="w-10 h-10 text-emerald-500 animate-pulse" />
    </div>
  );
}
