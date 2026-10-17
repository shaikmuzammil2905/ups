import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, ShieldCheck, Clock, CheckCircle2, ArrowRight, ChevronRight, 
  Phone, MessageCircle, Activity, Headphones, FileCheck, Search, AlertTriangle,
  BatteryCharging, Check, Layers, Sparkles
} from 'lucide-react';
import { useServices } from '../context/DataContext';
import { SERVICE_CATEGORIES } from '../data/services';

export default function Services() {
  const services = useServices();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = services.filter(s => {
    if (activeCategory === 'all') return true;
    return s.categoryId === activeCategory || s.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Engineering Services & AMC Catalogues</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-3xl space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block">
            Certified Power Systems Engineering & AMC Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
            Multi-Brand Power Services & AMC Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Turnkey UPS installations, 24/7 emergency component-level repairs, preventive load audits, and enterprise Annual Maintenance Contracts covering APC, Vertiv, Delta, Microtek, Eaton, and Numeric systems across Bengaluru and Karnataka.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <a
            href="tel:+918884988990"
            className="inline-flex items-center justify-center gap-2 bg-[#0f2b48] text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-[#1a3d60] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#16a34a]" />
            <span>Emergency 24/7: +91 8884988990</span>
          </a>
          <a
            href="https://wa.me/918884988990?text=Hi%20Livkam%20Power,%20I%20need%20assistance%20with%20UPS%20Services%20/%20AMC"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-green-600 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </div>

      {/* 8 Categories Filter Tabs (Images 70-77) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-8 shadow-xs">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#16a34a] text-white shadow-sm'
                : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Services & Catalogues ({services.length})
          </button>
          {SERVICE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-amber-50 hover:text-amber-800'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => (
          <div
            key={srv.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#16a34a] flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Pictorial Header */}
            <Link to={`/services/${srv.slug}`} className="block relative w-full aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer p-4">
              <img
                src={srv.banner || srv.image || '/images/services/apc-service-cabinets.jpg'}
                alt={srv.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-3 left-3 bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                {srv.badge || 'Engineering'}
              </span>
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-semibold flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>{srv.turnaround || 'Same Day'}</span>
              </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                {srv.category && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 inline-block">
                    {srv.category}
                  </span>
                )}

                <h3 className="text-lg font-black text-[#0f2b48] group-hover:text-[#16a34a] transition-colors leading-snug">
                  <Link to={`/services/${srv.slug}`}>
                    {srv.title}
                  </Link>
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed font-normal line-clamp-3">
                  {srv.introduction || srv.shortDesc}
                </p>

                {/* Range Highlights */}
                {srv.rangeItems && srv.rangeItems.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Key Capabilities:</span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {srv.rangeItems.slice(0, 3).map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0 mt-0.5" />
                          <span className="truncate">{typeof item === 'string' ? item : item.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting from</span>
                  <span className="text-sm font-black text-[#0f2b48]">{srv.priceStartsAt || 'Contact Quote'}</span>
                </div>

                <Link
                  to={`/services/${srv.slug}`}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-[#16a34a] text-[#16a34a] hover:text-white border border-emerald-200 hover:border-transparent px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-12 bg-gradient-to-r from-[#0f2b48] to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-xl">
        <div className="space-y-3 text-center md:text-left max-w-2xl">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Annual Maintenance Contracts (AMC)
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Protect Your Business with 100% Guaranteed Uptime
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Custom enterprise AMC contracts with strict 4-hour SLA response guarantees, genuine OEM spares, standby backup units, and preventive load audits across Bengaluru and Karnataka.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-emerald-600 text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all"
          >
            <span>Request Corporate AMC Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
