import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';
import { useCategories } from '../context/DataContext';

// Fallback images used ONLY if database/API genuinely has no image
const defaultFallbacks = {
  'online-ups': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  'smf-batteries': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
  'tubular-batteries': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80',
  'lithium-ups-batteries': 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
  'home-inverter': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
  'ups-services': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'stabilizer': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  'small-backups': 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=600&q=80',
};

export default function ProductImage({ 
  src,
  product, 
  category,
  categorySlug, 
  className = "w-full h-full",
  alt = ""
}) {
  const [imgError, setImgError] = useState(false);
  const categories = useCategories();

  // 1. Direct explicit source string takes top priority
  let targetSrc = typeof src === 'string' && src.trim() ? src.trim() : '';

  // 2. Category image from passed category object
  if (!targetSrc && category) {
    targetSrc = category.image_url || category.imageUrl || category.image || '';
  }

  // 3. Product image from passed product object
  if (!targetSrc && product) {
    targetSrc = product.image || product.imageUrl || (Array.isArray(product.images) && product.images[0]) || '';
  }

  // 4. If still no direct source, check categories from context by categorySlug
  const catKey = (categorySlug || category?.slug || category?.id || product?.categoryId || product?.category_id || '').toLowerCase();
  if (!targetSrc && catKey && Array.isArray(categories) && categories.length > 0) {
    const matchedCategory = categories.find(c => 
      c.slug?.toLowerCase() === catKey || 
      c.id?.toLowerCase() === catKey ||
      c.name?.toLowerCase() === catKey
    );
    if (matchedCategory) {
      targetSrc = matchedCategory.image_url || matchedCategory.imageUrl || matchedCategory.image || '';
    }
  }

  // 5. Safe fallback only if no valid backend image URL exists
  const fallbackSrc = defaultFallbacks[catKey] || '/images/products/online-ups.jpg';
  const finalSrc = (!imgError && targetSrc) ? targetSrc : fallbackSrc;

  // Reset imgError whenever the target source changes
  useEffect(() => {
    setImgError(false);
  }, [targetSrc]);

  return (
    <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-white p-2 ${className}`}>
      <img
        src={finalSrc}
        alt={alt || product?.name || category?.name || 'Livkam Power Technologies'}
        onError={() => {
          if (!imgError && targetSrc && targetSrc !== fallbackSrc) {
            setImgError(true);
          }
        }}
        className="w-full h-full object-contain max-h-full transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}
