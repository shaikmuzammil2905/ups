import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Filter, ArrowUpDown } from 'lucide-react';
import { brands } from '../data/brands';
import { products } from '../data/products';
import BrandLogo from '../components/BrandLogo';
import ProductCard from '../components/ProductCard';

export default function BrandDetail() {
  const { slug } = useParams();
  const brand = brands.find((b) => b.slug === slug || b.id === slug) || brands[0];

  const [sortOption, setSortOption] = useState('popular');

  // Filter products by brand
  const brandProducts = products
    .filter((p) => p.brandId === brand.id)
    .sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/brands" className="hover:text-[#16a34a]">Brands</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">{brand.name}</span>
      </div>

      {/* Hero Brand Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center md:text-left max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#16a34a] px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Livkam Authorized Channel Partner</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
            {brand.fullName || brand.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            {brand.description} All units are sourced directly with authentic manufacturer test reports and warranty cards.
          </p>
        </div>

        {/* Brand Logo Box */}
        <div className="w-48 h-28 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-4 flex-shrink-0 shadow-xs">
          <BrandLogo brandId={brand.id} className="h-12" />
        </div>
      </div>

      {/* Products Grid Header */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <span className="text-xs sm:text-sm font-bold text-[#0f2b48]">
          Available {brand.name} Models ({brandProducts.length})
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#0f2b48] py-1.5 px-3"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {brandProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <p className="text-sm font-bold text-slate-700">Currently updating stock for {brand.name}.</p>
          <Link to="/products" className="text-xs font-bold text-[#16a34a] hover:underline mt-2 inline-block">
            View All Products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {brandProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
