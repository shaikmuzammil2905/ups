import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BatteryCharging, Battery, Cpu, ShieldCheck, CheckCircle2, ChevronRight, 
  Phone, MessageCircle, ArrowRight, SlidersHorizontal, ArrowUpRight, 
  RefreshCw, Wrench, Clock, MapPin, Mail, HelpCircle, Layers, Check
} from 'lucide-react';
import { useProducts, useBrands, useSiteSettings } from '../context/DataContext';
import ProductCard from '../components/ProductCard';
import BrandLogo from '../components/BrandLogo';
import { supabase } from '../lib/supabase';

export default function Batteries() {
  const products = useProducts();
  const brands = useBrands();
  const settings = useSiteSettings();

  // Filters
  const [activeTab, setActiveTab] = useState('all'); // all, smf, tubular, lithium, accessories
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    batteryType: 'SMF VRLA (UPS)',
    capacityAh: '100Ah - 150Ah',
    quantity: '4 Units',
    hasOldBattery: 'Yes (Need Buyback Scrap Discount)',
    location: 'Bengaluru',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Filter battery products
  const batteryProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.filter(p => {
      if (!p) return false;
      const cat = String(p.category_id || p.category || p.categoryName || '').toLowerCase();
      const name = String(p.name || '').toLowerCase();
      const isBat = cat.includes('battery') || cat.includes('batteries') || name.includes('battery') || name.includes('quanta') || name.includes('powersafe') || name.includes('tubular');

      // Chemistry / Tab filter
      if (activeTab === 'smf' && !cat.includes('smf') && !name.includes('smf') && !name.includes('vrla') && !name.includes('quanta')) return false;
      if (activeTab === 'tubular' && !cat.includes('tubular') && !name.includes('tubular')) return false;
      if (activeTab === 'lithium' && !cat.includes('lithium') && !name.includes('lithium') && !name.includes('lifepo4')) return false;

      // Brand filter
      if (selectedBrand !== 'all') {
        const pBrand = String(p.brand_id || p.brandId || p.brand || p.brand_name || '').toLowerCase();
        if (!pBrand.includes(selectedBrand.toLowerCase())) return false;
      }

      // Capacity Ah filter
      if (selectedCapacity !== 'all') {
        const text = `${p.name || ''} ${p.capacity || ''} ${JSON.stringify(p.specs || {})}`.toLowerCase();
        if (selectedCapacity === 'small' && !text.includes('7ah') && !text.includes('12ah') && !text.includes('18ah')) return false;
        if (selectedCapacity === 'mid' && !text.includes('26ah') && !text.includes('42ah') && !text.includes('65ah')) return false;
        if (selectedCapacity === 'large' && !text.includes('100ah') && !text.includes('120ah') && !text.includes('150ah')) return false;
        if (selectedCapacity === 'extra' && !text.includes('200ah') && !text.includes('220ah') && !text.includes('250ah')) return false;
      }

      // Search query
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullText = `${p.name || ''} ${p.brand_name || ''} ${p.capacity || ''} ${p.description || ''}`.toLowerCase();
        if (!fullText.includes(q)) return false;
      }

      return isBat;
    });
  }, [products, activeTab, selectedBrand, selectedCapacity, searchQuery]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormError('Please provide your name and phone number.');
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
          product_name: `Battery Enquiry: ${formData.batteryType} (${formData.capacityAh}, Qty: ${formData.quantity})`,
          message: `Buyback old battery: ${formData.hasOldBattery} | Location: ${formData.location} | Notes: ${formData.notes}`,
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);
      if (error) throw error;
      setFormSuccess(true);
    } catch (err) {
      console.error('Enquiry error:', err);
      setFormSuccess(true);
    } finally {
      setFormSubmitting(false);
    }
  };

  const whatsappQuoteUrl = `https://wa.me/918884988990?text=${encodeURIComponent(
    `Hi Livkam Power Technologies, I would like to get a quote for UPS / Inverter Batteries: Type: ${formData.batteryType}, Capacity: ${formData.capacityAh}, Quantity: ${formData.quantity}, Old Battery Buyback: ${formData.hasOldBattery}, Location: Bengaluru.`
  )}`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#0c233c] via-[#0f2b48] to-[#163a60] text-white py-16 lg:py-24 overflow-hidden border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-6 font-medium">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to="/products" className="hover:text-emerald-400 transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-blue-400 font-bold">Industrial & UPS Batteries</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <BatteryCharging className="w-4 h-4" />
                <span>Heavy-Duty Standby & Energy Storage Solutions</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                Authentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">UPS Batteries</span> & Doorstep Replacement
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                High-rate discharge SMF VRLA batteries, deep-cycle tall tubular inverter batteries, and next-gen LiFePO4 lithium energy storage. Authorized distributor for <strong>Amaron Quanta, Exide Powersafe, and Luminous</strong> with official manufacturer warranty and old battery buyback discounts.
              </p>

              {/* Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-blue-400">100% OEM</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Fresh Mfg Date</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-emerald-400">Max Scrap</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Buyback Rebate</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-amber-400">Free On-Site</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Health Testing</div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-purple-400">2-4 Hrs</div>
                  <div className="text-[11px] text-slate-400 uppercase font-bold tracking-wide">Doorstep Delivery</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href="#battery-quote"
                  className="bg-[#16a34a] hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-green-900/40 flex items-center gap-2"
                >
                  <BatteryCharging className="w-4 h-4" />
                  <span>Get Battery Pricing & Buyback Quote</span>
                </a>
                <a
                  href="tel:+918884988990"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-3.5 rounded-xl text-sm transition-colors border border-slate-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Battery Specialist</span>
                </a>
              </div>
            </div>

            {/* Right: Quick Buyback Box */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-400" />
                <span>Old Battery Buyback Exchange Program</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Sagging runtime? Don't let degraded batteries cause sudden server or inverter blackouts. Exchange your old worn-out batteries for factory-sealed fresh units with maximum green scrap valuation.
              </p>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Free doorstep collection & certified eco-friendly recycling</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Inter-cell link cable torque inspection & corrosion cleaning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>UPS float/boost charging calibration to prevent battery boiling</span>
                </li>
              </ul>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>Doorstep Installation in Bengaluru</span>
                <span className="text-emerald-400 font-bold">Same Day SLA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHEMISTRY TABS & NAVIGATION */}
      <section className="bg-white border-b border-slate-200 sticky top-[72px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-3 gap-2 sm:gap-4 no-scrollbar">
            {[
              { id: 'all', label: 'All Batteries', icon: BatteryCharging },
              { id: 'smf', label: 'SMF / VRLA Batteries', icon: BatteryCharging },
              { id: 'tubular', label: 'Tall Tubular Inverter Batteries', icon: Battery },
              { id: 'lithium', label: 'Lithium LiFePO4 Energy Storage', icon: Cpu },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#0f2b48] text-white shadow-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FILTERS & SEARCH */}
      <section className="py-6 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filter Ah:
            </span>
            {[
              { id: 'all', label: 'All Ah Ratings' },
              { id: 'small', label: '7Ah - 18Ah (Small UPS)' },
              { id: 'mid', label: '26Ah - 65Ah (Data Cabinets)' },
              { id: 'large', label: '100Ah - 150Ah (Standard)' },
              { id: 'extra', label: '200Ah+ (Heavy Backup)' },
            ].map(cap => (
              <button
                key={cap.id}
                onClick={() => setSelectedCapacity(cap.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCapacity === cap.id
                    ? 'bg-[#16a34a] text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cap.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800"
            >
              <option value="all">All Battery Brands</option>
              <option value="quanta">Amaron Quanta</option>
              <option value="exide">Exide</option>
              <option value="luminous">Luminous</option>
              <option value="delta">Delta Lithium</option>
            </select>

            <input
              type="text"
              placeholder="Search battery model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
            />
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
              Battery Models ({batteryProducts.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Factory sealed batteries with warranty card and verified manufacturing date.
            </p>
          </div>
          <a
            href="#battery-quote"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline"
          >
            <span>Need Sizing for Online UPS Bank?</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {batteryProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <BatteryCharging className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No battery products match current filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We stock the entire ranges of Amaron Quanta, Exide Powersafe, and Tubular batteries. Contact our Bangalore warehouse directly for instant pricing.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => { setActiveTab('all'); setSelectedCapacity('all'); setSelectedBrand('all'); setSearchQuery(''); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Reset Filters
              </button>
              <a
                href="#battery-quote"
                className="px-4 py-2 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Get Custom Quote
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {batteryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 5. BATTERY CHEMISTRY COMPARISON TABLE */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Engineering Selection Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              Comparing Battery Chemistries: Which One Do You Need?
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0f2b48] text-white">
                  <th className="p-4 font-bold">Feature</th>
                  <th className="p-4 font-bold">SMF / VRLA (AGM)</th>
                  <th className="p-4 font-bold">Tall Tubular (Lead-Acid)</th>
                  <th className="p-4 font-bold">Lithium LiFePO4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr>
                  <td className="p-4 font-bold bg-slate-100/60">Primary Application</td>
                  <td className="p-4">Online UPS, IT server banks, hospitals</td>
                  <td className="p-4">Home inverters, solar backups, long outages</td>
                  <td className="p-4 font-bold text-emerald-700">High-density modern data centers & solar</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-slate-100/60">Maintenance Required</td>
                  <td className="p-4 text-emerald-600 font-bold">Zero (100% Sealed)</td>
                  <td className="p-4 text-amber-600">Periodic Distilled Water Topping</td>
                  <td className="p-4 text-emerald-600 font-bold">Zero (Internal Smart BMS)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-slate-100/60">Discharge Performance</td>
                  <td className="p-4 font-bold text-[#0f2b48]">High-Rate Instant Discharge</td>
                  <td className="p-4">Deep slow discharge over 4-8 hours</td>
                  <td className="p-4">Ultra-high discharge & rapid recharge</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-slate-100/60">Recharge Time</td>
                  <td className="p-4">6 - 8 Hours</td>
                  <td className="p-4">10 - 12 Hours</td>
                  <td className="p-4 font-bold text-emerald-600">1 - 2 Hours (Ultra-fast)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-slate-100/60">Expected Lifespan</td>
                  <td className="p-4">3 - 5 Years (at 25°C)</td>
                  <td className="p-4">4 - 6 Years</td>
                  <td className="p-4 font-bold text-purple-700">10+ Years (3,500+ Cycles)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold bg-slate-100/60">Leading Brands</td>
                  <td className="p-4">Amaron Quanta, Exide Powersafe</td>
                  <td className="p-4">Exide, Luminous, Amaron</td>
                  <td className="p-4">Delta, Livkam Power, Luminous</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. DIRECT QUOTATION & ENQUIRY FORM */}
      <section id="battery-quote" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
              <div className="mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                  Quick Battery Quotation & Buyback
                </span>
                <h3 className="text-2xl font-black text-[#0f2b48] mt-1">
                  Enquire for Best Battery Pricing
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your requirements below. Receive wholesale pricing and buyback exchange value directly.
                </p>
              </div>

              {formSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
                  <h4 className="text-base font-bold text-slate-800">Battery Request Received!</h4>
                  <p className="text-xs text-slate-600">
                    Our team will contact you with current batch pricing and maximum scrap rebate calculation.
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
                        placeholder="e.g. Anand Sharma"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 99455 35819"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Battery Type
                      </label>
                      <select
                        value={formData.batteryType}
                        onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="SMF VRLA (Online UPS)">SMF VRLA (Online UPS)</option>
                        <option value="Tall Tubular (Home Inverter)">Tall Tubular (Home Inverter)</option>
                        <option value="Lithium LiFePO4">Lithium LiFePO4</option>
                        <option value="Battery Rack & Links">Battery Rack & Links</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Capacity (Ah)
                      </label>
                      <select
                        value={formData.capacityAh}
                        onChange={(e) => setFormData({ ...formData, capacityAh: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="7Ah - 18Ah">7Ah - 18Ah</option>
                        <option value="26Ah - 42Ah">26Ah - 42Ah</option>
                        <option value="65Ah - 100Ah">65Ah - 100Ah</option>
                        <option value="120Ah - 150Ah">120Ah - 150Ah</option>
                        <option value="200Ah+">200Ah+</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        placeholder="e.g. 16 Units for 10kVA"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Old Battery Buyback Exchange?
                      </label>
                      <select
                        value={formData.hasOldBattery}
                        onChange={(e) => setFormData({ ...formData, hasOldBattery: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-emerald-700"
                      >
                        <option value="Yes (Need Buyback Scrap Discount)">Yes (Need Maximum Scrap Discount)</option>
                        <option value="No (Fresh Installation)">No (Fresh Installation)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Delivery Location in Bengaluru
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g. Banashankari, Whitefield, Peenya"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Existing UPS Model or Special Notes
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. For APC Smart-UPS 5kVA, require tiered rack and 16 batteries..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3">
                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full sm:w-auto bg-[#16a34a] hover:bg-green-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {formSubmitting ? 'Submitting...' : 'Request Battery Quotation'}
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      href={whatsappQuoteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#25D366] hover:underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Details & Map */}
            <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Bengaluru Doorstep Battery Dispatch
                </span>
                <h3 className="text-2xl font-black text-white">
                  Livkam Power Technologies
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Fast mobile battery delivery across Banashankari, Electronic City, Whitefield, Peenya Industrial Area, Rajajinagar, and surrounding Karnataka hubs.
                </p>

                <div className="mt-6 space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>+91 8884988990 / +91 9945535819</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>info@livkampower.in</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span>Mon - Sat: 9:00 AM - 7:00 PM (Emergency Battery Hotline)</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-700 h-52 bg-slate-800">
                <iframe
                  title="Livkam Power Technologies Battery Hub"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzQwLjQiTiA3N8KwMzInNTguMiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <a
                href="https://maps.google.com/?q=21+Subhash+Chandra+Bose+Rd+Banashankari+2nd+Stage+Bengaluru"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-3 rounded-xl border border-slate-700 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-4 h-4 text-blue-400" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
