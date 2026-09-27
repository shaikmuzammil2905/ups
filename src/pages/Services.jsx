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
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center group-hover:bg-[#16a34a] group-hover:text-white transition-colors">
                  <Wrench className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                  {srv.badge}
                </span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors">
                  {srv.title}
                </h2>
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

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
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
        ))}
      </div>
    </div>
  );
}
