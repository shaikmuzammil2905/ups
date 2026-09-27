import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Check, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductImage from './ProductImage';

export default function ProductCard({ product, layout = 'grid' }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useAuth();

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden p-4">
      {/* Top badges & Wishlist */}
      <div className="flex items-center justify-between mb-2">
        {product.bestseller ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-[#16a34a] px-2 py-0.5 rounded-md">
            Best Seller
          </span>
        ) : product.featured ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
            Featured
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
            {product.brandName}
          </span>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`p-1.5 rounded-full transition-colors ${
            wishlisted 
              ? 'text-red-500 bg-red-50' 
              : 'text-slate-400 hover:text-red-500 hover:bg-slate-100'
          }`}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Area */}
      <Link 
        to={`/products/${product.slug}`} 
        className="block relative aspect-4/3 w-full my-2 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
      >
        <ProductImage product={product} categorySlug={product.categoryId} className="w-full h-full" />
      </Link>

      {/* Product Info */}
      <div className="pt-2 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {product.categoryName}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {product.rating || 4.8}
            </span>
            <span className="text-[10px] text-slate-400">
              ({product.reviewCount || 34})
            </span>
          </div>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-4 mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-[#0f2b48]">
              ₹ {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ₹ {product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 px-4 bg-[#16a34a] hover:bg-[#15803d] active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
