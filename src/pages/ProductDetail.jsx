import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Zap, 
  Heart, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageCircle, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  ChevronRight, 
  Share2, 
  FileText,
  HelpCircle
} from 'lucide-react';
import { useProducts } from '../context/DataContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';

export default function ProductDetail() {
  const products = useProducts();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();
  const { isWishlisted, toggleWishlist } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find product by slug or id
  const product = products.find((p) => p.slug === slug || p.id === slug) || products[0];

  const wishlisted = isWishlisted(product?.id);

  // Related products from same category or brand
  const relatedProducts = products
    .filter((p) => p.id !== product?.id && (p.categoryId === product?.categoryId || p.brandId === product?.brandId))
    .slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <Link to="/products" className="text-[#16a34a] font-bold mt-4 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart?checkout=true');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Livkam Power Technologies, I am interested in purchasing "${product.name}" (SKU: ${product.sku || product.id}) priced at ₹${product.price}. Please provide stock availability and formal quote.`
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium flex-wrap">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/products" className="hover:text-[#16a34a]">Products</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/category/${product.categoryId}`} className="hover:text-[#16a34a]">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Product Hero Grid */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* ============================================================ */}
        {/* LEFT: IMAGE GALLERY */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 w-full bg-slate-50/80 rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden">
            <ProductImage product={product} categorySlug={product.categoryId} className="w-full h-full max-h-80" />
            
            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white shadow-md text-slate-400 hover:text-red-500 transition-colors"
              aria-label="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnail row */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-20 h-20 rounded-xl border-2 p-1 bg-white flex items-center justify-center transition-all ${
                  activeImageIndex === idx ? 'border-[#16a34a] shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <ProductImage product={product} className="w-full h-full" />
              </button>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: DETAILS & ACTIONS */}
        {/* ============================================================ */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Link
                to={`/brands/${product.brandId}`}
                className="text-xs font-bold text-[#16a34a] uppercase tracking-wider hover:underline"
              >
                {product.brandName} Power Systems
              </Link>
              <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                SKU: {product.sku || 'LVK-' + product.id.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48] leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 px-2.5 py-1 rounded-md font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || 4.8}</span>
                <span className="text-amber-600">({product.reviewCount || 42} Reviews)</span>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#16a34a]" /> In Stock (Bangalore Warehouse)
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#0f2b48]">
                  ₹ {product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    ₹ {product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-xs font-bold text-[#16a34a] bg-emerald-50 px-2 py-0.5 rounded">
                  GST 18% Included
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Official invoice with GST input tax credit eligible for business purchasers.
              </p>
            </div>

            {/* Short specs highlight */}
            {product.shortSpecs && (
              <div className="text-xs font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-[#0f2b48]">Highlights: </span>
                {product.shortSpecs}
              </div>
            )}
          </div>

          {/* Action Row (Quantity + Add to Cart + Buy Now) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-l-xl"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-r-xl"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 bg-[#16a34a] hover:bg-[#15803d] active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 bg-[#0f2b48] hover:bg-[#1a3d60] active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* WhatsApp Enquiry Button */}
            <a
              href={`https://wa.me/918884988990?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-[#16a34a]" />
              <span>Instant WhatsApp Enquiry / Price Quote</span>
            </a>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center">
            <div className="p-2">
              <ShieldCheck className="w-5 h-5 text-[#16a34a] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-800 block">100% Genuine</span>
              <span className="text-[9px] text-slate-400">OEM Warranty</span>
            </div>
            <div className="p-2">
              <Truck className="w-5 h-5 text-[#16a34a] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-800 block">Express Delivery</span>
              <span className="text-[9px] text-slate-400">Pan-India Dispatch</span>
            </div>
            <div className="p-2">
              <RotateCcw className="w-5 h-5 text-[#16a34a] mx-auto mb-1" />
              <span className="text-[10px] font-bold text-slate-800 block">Onsite Support</span>
              <span className="text-[9px] text-slate-400">Bangalore Team</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TABS: SPECIFICATIONS, DESCRIPTION, FEATURES */}
      {/* ============================================================ */}
      <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'specs'
                ? 'border-[#16a34a] text-[#16a34a]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'desc'
                ? 'border-[#16a34a] text-[#16a34a]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Description & Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'features'
                ? 'border-[#16a34a] text-[#16a34a]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Key Features
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-6">
          {activeTab === 'specs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700 w-1/3">Brand</td>
                    <td className="p-3 text-slate-600">{product.brandName}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Category</td>
                    <td className="p-3 text-slate-600">{product.categoryName}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">Capacity / Power Rating</td>
                    <td className="p-3 text-slate-600">{product.capacity || 'Standard'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Voltage</td>
                    <td className="p-3 text-slate-600">{product.voltage || '230V AC / 12V DC'}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">Official Warranty</td>
                    <td className="p-3 text-slate-600 font-semibold text-emerald-700">
                      {product.warranty || '2 Years Manufacturer Warranty'}
                    </td>
                  </tr>
                  {product.specifications &&
                    Object.entries(product.specifications).map(([key, val], idx) => (
                      <tr key={key} className={idx % 2 === 0 ? '' : 'bg-slate-50'}>
                        <td className="p-3 font-bold text-slate-700">{key}</td>
                        <td className="p-3 text-slate-600">{val}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'desc' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
              <p>{product.description}</p>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-sky-900 mt-4">
                <h4 className="font-bold mb-1">Bangalore Physical Store Verification</h4>
                <p className="text-xs">
                  Inspect and collect this unit directly from our showroom at 21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bengaluru 560070. Contact our team at +91 8884988990 for live demo scheduling.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-3">
              {product.features && product.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-700">{feat}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Standard enterprise-grade power assurance features included.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* RELATED PRODUCTS */}
      {/* ============================================================ */}
      {relatedProducts.length > 0 && (
        <div className="mt-14 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
              Related Power Solutions
            </h2>
            <Link to="/products" className="text-xs font-bold text-[#16a34a] hover:underline">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
