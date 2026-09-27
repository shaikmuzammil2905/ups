import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ShieldCheck, 
  Zap, 
  Award, 
  Users, 
  Clock, 
  Truck, 
  CheckCircle2, 
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  MessageCircle
} from 'lucide-react';
import LivkamLogo from '../components/LivkamLogo';
import { brands } from '../data/brands';
import BrandLogo from '../components/BrandLogo';

export default function About() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link to="/" className="hover:text-[#16a34a]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#0f2b48] font-bold">About Us</span>
      </div>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#16a34a] px-3.5 py-1 rounded-full text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            <span>Smart Power. Sustainable Future.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0f2b48] tracking-tight leading-tight">
            About Livkam Power Technologies
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Founded under the visionary leadership of <strong>Venu B N</strong>, Livkam Power Technologies has grown into one of Bengaluru’s foremost retail and wholesale power infrastructure suppliers. We specialize in high-uptime Online UPS systems, industrial SMF battery banks, deep-cycle tubular batteries, and intelligent solar inverters.
          </p>

          <div className="pt-2 flex flex-wrap gap-3 text-xs font-semibold">
            <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg">
              Retail + Wholesale Division
            </span>
            <span className="bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg">
              500+ Catalog Products
            </span>
            <span className="bg-emerald-100 text-[#16a34a] font-bold px-3 py-1.5 rounded-lg">
              GST: 29CYMPN3694M1ZC
            </span>
          </div>
        </div>

        {/* Storefront Visual Box */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-[#0f2b48] to-[#1a3d60] rounded-2xl p-6 text-white shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">Bengaluru Flagship Showroom</h3>
              <p className="text-xs text-slate-300">Banashankari 2nd Stage</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Visit our state-of-the-art facility to inspect live running UPS loads, test battery health impedance, and consult with our senior electrical engineers.
          </p>
          <div className="p-3 bg-white/10 rounded-xl text-xs space-y-1">
            <p className="font-bold text-emerald-300">Address:</p>
            <p className="text-slate-200 text-[11px]">
              21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070
            </p>
          </div>
        </div>
      </div>

      {/* Core Numbers */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center shadow-xs">
          <span className="text-3xl sm:text-4xl font-black text-[#0f2b48] block">500+</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">Active SKUs</span>
          <span className="text-[10px] text-slate-400">Ready in Bangalore Depot</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center shadow-xs">
          <span className="text-3xl sm:text-4xl font-black text-[#16a34a] block">10+</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">OEM Brand Partners</span>
          <span className="text-[10px] text-slate-400">Direct Channel Authorizations</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center shadow-xs">
          <span className="text-3xl sm:text-4xl font-black text-[#0f2b48] block">10,000+</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">Installations Completed</span>
          <span className="text-[10px] text-slate-400">Homes, Clinics & Data Centers</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 text-center shadow-xs">
          <span className="text-3xl sm:text-4xl font-black text-[#16a34a] block">99.9%</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">Customer Satisfaction</span>
          <span className="text-[10px] text-slate-400">Verified Client Reviews</span>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2b48]">100% Genuine Authenticity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Zero counterfeit or refurbished components. Every battery and UPS is delivered factory-sealed with authentic OEM serial barcodes and valid warranty certificates.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2b48]">Engineering Expertise</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We aren't mere box-pushers. Our in-house certified power specialists calculate true harmonic crest factors and load curves to guarantee your setup never fails.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#0f2b48]">Rapid Onsite SLA</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Same-day doorstep delivery and emergency field technicians across Bengaluru, ensuring minimal downtime for mission-critical applications.
          </p>
        </div>
      </div>

      {/* Authorized Brands Strip */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center space-y-6">
        <h3 className="text-lg font-bold text-[#0f2b48]">Authorized Dealer of Leading Global Brands</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {brands.map((b) => (
            <div key={b.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
              <BrandLogo brandId={b.id} className="h-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
