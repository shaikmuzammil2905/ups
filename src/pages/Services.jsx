import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Clock, CheckCircle2, ArrowRight, ChevronRight, Phone, MessageCircle } from 'lucide-react';
import { services } from '../data/services';

export default function Services() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Engineering Services</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block">
            Certified Field Engineering
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
            Power Services & AMC Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            24/7 technical support, rapid fault breakdown repair, battery health audits, and enterprise Annual Maintenance Contracts across Bengaluru and South India.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <a
            href="tel:+918884988990"
            className="inline-flex items-center justify-center gap-2 bg-[#0f2b48] text-white px-5 py-3 rounded-full text-xs font-bold hover:bg-[#1a3d60] transition-colors"
          >
            <Phone className="w-4 h-4 text-[#16a34a]" />
            <span>Emergency: +91 8884988990</span>
          </a>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#16a34a] flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
          >
            {/* Pictorial Header */}
            <Link to={`/services/${srv.slug}`} className="block relative w-full aspect-[2/1] sm:aspect-auto sm:h-52 bg-slate-50 overflow-hidden cursor-pointer">
              <img
                src={srv.banner || srv.image}
                alt={srv.title}
                className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <span className="hidden sm:inline-block absolute top-3 left-3 bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                {srv.badge}
              </span>
              <div className="hidden sm:flex absolute bottom-3 left-3 text-white text-xs font-semibold items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-300" />
                <span>{srv.turnaround}</span>
              </div>
            </Link>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5 sm:hidden">
                    <span className="bg-[#16a34a]/10 text-[#16a34a] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full">
                      {srv.badge}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#16a34a]" />
                      {srv.turnaround}
                    </span>
                  </div>
                  <Link to={`/services/${srv.slug}`}>
                    <h2 className="text-lg font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors">
                      {srv.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {srv.shortDesc}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {srv.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Turnaround</span>
                  <span className="text-xs font-bold text-slate-800">{srv.turnaround}</span>
                </div>

                <Link
                  to={`/services/${srv.slug}`}
                  className="inline-flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <span>Book Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
