import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  SlidersHorizontal, 
  Search, 
  X, 
  Check, 
  ChevronDown, 
  ChevronRight,
  ArrowUpDown,
  Sparkles,
  Grid3X3,
  LayoutList
} from 'lucide-react';
import { products } from '../data/products';
import { brands } from '../data/brands';
import { categories } from '../data/categories';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const selectedBrand = searchParams.get('brand') || 'all';
  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const sortOption = searchParams.get('sort') || 'popular';

  // Local filter states
  const [priceRange, setPriceRange] = useState(150000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Update query params
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'all' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange(150000);
    setInStockOnly(false);
  };

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }
      // Brand filter
      if (selectedBrand !== 'all' && p.brandId !== selectedBrand) {
        return false;
      }
      // Price filter
      if (p.price > priceRange) {
        return false;
      }
      // In stock
      if (inStockOnly && !p.inStock) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brandName.toLowerCase().includes(q);
        const matchesCategory = p.categoryName.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesSku) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortOption === 'newest') return b.id.localeCompare(a.id);
      return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
    });
  }, [selectedCategory, selectedBrand, searchQuery, sortOption, priceRange, inStockOnly]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">All Products</span>
      </div>

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Official Power Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              All Products ({filteredProducts.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing authentic Online UPS, SMF Batteries, Inverters & Power Protection from top brands.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateFilter('q', e.target.value)}
              placeholder="Search catalog..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#16a34a] font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Layout (Sidebar Filters + Products Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================ */}
        {/* DESKTOP SIDEBAR FILTERS */}
        {/* ============================================================ */}
        <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-[#0f2b48] text-sm">
              <Filter className="w-4 h-4 text-[#16a34a]" />
              <span>Filters</span>
            </div>
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#16a34a] hover:underline font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider block">
              Category
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateFilter('category', 'all')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === 'all' 
                    ? 'bg-emerald-50 text-[#16a34a] font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateFilter('category', cat.slug)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat.slug 
                      ? 'bg-emerald-50 text-[#16a34a] font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">{cat.name}</span>
                  {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider block">
              Brand
            </span>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => updateFilter('brand', 'all')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedBrand === 'all' 
                    ? 'bg-emerald-50 text-[#16a34a] font-bold' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Brands</span>
                {selectedBrand === 'all' && <Check className="w-3.5 h-3.5" />}
              </button>
              {brands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => updateFilter('brand', brand.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedBrand === brand.id 
                      ? 'bg-emerald-50 text-[#16a34a] font-bold' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{brand.name}</span>
                  {selectedBrand === brand.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2.5 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider">
                Max Price
              </span>
              <span className="text-xs font-black text-[#16a34a]">
                ₹ {priceRange.toLocaleString('en-IN')}
              </span>
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
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>₹ 3,000</span>
              <span>₹ 1,50,000+</span>
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[#16a34a] focus:ring-[#16a34a] w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PRODUCTS LISTING */}
        {/* ============================================================ */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Filter & Sort Bar */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#0f2b48] px-3.5 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#16a34a]" />
              <span>Filters & Sort</span>
            </button>

            {/* Active filter pills */}
            <div className="hidden sm:flex items-center gap-2 flex-wrap">
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-md">
                  Brand: {selectedBrand.toUpperCase()}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('brand', 'all')} />
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-[#16a34a] text-[11px] font-bold px-2.5 py-1 rounded-md">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', 'all')} />
                </span>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-[#0f2b48] py-2 px-3 focus:outline-hidden focus:border-[#16a34a]"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your price filter or selecting another brand or category.
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-[#16a34a] text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#15803d] transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE FILTER MODAL / BOTTOM SHEET */}
      {/* ============================================================ */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-[#0f2b48]">Filters</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider block mb-2">Category</span>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => updateFilter('category', 'all')}
                    className={`w-full text-left p-2 rounded text-xs font-medium ${selectedCategory === 'all' ? 'bg-emerald-50 text-[#16a34a] font-bold' : 'text-slate-600'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateFilter('category', c.slug)}
                      className={`w-full text-left p-2 rounded text-xs font-medium ${selectedCategory === c.slug ? 'bg-emerald-50 text-[#16a34a] font-bold' : 'text-slate-600'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <span className="text-xs font-bold text-[#0f2b48] uppercase tracking-wider block mb-2">Brand</span>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  <button
                    onClick={() => updateFilter('brand', 'all')}
                    className={`w-full text-left p-2 rounded text-xs font-medium ${selectedBrand === 'all' ? 'bg-emerald-50 text-[#16a34a] font-bold' : 'text-slate-600'}`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => updateFilter('brand', b.id)}
                      className={`w-full text-left p-2 rounded text-xs font-medium ${selectedBrand === b.id ? 'bg-emerald-50 text-[#16a34a] font-bold' : 'text-slate-600'}`}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full bg-[#16a34a] text-white py-3 rounded-xl text-xs font-bold mt-6 shadow-md"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
