import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Zap, BatteryCharging, ChevronRight, Tag } from 'lucide-react';
import { useProducts, useBrands, useCategories } from '../context/DataContext';
import ProductImage from './ProductImage';

export default function SearchModal({ isOpen, onClose }) {
  const products = useProducts();
  const brands = useBrands();
  const categories = useCategories();

  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter products
  const matchingProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brandName.toLowerCase().includes(cleanQuery) ||
          p.categoryName.toLowerCase().includes(cleanQuery) ||
          p.sku.toLowerCase().includes(cleanQuery) ||
          (p.capacity && p.capacity.toLowerCase().includes(cleanQuery))
      ).slice(0, 6)
    : [];

  // Filter brands
  const matchingBrands = cleanQuery
    ? brands.filter(
        (b) =>
          b.name.toLowerCase().includes(cleanQuery) ||
          b.fullName.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  // Filter categories
  const matchingCategories = cleanQuery
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(cleanQuery)
      ).slice(0, 4)
    : [];

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!cleanQuery) return;
    onClose();
    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  const popularSearches = [
    'APC Online UPS',
    'Exide Tubular 150Ah',
    'Amaron SMF 200Ah',
    'Vertiv GXT5',
    'Microtek Solar Inverter',
    'Quanta 100Ah',
    'Lithium LiFePO4',
    'Stabilizer 1.5 Ton'
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex items-start justify-center pt-16 sm:pt-24 pb-10">
        <div className="relative inline-block w-full max-w-2xl bg-white rounded-2xl shadow-2xl text-left overflow-hidden z-50 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-slate-100 flex items-center gap-3">
            <Search className="w-6 h-6 text-[#16a34a] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Online UPS, Batteries, Inverters, Brands (e.g. APC, 150Ah)..."
              className="w-full text-base sm:text-lg text-[#0f2b48] placeholder:text-slate-400 focus:outline-hidden font-medium bg-transparent"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className="hidden sm:inline-flex bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>

          {/* Results or Suggestions */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
            {cleanQuery ? (
              <>
                {/* Products Section */}
                {matchingProducts.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Products ({matchingProducts.length})
                      </span>
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-[#16a34a] hover:underline flex items-center gap-1"
                      >
                        <span>View All Results</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchingProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onClose();
                            navigate(`/products/${p.slug}`);
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 cursor-pointer transition-all"
                        >
                          <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-0.5 flex-shrink-0 flex items-center justify-center">
                            <ProductImage product={p} className="w-full h-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{p.brandName}</span>
                            <h4 className="text-xs font-bold text-[#0f2b48] truncate">{p.name}</h4>
                            <span className="text-xs font-black text-[#16a34a]">₹ {p.price.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brands & Categories Section */}
                {(matchingBrands.length > 0 || matchingCategories.length > 0) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                    {matchingBrands.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Matching Brands
                        </span>
                        <div className="space-y-1.5">
                          {matchingBrands.map((b) => (
                            <button
                              key={b.id}
                              onClick={() => {
                                onClose();
                                navigate(`/brands/${b.slug}`);
                              }}
                              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-[#0f2b48] hover:text-white text-xs font-semibold text-slate-700 transition-colors text-left"
                            >
                              <span>{b.name}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchingCategories.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          Matching Categories
                        </span>
                        <div className="space-y-1.5">
                          {matchingCategories.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => {
                                onClose();
                                navigate(`/category/${c.slug}`);
                              }}
                              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-[#16a34a] hover:text-white text-xs font-semibold text-slate-700 transition-colors text-left"
                            >
                              <span>{c.name}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {matchingProducts.length === 0 && matchingBrands.length === 0 && matchingCategories.length === 0 && (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-sm font-semibold text-slate-600">
                      No exact matches found for "<span className="text-[#0f2b48] font-bold">{query}</span>"
                    </p>
                    <button
                      onClick={handleSearchSubmit}
                      className="inline-flex items-center gap-1.5 bg-[#0f2b48] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#16a34a] transition-colors"
                    >
                      <span>Search All Catalog for "{query}"</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Popular Quick Searches */
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                    Popular Power Solutions
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                          navigate(`/search?q=${encodeURIComponent(term)}`);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-[#16a34a] text-xs font-medium text-slate-700 transition-colors border border-slate-200"
                      >
                        <Tag className="w-3 h-3 text-[#16a34a]" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/category/online-ups');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-center transition-colors"
                  >
                    <Zap className="w-5 h-5 text-[#16a34a] mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">Online UPS</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/category/smf-batteries');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-center transition-colors"
                  >
                    <BatteryCharging className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">SMF Batteries</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/category/tubular-batteries');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-center transition-colors"
                  >
                    <Zap className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">Tubular Batteries</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/category/home-inverter');
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-center transition-colors"
                  >
                    <Zap className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-800 block">Home Inverters</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
