import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, ShieldCheck, Clock, CheckCircle2, ArrowRight, ChevronRight, 
  Phone, MessageCircle, Activity, Headphones, FileCheck, Search, AlertTriangle,
  BatteryCharging, Check, Layers
} from 'lucide-react';
import { useServices } from '../context/DataContext';

const SERVICE_GROUPS = [
  { id: 'all', label: 'All Services', count: 9 },
  { id: 'installation', label: 'Group A: Installation & Technical Services', count: 3 },
  { id: 'maintenance', label: 'Group B: Maintenance & Repair (AMC)', count: 3 },
  { id: 'battery-support', label: 'Group C: Battery & Power Support', count: 3 },
];

export default function Services() {
  const services = useServices();
  const [activeGroup, setActiveGroup] = useState('all');

  // Categorize services into 3 main groups
  const categorizedServices = services.map(srv => {
    let group = srv.group;
    if (!group) {
      const slug = (srv.slug || '').toLowerCase();
      if (slug.includes('installation') || slug.includes('site') || slug.includes('consultation')) {
        group = 'installation';
      } else if (slug.includes('amc') || slug.includes('maintenance') || slug.includes('repair')) {
        group = 'maintenance';
      } else {
        group = 'battery-support';
      }
    }
    return { ...srv, group };
  });

  const filteredServices = categorizedServices.filter(s => {
    if (activeGroup === 'all') return true;
    return s.group === activeGroup;
  });

  const getGroupBadge = (group) => {
    switch (group) {
      case 'installation':
        return { label: 'Group A: Installation & Commissioning', color: 'bg-emerald-50 text-[#16a34a] border-emerald-200' };
      case 'maintenance':
        return { label: 'Group B: Maintenance & AMC', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'battery-support':
        return { label: 'Group C: Battery & Power Support', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return { label: 'Livkam Engineering', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">Engineering Services & AMC</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-3xl space-y-2 text-center md:text-left">
          <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block">
            Certified Power Systems Engineering
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#0f2b48]">
            Multi-Brand Power Services & AMC Solutions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Turnkey UPS installations, 24/7 emergency component-level repairs, preventive load audits, and enterprise Annual Maintenance Contracts covering APC, Vertiv, Delta, Numeric, and Luminous systems across Bengaluru and Karnataka.
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

      {/* Three Service Groups Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-8 shadow-xs">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          {SERVICE_GROUPS.map(grp => (
            <button
              key={grp.id}
              onClick={() => setActiveGroup(grp.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeGroup === grp.id
                  ? 'bg-[#16a34a] text-white shadow-sm'
                  : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => {
          const groupBadge = getGroupBadge(srv.group);
          return (
            <div
              key={srv.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#16a34a] flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300"
            >
              {/* Pictorial Header */}
              <Link to={`/services/${srv.slug}`} className="block relative w-full aspect-[2/1] sm:aspect-auto sm:h-48 bg-slate-100 overflow-hidden cursor-pointer">
                <img
                  src={srv.banner || srv.image}
                  alt={srv.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <span className="hidden sm:inline-block absolute top-3 left-3 bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  {srv.badge || 'Field Engineering'}
                </span>
                <div className="hidden sm:flex absolute bottom-3 left-3 text-white text-xs font-semibold items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{srv.turnaround}</span>
                </div>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${groupBadge.color}`}>
                      {groupBadge.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 sm:hidden">
                      <Clock className="w-3 h-3 text-[#16a34a]" />
                      {srv.turnaround}
                    </span>
                  </div>

                  <div>
                    <Link to={`/services/${srv.slug}`}>
                      <h2 className="text-lg font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors leading-snug">
                        {srv.title}
                      </h2>
                    </Link>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-3">
                      {srv.shortDesc}
                    </p>
                  </div>

                  {/* Highlights */}
                  {Array.isArray(srv.features) && srv.features.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {srv.features.slice(0, 3).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Pricing / SLA</span>
                    <span className="text-xs font-bold text-slate-800">{srv.priceStartsAt || 'Contact for Quote'}</span>
                  </div>

                  <Link
                    to={`/services/${srv.slug}`}
                    className="inline-flex items-center gap-1.5 bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    <span>View Scope & Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Service Assurance Strip */}
      <div className="mt-12 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <div className="text-sm font-bold text-[#0f2b48] flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            <span>Guaranteed 4-Hour Breakdown Response</span>
          </div>
          <p className="text-xs text-slate-500">
            Emergency mobile engineering squads dispatched across all Bengaluru commercial & industrial areas.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-[#0f2b48] flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            <span>100% Genuine OEM Spares</span>
          </div>
          <p className="text-xs text-slate-500">
            Authentic IGBTs, control PCBs, cooling fans, and capacitors backed by 90-day service warranty.
          </p>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-bold text-[#0f2b48] flex items-center justify-center sm:justify-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
            <span>Standby Loaner UPS Available</span>
          </div>
          <p className="text-xs text-slate-500">
            Critical healthcare and server facilities receive temporary standby units while in-depth repairs occur.
          </p>
        </div>
      </div>
    </div>
  );
}
