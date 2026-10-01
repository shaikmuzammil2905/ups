import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Filter, SlidersHorizontal, ArrowUpDown, Check, ShieldCheck, Zap } from 'lucide-react';
import { useCategories, useProducts, useBrands } from '../context/DataContext';
import ProductCard from '../components/ProductCard';

export default function CategoryDetail() {
  const { slug } = useParams();
  const categories = useCategories();
  const products = useProducts();
  const brands = useBrands();

  const category = categories.find((c) => c.slug === slug || c.id === slug) || categories[0];

  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState(150000);

  // Filter products for this category
  const categoryProducts = products.filter((p) => {
    const pCat = String(p.category_id || p.categoryId || p.category || '').toLowerCase();
    const cId = String(category.id || '').toLowerCase();
    const cSlug = String(category.slug || '').toLowerCase();
    const cName = String(category.name || '').toLowerCase();
    if (pCat !== cId && pCat !== cSlug && pCat !== cName && !pCat.includes(cSlug)) {
      return false;
    }
    const pBrand = String(p.brand_id || p.brandId || p.brand || '').toLowerCase();
    if (selectedBrand !== 'all' && pBrand !== selectedBrand.toLowerCase()) {
      return false;
    }
    if (p.price > priceRange) {
      return false;
    }
    return true;
  }).sort((a, b) => {
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
        <Link to="/categories" className="hover:text-[#16a34a]">Categories</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">{category.name}</span>
      </div>

      {/* Hero Category Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0f2b48] to-[#1e4a75] text-white p-6 sm:p-10 shadow-lg overflow-hidden mb-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-[#16a34a] px-3 py-1 rounded-full text-white inline-block">
            {category.badge || 'Livkam Verified'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black">{category.name}</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {category.shortDesc} Explore genuine units from certified OEM brands with on-site warranty.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filter Bar */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-[#0f2b48] text-sm">
              <Filter className="w-4 h-4 text-[#16a34a]" />
              <span>Filters</span>
            </div>
            <button
              onClick={() => {
                setSelectedBrand('all');
                setPriceRange(150000);
              }}
              className="text-xs text-[#16a34a] hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider block">
              Filter by Brand
            </span>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left p-2 rounded-lg text-xs font-medium ${
                  selectedBrand === 'all' ? 'bg-emerald-50 text-[#16a34a] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBrand(b.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-medium flex justify-between items-center ${
                    selectedBrand === b.id ? 'bg-emerald-50 text-[#16a34a] font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{b.name}</span>
                  {selectedBrand === b.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#0f2b48]">Max Price</span>
              <span className="font-bold text-[#16a34a]">₹ {priceRange.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={3000}
              max={150000}
              step={1000}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#16a34a] cursor-pointer"
            />
          </div>
        </div>

        {/* Right Products */}
        <div className="lg:col-span-9 space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-center justify-between shadow-xs">
            <span className="text-xs font-bold text-[#0f2b48]">
              Showing {categoryProducts.length} Products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline font-medium">Sort:</span>
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
          {categoryProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <p className="text-sm font-bold text-slate-700">No products match this specific filter.</p>
              <button
                onClick={() => {
                  setSelectedBrand('all');
                  setPriceRange(150000);
                }}
                className="bg-[#16a34a] text-white px-4 py-2 rounded-full text-xs font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {categoryProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
