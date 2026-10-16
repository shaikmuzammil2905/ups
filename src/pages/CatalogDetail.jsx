import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Zap, BatteryCharging, ShieldCheck, Cpu, CheckCircle2, ChevronRight,
  Phone, MessageCircle, ArrowRight, MapPin, Mail, Clock, HelpCircle,
  FileText, Send, Check, Calculator, Award, Users, Briefcase, ThumbsUp
} from 'lucide-react';
import { getCatalogEntry, APPLIANCES_LIST, TROUBLESHOOTING_STEPS, INSTALLATION_STEPS } from '../data/catalogsData';
import { supabase } from '../lib/supabase';

export default function CatalogDetail({ type = 'online-ups' }) {
  const { slug } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setRefreshKey(k => k + 1);
    window.addEventListener('livkam_data_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('livkam_data_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);
  
  // Fetch from static catalog or custom saved override from localStorage
  const catalog = useMemo(() => {
    try {
      const customOverrides = JSON.parse(localStorage.getItem('livkam_custom_catalogs') || '{}');
      const targetSlug = slug || (type === 'batteries' ? 'amaron-quanta-battery' : 'ups-manufacturers-in-bangalore-peenya');
      if (customOverrides[targetSlug]) {
        return customOverrides[targetSlug];
      }
    } catch (_) {}
    return getCatalogEntry(slug, type);
  }, [slug, type, refreshKey]);

  const isBattery = catalog.type === 'batteries' || type === 'batteries';

  // ─── 1. Power Consumption Calculator State (Online UPS) ───
  const [quantities, setQuantities] = useState(() => {
    const init = {};
    APPLIANCES_LIST.forEach(app => { init[app.name] = 0; });
    return init;
  });

  const totalWatts = useMemo(() => {
    return APPLIANCES_LIST.reduce((sum, app) => sum + (app.watts * (Number(quantities[app.name]) || 0)), 0);
  }, [quantities]);

  const recommendedKva = useMemo(() => {
    if (totalWatts === 0) return 0;
    // Standard power factor 0.8 with 20% future buffer
    const kva = (totalWatts / (0.8 * 1000)) * 1.2;
    return Math.max(1, Math.ceil(kva));
  }, [totalWatts]);

  // ─── 2. Battery Backup Calculator State (Batteries) ───────
  const [calcUpsKva, setCalcUpsKva] = useState(5);
  const [calcBatteryAh, setCalcBatteryAh] = useState(150);
  const [calcBatteryQty, setCalcBatteryQty] = useState(16);
  const [calcPowerFactor, setCalcPowerFactor] = useState(0.8);
  const [calculatedBackup, setCalculatedBackup] = useState(null);

  const calculateBackupTime = () => {
    const kva = parseFloat(calcUpsKva) || 1;
    const ah = parseFloat(calcBatteryAh) || 100;
    const qty = parseInt(calcBatteryQty) || 1;
    const pf = parseFloat(calcPowerFactor) || 0.8;

    // Formula: Total Watt-Hours = Ah * 12V * Qty
    // Total Load Watts = kVA * 1000 * PF
    // Backup Hours = Total Watt-Hours / Total Load Watts * Efficiency (0.85)
    const totalWattHours = ah * 12 * qty;
    const loadWatts = kva * 1000 * pf;
    const rawHours = (totalWattHours / Math.max(100, loadWatts)) * 0.85;

    const hours = Math.floor(rawHours);
    const minutes = Math.round((rawHours - hours) * 60);

    setCalculatedBackup({
      hours,
      minutes,
      loadWatts: Math.round(loadWatts),
      totalWattHours: Math.round(totalWattHours)
    });
  };

  // ─── 3. Contact & Quote Form State ────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setFormError('Please enter your name and 10-digit mobile number.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      await supabase.from('enquiries').insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          company: formData.company,
          product_name: `${catalog.title} (${isBattery ? 'Battery Solution' : 'Online UPS'})`,
          message: `${formData.message} | Selected: ${catalog.title}`,
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', company: '', message: '' });
    } catch (err) {
      console.warn('Enquiry fallback:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/918884988990?text=${encodeURIComponent(
    `Hello Livkam Power Technologies, I would like to get a quote and technical details for ${catalog.title}.`
  )}`;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 1. GRAND BANNER / HERO (Image Copy 41) */}
      <section className="bg-gradient-to-br from-[#07192c] via-[#0f2b48] to-[#12385e] text-white pt-10 pb-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-6 font-medium">
            <Link to="/" className="hover:text-emerald-400">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to={isBattery ? "/batteries" : "/online-ups"} className="hover:text-emerald-400">
              {isBattery ? "Batteries" : "Online UPS"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-emerald-400 font-bold truncate max-w-xs">{catalog.title}</span>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              {isBattery ? <BatteryCharging className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              <span>{catalog.categoryName}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {catalog.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
              {catalog.subheading}
            </p>
          </div>

          {/* Grand Banner Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-w-5xl mx-auto bg-slate-900 aspect-21/9 max-h-[420px]">
            <img 
              src={catalog.banner} 
              alt={catalog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <span className="text-emerald-400 text-xs sm:text-sm font-bold uppercase tracking-widest">
                Livkam Power Technologies • Certified Power Engineering
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white mt-1">
                {catalog.heading}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EDITORIAL NARRATIVE & ACHIEVEMENT METRICS STRIP (Image Copy 41 & 42) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-[#d97706]">
              {catalog.title} - Livkam Power Technologies
            </h2>
            <div className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify sm:text-left space-y-4 font-normal">
              {catalog.editorialContent.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Metrics Strip (Image Copy 42) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y border-slate-200/80 bg-slate-50/50 rounded-2xl text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-red-600">50K +</div>
              <div className="text-xs sm:text-sm font-bold text-slate-700">Completed Projects</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-red-600">100K +</div>
              <div className="text-xs sm:text-sm font-bold text-slate-700">Happy Clients</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-red-600">10+</div>
              <div className="text-xs sm:text-sm font-bold text-slate-700">Years Experience</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-red-600">3 +</div>
              <div className="text-xs sm:text-sm font-bold text-slate-700">Industry Awards</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PICTORIAL SHOWCASE CARDS (Image Copy 42) */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Product Portfolio
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              Verified {catalog.title} Engineering Configurations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {catalog.models.map((mod, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col justify-between group hover:shadow-xl transition-all">
                {/* Yellow / Golden Showcase Background (Image Copy 42) */}
                <div className="bg-[#f59e0b] p-8 flex items-center justify-center min-h-[260px] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  <img 
                    src={mod.image} 
                    alt={mod.name} 
                    className="max-h-52 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-2xl z-10"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <h4 className="text-base font-black text-[#0f2b48] group-hover:text-[#16a34a] transition-colors">
                    {mod.name}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {mod.specs}
                  </p>
                  <div className="pt-2">
                    <a
                      href="#quote-section"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16a34a] hover:underline"
                    >
                      <span>Request Specification Sheet</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE CALCULATOR SECTION */}
      {/* (A) For Online UPS: Power Consumption Calculator (Image Copy 43 & 44) */}
      {!isBattery && (
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                Connected Load Estimator
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#d97706]">
                Power Consumption Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-2">
                Enter the quantity of your home or office appliances below to automatically calculate the total running wattage and recommended UPS capacity.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3.5 sm:p-4">Appliances</th>
                    <th className="p-3.5 sm:p-4 text-center">Watts</th>
                    <th className="p-3.5 sm:p-4 text-center w-32">Qty</th>
                    <th className="p-3.5 sm:p-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {APPLIANCES_LIST.map((app) => (
                    <tr key={app.name} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3.5 sm:p-4 font-medium text-slate-800">{app.name}</td>
                      <td className="p-3.5 sm:p-4 text-center text-slate-500 font-mono">{app.watts} W</td>
                      <td className="p-3.5 sm:p-4 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={quantities[app.name] || ''}
                          onChange={(e) => setQuantities({ ...quantities, [app.name]: parseInt(e.target.value) || 0 })}
                          placeholder="0"
                          className="w-16 text-center py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#16a34a]"
                        />
                      </td>
                      <td className="p-3.5 sm:p-4 text-right font-bold text-slate-800 font-mono">
                        {(app.watts * (quantities[app.name] || 0))} W
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Summary Footer */}
              <div className="bg-[#0f2b48] text-white p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Total Running Load:</div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono mt-0.5">
                    {totalWatts} Watts ({ (totalWatts / 1000).toFixed(2) } kW)
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Recommended Online UPS:</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 mt-0.5">
                    {recommendedKva > 0 ? `${recommendedKva} kVA Online UPS` : 'Select appliances above'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* (B) For Batteries: Battery Backup Calculator (Image Copy 64) */}
      {isBattery && (
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                Precision Sizing Tool
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#16a34a]">
                Livkam Battery Backup Calculator
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Calculate expected battery backup hours and minutes based on your UPS capacity and battery string configuration.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">UPS (kVA):</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={calcUpsKva}
                  onChange={(e) => setCalcUpsKva(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Battery Ah (Ampere-Hour):</label>
                <input
                  type="number"
                  min="7"
                  max="300"
                  value={calcBatteryAh}
                  onChange={(e) => setCalcBatteryAh(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Number of Batteries in String:</label>
                <input
                  type="number"
                  min="1"
                  max="64"
                  value={calcBatteryQty}
                  onChange={(e) => setCalcBatteryQty(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Power Factor:</label>
                <input
                  type="text"
                  readOnly
                  value="0.8"
                  className="w-full px-4 py-2.5 bg-black text-white font-mono rounded-xl text-sm font-bold"
                />
              </div>

              <button
                onClick={calculateBackupTime}
                className="w-full py-3.5 bg-[#e11d48] hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
              >
                CALCULATE BACKUP TIME
              </button>

              {calculatedBackup && (
                <div className="mt-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Standby Runtime:</span>
                  <div className="text-2xl sm:text-3xl font-black text-[#16a34a]">
                    {calculatedBackup.hours} Hours {calculatedBackup.minutes} Minutes
                  </div>
                  <div className="text-[11px] text-slate-500">
                    At {calculatedBackup.loadWatts} Watts continuous load (Total storage: {calculatedBackup.totalWattHours} Wh)
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 5. WHY CHOOSE LIVKAM SECTION (Image Copy 45) */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0f2b48] text-white rounded-3xl p-6 sm:p-10 mb-8 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Why Choose Livkam Power Technologies for UPS & Battery?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
              Livkam Power Technologies provides end-to-end <strong>UPS and battery solutions</strong> — from new online UPS <strong>sales with 1 year free maintenance</strong> to <strong>UPS battery services, AMC contracts, UPS & battery buyback</strong>, and <strong>standby UPS rental</strong> during breakdown or upgrade.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[11px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-semibold">UPS SALES</span>
              <span className="text-[11px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-semibold">1 YEAR FREE MAINTENANCE*</span>
              <span className="text-[11px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-semibold">UPS BATTERY SERVICE</span>
              <span className="text-[11px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-semibold">UPS AMC</span>
              <span className="text-[11px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-semibold">BUYBACK PROGRAM</span>
              <span className="text-[11px] bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full font-semibold">STANDBY / RENTAL UPS</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* 4 Feature Boxes */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  💡
                </div>
                <h4 className="font-bold text-sm text-[#0f2b48]">UPS Sales with 1 Year Free Maintenance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Buy new online UPS from Livkam and get 1 year free maintenance — periodic health check, cleaning, tightening, and performance review.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16a34a] flex items-center justify-center font-bold">
                  🔋
                </div>
                <h4 className="font-bold text-sm text-[#0f2b48]">Complete UPS Battery Services</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Battery IR testing, replacement, string balancing, and backup audit to ensure your UPS delivers required runtime during power failure.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  🛠️
                </div>
                <h4 className="font-bold text-sm text-[#0f2b48]">UPS AMC & Breakdown Support</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Flexible UPS AMC (Labour-only or Comprehensive) with scheduled PM visits, detailed service reports, and priority response for critical sites.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  ♻️
                </div>
                <h4 className="font-bold text-sm text-[#0f2b48]">Buyback & Standby UPS Options</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Exchange your old UPS and batteries with our buyback program and get standby/rental UPS so that your office never goes down during upgrade.
                </p>
              </div>
            </div>

            {/* Collage Showcase Image (Image Copy 45) */}
            <div className="lg:col-span-5 rounded-3xl overflow-hidden shadow-xl border border-slate-200 relative bg-slate-900 aspect-4/3">
              <img 
                src="/images/about-showcase.png" 
                alt="Livkam Power Technologies Field Services" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#0f2b48]/90 backdrop-blur-xs text-white p-3 rounded-xl text-center text-xs font-bold border border-white/20">
                Sales • Service • AMC • Buyback • Standby UPS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL SPECIFICATIONS TABLE (Image Copy 46) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <span className="text-xs font-bold text-[#d97706] uppercase tracking-wider block">
              Engineering Parameters
            </span>
            <h3 className="text-2xl font-black text-[#0f2b48] mt-1">
              Technical Specifications – {catalog.title}
            </h3>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="bg-[#0f2b48] text-white p-4 font-bold text-sm">
              General Technical Specifications
            </div>
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                {catalog.specsData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3.5 sm:p-4 font-bold text-slate-800 bg-slate-50/50 w-1/3">
                      {row.param}
                    </td>
                    <td className="p-3.5 sm:p-4 text-slate-600">
                      {row.m1}
                      {row.m2 && ` | ${row.m2}`}
                      {row.m3 && ` | ${row.m3}`}
                      {row.m4 && ` | ${row.m4}`}
                      {row.m5 && ` | ${row.m5}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 7. STEP-BY-STEP INSTALLATION PROCESS (Image Copy 47) */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              {isBattery ? 'UPS Battery Installation Process' : 'Online UPS Installation & Commissioning Process'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-2xl mx-auto">
              At Livkam Power Technologies, our certified technicians in Bangalore follow these 5 essential steps for optimal performance and safety.
            </p>
          </div>

          <div className="space-y-4">
            {INSTALLATION_STEPS.map((step) => (
              <div key={step.step} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0f2b48] text-white flex items-center justify-center font-bold text-xs">
                    {step.step}
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800">
                    {step.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-11">
                  {step.desc}
                </p>
                <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {step.points.map((pt, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. EMBEDDED VIDEO SECTION (Image Copy 62) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div>
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Video Demonstration
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              Power Unmatched: {catalog.title}
            </h3>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-black aspect-16/9 max-w-3xl mx-auto">
            <iframe
              src={catalog.videoUrl}
              title={catalog.title}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* 9. BATTERY TROUBLESHOOTING GUIDE (Image Copy 63) */}
      {isBattery && (
        <section className="py-14 bg-slate-50 border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-red-600">
                Battery Trouble Shooting
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Standard troubleshooting protocol followed by Livkam field engineers across Karnataka.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs bg-white">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-sky-100 text-slate-800 font-bold border-b border-slate-200">
                    <th className="p-3.5 sm:p-4 w-1/4">Issue / Step</th>
                    <th className="p-3.5 sm:p-4 w-1/3">Solution</th>
                    <th className="p-3.5 sm:p-4">More Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TROUBLESHOOTING_STEPS.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3.5 sm:p-4 font-bold text-slate-800">{row.step}</td>
                      <td className="p-3.5 sm:p-4 text-slate-700">{row.solution}</td>
                      <td className="p-3.5 sm:p-4 text-slate-500 leading-relaxed">{row.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* 10. TECHNICAL FAQS SECTION (Image Copy 65) */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              Got Questions?
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0f2b48]">
              FAQS - {catalog.title}
            </h3>
          </div>

          <div className="space-y-4">
            {catalog.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2">
                <h4 className="text-sm sm:text-base font-bold text-slate-800 flex items-start gap-2.5">
                  <span className="text-[#16a34a] font-bold">{i + 1}.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. HIGH-CONVERSION CONTACT & RFQ FORM (Image Copy 48) */}
      <section id="quote-section" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-block bg-white/10 text-emerald-400 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              ⚙️ Trusted Power Engineering Since 2010
            </div>
            <h3 className="text-3xl sm:text-4xl font-black text-white">
              India's Leading UPS & Battery Supplier
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              For the most trusted Online UPS Manufacturer & Supplier in Bangalore and India, contact us today:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Contact Us Now */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
              <h4 className="text-xl font-bold text-white border-b border-white/10 pb-3">
                Contact Us Now
              </h4>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Call Us Directly
                </span>
                <p className="text-xs text-slate-300">
                  Speak with our UPS & battery experts for pricing & technical consultation:
                </p>
                <div className="space-y-2 pt-1">
                  <a href="tel:+918884988990" className="w-full flex items-center gap-3 bg-[#16a34a] hover:bg-green-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>+91 8884988990 (Sales & Sizing)</span>
                  </a>
                  <a href="tel:+919945535819" className="w-full flex items-center gap-3 bg-[#16a34a] hover:bg-green-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>+91 9945535819 (Emergency Service)</span>
                  </a>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Email Us
                </span>
                <p className="text-xs text-slate-300">
                  Send your requirements for a detailed itemized quote:
                </p>
                <a href="mailto:info@livkampower.in" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:underline">
                  <Mail className="w-4 h-4" />
                  <span>info@livkampower.in</span>
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-green-600 text-white px-4 py-3 rounded-xl text-xs font-bold transition-colors shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Instant Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Get Instant Quote Form */}
            <div className="lg:col-span-7 bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h4 className="text-xl font-black text-[#0f2b48] mb-1">
                Get Instant Quote
              </h4>
              <p className="text-xs text-slate-500 mb-6">
                Fill this form and our senior engineer will call you back with the best price:
              </p>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#16a34a] mx-auto" />
                  <h5 className="font-bold text-base text-slate-800">Quote Request Submitted!</h5>
                  <p className="text-xs text-slate-600">
                    Thank you. We have received your requirement for <strong>{catalog.title}</strong> and will reach out promptly.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl"
                    >
                      Follow-up on WhatsApp
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="text-xs bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 font-medium">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your 10-digit mobile number"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email address"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Company / Facility</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Hospital, IT Office, Manufacturing Plant"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Specific Requirement</label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={`Requirement details for ${catalog.title}...`}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-[#16a34a] hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'SUBMIT QUOTATION REQUEST'}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. DARK ADDRESS & GOOGLE MAP SECTION (Image Copy 49) */}
      <section className="bg-black text-white py-14 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <h4 className="text-xl font-black text-white">Livkam Power Technologies - Contact</h4>
              
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Head Office:</strong> 21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Warehouse:</strong> #39 Sy No 24 Bommandahalli village, Dyavasandra, Anekal Taluk, Jigani, Bengaluru, Karnataka 560105</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>+91 8884988990 / +91 9945535819</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>info@livkampower.in</span>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="rounded-2xl overflow-hidden border border-slate-800 h-56 bg-slate-900 mt-4">
                <iframe
                  title="Livkam Bengaluru Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzQwLjQiTiA3N8KwMzInNTguMiJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h4 className="text-lg font-bold text-white">Send Us a Quick Note</h4>
              <p className="text-xs text-slate-400">Our Bengaluru customer support team responds within 2 hours.</p>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Your Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                />
                <textarea
                  rows={3}
                  placeholder="How can we help you? *"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#16a34a]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#16a34a] hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-colors uppercase tracking-wider"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
