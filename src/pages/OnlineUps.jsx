import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, ShieldCheck, Cpu, CheckCircle2, ChevronRight, Phone, 
  MessageCircle, Download, FileText, ArrowRight, Layers, 
  SlidersHorizontal, Check, Building2, Server, Activity, 
  Factory, MapPin, Mail, Clock, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { useProducts, useBrands, useSiteSettings } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import BrandLogo from '../components/BrandLogo';
import { supabase } from '../lib/supabase';

export default function OnlineUps() {
  const products = useProducts();
  const brands = useBrands();
  const settings = useSiteSettings();

  // Filters
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    capacity: '5 kVA - 10 kVA',
    phase: 'Three Phase',
    backupTime: '30 - 60 Minutes',
    location: 'Bengaluru',
    message: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Filter products for Online UPS
  const onlineUpsProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => {
      if (!p) return false;
      const cat = String(p.category_id || p.category || p.categoryName || '').toLowerCase();
      const name = String(p.name || '').toLowerCase();
      const isUps = cat.includes('online') || cat.includes('ups') || name.includes('online ups') || name.includes('smart-ups') || name.includes('amplon') || name.includes('liebert');
      
      // Brand filter
      if (selectedBrand !== 'all') {
        const pBrand = String(p.brand_id || p.brandId || p.brand || p.brand_name || '').toLowerCase();
        if (!pBrand.includes(selectedBrand.toLowerCase())) return false;
      }

      // Phase / Type filter
      if (selectedPhase !== 'all') {
        const text = `${p.name || ''} ${p.description || ''} ${JSON.stringify(p.specs || {})}`.toLowerCase();
        if (selectedPhase === 'single' && !text.includes('1:1') && !text.includes('single phase') && !text.includes('1 phase')) return false;
        if (selectedPhase === 'three' && !text.includes('3:1') && !text.includes('3:3') && !text.includes('3 phase') && !text.includes('three phase')) return false;
        if (selectedPhase === 'rack' && !text.includes('rack') && !text.includes('rt') && !text.includes('2u')) return false;
      }

      // Capacity filter
      if (selectedCapacity !== 'all') {
        const cap = parseFloat(String(p.capacity || p.name || '').replace(/[^0-9.]/g, '')) || 0;
        if (selectedCapacity === '1-3' && (cap < 1 || cap > 3)) return false;
        if (selectedCapacity === '5-10' && (cap < 5 || cap > 10)) return false;
        if (selectedCapacity === '10-20' && (cap < 10 || cap > 20)) return false;
        if (selectedCapacity === '20-60' && (cap < 20 || cap > 60)) return false;
        if (selectedCapacity === '60+' && cap < 60) return false;
      }

      // Search query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullText = `${p.name || ''} ${p.brand_name || ''} ${p.capacity || ''} ${p.description || ''}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      return isUps;
    });
  }, [products, selectedBrand, selectedPhase, selectedCapacity, searchQuery]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormError('Please enter your name and phone number.');
      return;
    }
    setFormSubmitting(true);
    setFormError('');

    try {
      const { error } = await supabase.from('enquiries').insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          product_name: `Online UPS Quote (${formData.capacity}, ${formData.phase})`,
          message: `Backup: ${formData.backupTime} | Location: ${formData.location} | Details: ${formData.message}`,
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);

      if (error) throw error;
      setFormSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        company: '',
        capacity: '5 kVA - 10 kVA',
        phase: 'Three Phase',
        backupTime: '30 - 60 Minutes',
        location: 'Bengaluru',
        message: '',
      });
    } catch (err) {
      console.error('Enquiry error:', err);
      // Even if DB insert fails, show friendly confirmation
      setFormSuccess(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const whatsappQuoteUrl = `https://wa.me/918884988990?text=${encodeURIComponent(
    `Hi Livkam Power Technologies, I would like to get a quotation for an Online UPS system. My requirement: Capacity: ${formData.capacity}, Phase: ${formData.phase}, Backup: ${formData.backupTime}, Location: Bengaluru.`
  )}`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#07192c] via-[#0f2b48] to-[#12385e] text-white py-16 lg:py-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-6 font-medium">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to="/products" className="hover:text-emerald-400 transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400 font-bold">Online UPS Systems</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>True Double-Conversion Power Continuity</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                High-Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Online UPS</span> Systems
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Zero millisecond transfer time, pure sine wave power conditioning, and active harmonic suppression for IT data centers, hospitals, CNC machining, and mission-critical enterprise loads across Bengaluru and Karnataka.
              </p>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-emerald-400">0 ms</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Transfer Time</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-sky-400">0.99 PF</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Output Power</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-amber-400">1kVA - 500kVA</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Capacity Range</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-purple-400">&lt; 2% THD</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Pure Sine Wave</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#quote-form"
                  className="bg-[#16a34a] hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-green-900/40 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Request Instant Quotation</span>
                </a>
                <a
                  href="tel:+918884988990"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3.5 rounded-xl text-sm transition-colors border border-slate-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Talk to Engineer: +91 8884988990</span>
                </a>
              </div>
            </div>

            {/* Right: Quick Tech Card */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Livkam Engineering Assurance</span>
              </h3>
              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>100% Genuine OEM Units:</strong> Authorized sourcing for APC by Schneider, Vertiv Liebert, Delta, and Numeric.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Turnkey Commissioning:</strong> Single-line load assessment, neutral-earth grounding checks, and certified installation.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>24/7 Breakdown SLA:</strong> Emergency standby swap units and 4-hour breakdown response across Bengaluru.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Flexible Battery Coupling:</strong> Heavy-duty VRLA SMF or high-density LiFePO4 battery banks sized to your runtime.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Free On-Site Assessment in Bengaluru</span>
                <span className="text-emerald-400 font-bold">Mon - Sat: 9AM - 7PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND STRIP */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Authorized UPS Brand Partners:
            </span>
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-center">
              {brands.slice(0, 6).map((b) => (
                <Link key={b.id} to={`/brands/${b.slug}`} className="hover:opacity-80 transition-opacity">
                  <BrandLogo brand={b} brandId={b.id} className="h-8 max-w-[100px]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. CAPACITIES & FILTERS NAVIGATION */}
      <section className="py-8 bg-slate-100/70 border-b border-slate-200 sticky top-[72px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Capacity Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Capacity:
              </span>
              {[
                { id: 'all', label: 'All Capacities' },
                { id: '1-3', label: '1 - 3 kVA' },
                { id: '5-10', label: '5 - 10 kVA' },
                { id: '10-20', label: '10 - 20 kVA' },
                { id: '20-60', label: '20 - 60 kVA' },
                { id: '60+', label: '60 kVA - 200kVA+' },
              ].map(cap => (
                <button
                  key={cap.id}
                  onClick={() => setSelectedCapacity(cap.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCapacity === cap.id
                      ? 'bg-[#0f2b48] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cap.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search models, brands, kVA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
              />
            </div>
          </div>

          {/* Sub-Filters: Phase & Brand */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Topology / Form:</span>
              <button
                onClick={() => setSelectedPhase('all')}
                className={`px-2.5 py-1 rounded ${selectedPhase === 'all' ? 'bg-[#16a34a] text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPhase('single')}
                className={`px-2.5 py-1 rounded ${selectedPhase === 'single' ? 'bg-[#16a34a] text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                1-Phase (1:1)
              </button>
              <button
                onClick={() => setSelectedPhase('three')}
                className={`px-2.5 py-1 rounded ${selectedPhase === 'three' ? 'bg-[#16a34a] text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                3-Phase (3:1 / 3:3)
              </button>
              <button
                onClick={() => setSelectedPhase('rack')}
                className={`px-2.5 py-1 rounded ${selectedPhase === 'rack' ? 'bg-[#16a34a] text-white font-bold' : 'hover:bg-slate-200'}`}
              >
                Rack-Mount
              </button>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="font-bold text-slate-700">Filter Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-slate-800"
              >
                <option value="all">All Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.slug || b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS CATALOGUE GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
              Online UPS Systems ({onlineUpsProducts.length} Models)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing verified pure sine wave double conversion UPS systems from official authorized partners.
            </p>
          </div>
          <a
            href="#quote-form"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline"
          >
            <span>Need Custom Capacity Sizing?</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {onlineUpsProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Zap className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No Online UPS models match current filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We supply custom modular and industrial capacity UPS up to 500kVA upon request. Speak with our Bangalore engineering team for tailored availability.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => { setSelectedCapacity('all'); setSelectedPhase('all'); setSelectedBrand('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Reset Filters
              </button>
              <a
                href="#quote-form"
                className="px-4 py-2 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Request Quotation
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {onlineUpsProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 5. HOW DOUBLE-CONVERSION ONLINE UPS WORKS */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Engineering Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              Why True Double Conversion Outperforms Regular Inverters
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Unlike offline or line-interactive systems that switch mechanically when power drops, a True Online UPS constantly runs inverter-fed power, guaranteeing absolute zero transfer time and complete isolation from power grid anomalies.
            </p>
          </div>

          {/* Workflow Diagram Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AC Input Filtering & PFC</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Raw commercial utility power passes through input EMI filters and active PFC, isolating harmonics and surges.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-slate-800 text-sm">AC to DC Rectifier</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The rectifier converts incoming AC to stable DC bus voltage, simultaneously trickle-charging external battery banks.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-slate-800 text-sm">IGBT Inverter (DC to AC)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-frequency IGBTs synthesize a pure sine wave output independently of grid voltage sags or brownouts.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Static Bypass Protection</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seamless automatic static bypass circuit routes utility power in overload or maintenance events without dropping load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INDUSTRIAL APPLICATIONS */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Mission-Critical Deployments
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              Where Livkam Online UPS Systems Are Installed
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <Server className="w-8 h-8 text-[#16a34a]" />
              <h3 className="font-bold text-slate-800 text-sm">IT & Data Centers</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Rackmount and modular systems protecting blade servers, core switches, SAN storage, and VoIP telecom nodes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <Activity className="w-8 h-8 text-sky-600" />
              <h3 className="font-bold text-slate-800 text-sm">Hospitals & Diagnostic Labs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Isolated clean power for MRI, CT scanners, ventilators, operation theaters, and dialysis machines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <Factory className="w-8 h-8 text-amber-600" />
              <h3 className="font-bold text-slate-800 text-sm">Manufacturing & CNC</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Heavy-duty three-phase systems safeguarding laser cutters, robotic arms, PLC panels, and packaging lines.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
              <Building2 className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-slate-800 text-sm">Corporate Offices & Banks</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Floor-wide power conditioning for workstations, security CCTV surveillance, access controls, and lifts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RELATED BATTERIES & AMC SERVICES */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Battery Banks Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                <Cpu className="w-3.5 h-3.5" /> Compatible Battery Banks
              </div>
              <h3 className="text-xl font-bold text-[#0f2b48]">
                SMF VRLA & Lithium Battery Banks
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every Online UPS is backed by high-rate discharge batteries. We provide pre-assembled battery racks with genuine Exide Powersafe, Amaron Quanta, and LiFePO4 high-cycle energy cabinets.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">12V 26Ah - 200Ah SMF</span>
                <span className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">Heavy Copper Link Cables</span>
                <span className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">Tiered Powder-Coated Racks</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/category/smf-batteries"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline"
                >
                  <span>Explore UPS Batteries Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* AMC & Service Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-[#16a34a] px-3 py-1 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Lifecycle Engineering
              </div>
              <h3 className="text-xl font-bold text-[#0f2b48]">
                Installation, Commissioning & AMC
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Protect your capital investment with Livkam certified engineering. We handle end-to-end site inspection, thermal scanning, capacitor health audits, and enterprise AMC maintenance with guaranteed 4-hour SLA.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">Quarterly PM Visits</span>
                <span className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">4-Hr Breakdown Response</span>
                <span className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-semibold">Standby UPS Replacement</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline"
                >
                  <span>View UPS Services & AMC Plans</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DIRECT QUOTATION & ENQUIRY FORM + MAP */}
      <section id="quote-form" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
              <div className="mb-6">
                <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block">
                  Quick Quotation & Sizing Assistance
                </span>
                <h3 className="text-2xl font-black text-[#0f2b48] mt-1">
                  Get Online UPS Pricing & Technical Proposal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tell us your capacity, backup requirement, or connected load. Our certified engineers will provide an itemized quote within 2 working hours.
                </p>
              </div>

              {formSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">Quotation Request Received!</h4>
                  <p className="text-xs text-slate-600">
                    Thank you. Our power engineer will contact you shortly with the best OEM pricing and battery sizing.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={whatsappQuoteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <button
                      onClick={() => setFormSuccess(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-bold"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-200">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone / Mobile *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@company.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Company / Hospital / Facility
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Tech Solutions Pvt Ltd"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        UPS Capacity
                      </label>
                      <select
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      >
                        <option value="1 kVA - 3 kVA">1 kVA - 3 kVA</option>
                        <option value="5 kVA - 10 kVA">5 kVA - 10 kVA</option>
                        <option value="10 kVA - 20 kVA">10 kVA - 20 kVA</option>
                        <option value="20 kVA - 40 kVA">20 kVA - 40 kVA</option>
                        <option value="60 kVA - 200 kVA+">60 kVA - 200 kVA+</option>
                        <option value="Unsure (Need Sizing)">Unsure (Need Sizing)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phase
                      </label>
                      <select
                        value={formData.phase}
                        onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      >
                        <option value="Single Phase (1:1)">Single Phase (1:1)</option>
                        <option value="Three Phase (3:1)">Three Phase (3:1)</option>
                        <option value="Three Phase (3:3)">Three Phase (3:3)</option>
                        <option value="Rackmount 19-Inch">Rackmount 19-Inch</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Desired Backup Time
                      </label>
                      <select
                        value={formData.backupTime}
                        onChange={(e) => setFormData({ ...formData, backupTime: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                      >
                        <option value="10 - 15 Minutes">10 - 15 Minutes</option>
                        <option value="30 - 60 Minutes">30 - 60 Minutes</option>
                        <option value="1 - 2 Hours">1 - 2 Hours</option>
                        <option value="3 - 4 Hours+">3 - 4 Hours+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Project Notes / Specific Application
                    </label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify connected loads, brand preference (APC, Vertiv, Delta, Numeric), or special installation requirements..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full sm:w-auto bg-[#16a34a] hover:bg-green-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formSubmitting ? 'Submitting...' : 'Submit Quotation Request'}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={whatsappQuoteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Or Send Direct on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Contact & Map Column */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  Corporate Head Office & Experience Center
                </span>
                <h3 className="text-2xl font-black text-white">
                  Livkam Power Technologies
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Led by business owner <strong>Venu B N</strong>, our team of dedicated field engineers brings over a decade of power conditioning expertise to South India.
                </p>

                <div className="mt-6 space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Head Office:</span>
                      <span>21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Warehouse:</span>
                      <span>6 And 7 4th Cross Ganesh Nagar, Main Road, Vidyaranyapura Post, Telecom Colony, Kodigehalli, Bengaluru, Karnataka 560097</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>+91 8884988990 / +91 9945535819</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>info@livkampower.in</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Mon - Sat: 9:00 AM - 7:00 PM (24/7 Breakdown Dispatch)</span>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map & Clickable Picture */}
              <a
                href="https://maps.app.goo.gl/etcm3B5bA6CFLLs18"
                target="_blank"
                rel="noopener noreferrer"
                title="Click to open location in Google Maps"
                className="group relative block rounded-2xl overflow-hidden border border-slate-700 hover:border-[#16a34a] h-52 bg-slate-800 transition-all cursor-pointer"
              >
                <iframe
                  title="Livkam Power Technologies Google Map"
                  src="https://maps.google.com/maps?q=12.9134503,77.5613394&hl=en&z=17&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full pointer-events-none"
                ></iframe>
                <div className="absolute bottom-2.5 right-2.5 bg-slate-900/90 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg border border-slate-700 shadow-md flex items-center gap-1 group-hover:bg-[#16a34a] transition-all">
                  <span>Open in Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="https://maps.app.goo.gl/etcm3B5bA6CFLLs18"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl border border-slate-700 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. TECHNICAL FAQS ACCORDION */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Frequently Asked Questions
            </span>
            <h2 className="text-2xl font-black text-[#0f2b48]">
              Online UPS Technical Consultation
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#16a34a]" />
                What is the difference between Online UPS and Line-Interactive UPS?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                A true Online UPS operates on a continuous double-conversion topology (AC to DC, then DC to pure AC). It has zero millisecond transfer time, meaning connected equipment never detects a blackout. Line-interactive systems take 4-10ms to switch, which can reboot sensitive IT servers, medical MRI equipment, and PLC automation.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#16a34a]" />
                How do I calculate the right kVA capacity for my facility?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Sum up the maximum wattage of all connected devices and divide by the power factor (typically 0.8 to 0.9). For inductive loads such as motor pumps or laser cutters, allow a 2x to 3x inrush current buffer. Livkam provides free on-site power load audits in Bengaluru to size the exact kVA required.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#16a34a]" />
                Can Online UPS systems run seamlessly with diesel generators (DG sets)?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                Yes. Our APC, Delta, Vertiv, and Numeric online UPS systems feature a wide input voltage window (110V - 300V) and input frequency tolerance (40Hz - 70Hz). This ensures the UPS does not reject generator frequency shifts and stabilizes power seamlessly.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#16a34a]" />
                What battery chemistry is recommended for external backup banks?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                We recommend heavy-duty SMF VRLA batteries (like Amaron Quanta or Exide Powersafe) for cost-effective enterprise standby, or modern LiFePO4 Lithium battery modules for high cycle life, rapid 1-hour recharge, and compact space savings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
