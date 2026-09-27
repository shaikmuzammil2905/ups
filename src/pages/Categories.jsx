import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { categories } from '../data/categories';
import ProductImage from '../components/ProductImage';

export default function Categories() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Categories</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-10 text-center md:text-left">
        <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
          Explore By Power Segment
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
          Product Categories
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mt-2 font-medium">
          From heavy industrial online double-conversion UPS to zero-maintenance home inverter battery sets, discover curated power equipment.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <div>
              <div className="w-full aspect-4/3 flex items-center justify-center p-3 mb-4 bg-sky-50/40 rounded-xl group-hover:scale-105 transition-transform duration-300">
                <ProductImage categorySlug={cat.slug} className="w-full h-full" />
              </div>

              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#16a34a] px-2 py-0.5 rounded">
                  {cat.badge || 'Certified'}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {cat.itemCount}+ Models
                </span>
              </div>

              <h2 className="text-base font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors mt-2">
                {cat.name}
              </h2>
              
              <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                {cat.shortDesc}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16a34a]">
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
