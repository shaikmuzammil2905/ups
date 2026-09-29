import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ShieldCheck } from 'lucide-react';
import { brands } from '../data/brands';
import BrandLogo from '../components/BrandLogo';

export default function Brands() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Brands</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-10">
        <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
          Authorized Channel Partner
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
          Authorized Brands & Manufacturers
        </h1>
        <p className="text-sm text-slate-500 max-w-4xl mt-3 font-medium leading-relaxed">
          We proudly partner with the world's most trusted and innovative power infrastructure manufacturers to bring you an unparalleled selection of energy solutions. As an official business partner, we deal exclusively in 100% genuine OEM products, ensuring every unit you purchase is factory-sealed and backed by comprehensive official warranty support. Our direct relationships with these industry pioneers eliminate intermediaries, guaranteeing you receive the latest, most reliable technologies at the best value. Browse our curated selection of premium brands designed to keep your critical systems running without interruption.
        </p>
      </div>

      {/* Brand Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            to={`/brands/${brand.slug}`}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <div>
              {/* Brand Logo Container */}
              <div className="h-20 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4 mb-4 group-hover:scale-105 transition-transform duration-300">
                <BrandLogo brandId={brand.id} className="h-10" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors">
                  {brand.fullName || brand.name}
                </h2>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#16a34a] px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Business Partner
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Est. {brand.established}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                {brand.description}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#16a34a]">
              <span>View {brand.name} Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
