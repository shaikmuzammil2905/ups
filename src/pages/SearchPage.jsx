import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronRight, Filter, ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [sortOption, setSortOption] = useState('popular');

  const cleanQ = query.toLowerCase().trim();

  const matchingProducts = cleanQ
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.brandName.toLowerCase().includes(cleanQ) ||
          p.categoryName.toLowerCase().includes(cleanQ) ||
          p.sku.toLowerCase().includes(cleanQ) ||
          (p.capacity && p.capacity.toLowerCase().includes(cleanQ))
      ).sort((a, b) => {
        if (sortOption === 'price-low') return a.price - b.price;
        if (sortOption === 'price-high') return b.price - a.price;
        if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
        return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      })
    : [];

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Search Results</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
            Search Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
            {cleanQ ? `Results for "${query}"` : 'All Products Search'} ({matchingProducts.length})
          </h1>
        </div>

        {matchingProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort:</span>
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
        )}
      </div>

      {/* Grid or Empty */}
      {matchingProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            No products found matching "{query}"
          </h2>
          <p className="text-xs text-slate-500">
            Check your spelling, or explore our top power categories below.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <Link to="/category/online-ups" className="bg-slate-100 hover:bg-emerald-50 text-xs font-bold px-3 py-1.5 rounded-lg text-slate-700">
              Online UPS
            </Link>
            <Link to="/category/smf-batteries" className="bg-slate-100 hover:bg-emerald-50 text-xs font-bold px-3 py-1.5 rounded-lg text-slate-700">
              SMF Batteries
            </Link>
            <Link to="/category/home-inverter" className="bg-slate-100 hover:bg-emerald-50 text-xs font-bold px-3 py-1.5 rounded-lg text-slate-700">
              Home Inverters
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {matchingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
