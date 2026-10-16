import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Search, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Zap, 
  BatteryCharging, 
  Battery, 
  Cpu, 
  Home as HomeIcon, 
  Wrench, 
  ShieldAlert, 
  ShieldCheck,
  Activity,
  Monitor,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import LivkamLogo from './LivkamLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useBrands, useServices, useCategories, useProducts } from '../context/DataContext';
import { ONLINE_UPS_DROPDOWN, BATTERIES_DROPDOWN } from '../data/catalogsData';

export default function Header({ onOpenSearch, onOpenMobileMenu }) {
  const brands = useBrands();
  const services = useServices();
  const categories = useCategories();
  const products = useProducts();

  const { totalItems, openCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [upsOpen, setUpsOpen] = useState(false);
  const [batteriesOpen, setBatteriesOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Active Category Selection for Seamless 2-Pane Dropdown
  const [selectedUpsCat, setSelectedUpsCat] = useState(ONLINE_UPS_DROPDOWN[0]?.id || 'ups-manufacturer');
  const [selectedBatCat, setSelectedBatCat] = useState(BATTERIES_DROPDOWN[0]?.id || 'amaron-battery-wholesale-distributor');
  
  const upsLeaveTimeout = useRef(null);
  const batteriesLeaveTimeout = useRef(null);

  const handleUpsMouseEnter = () => {
    if (upsLeaveTimeout.current) clearTimeout(upsLeaveTimeout.current);
    setUpsOpen(true);
    setBatteriesOpen(false);
  };

  const handleUpsMouseLeave = () => {
    upsLeaveTimeout.current = setTimeout(() => {
      setUpsOpen(false);
    }, 250);
  };

  const handleBatteriesMouseEnter = () => {
    if (batteriesLeaveTimeout.current) clearTimeout(batteriesLeaveTimeout.current);
    setBatteriesOpen(true);
    setUpsOpen(false);
  };

  const handleBatteriesMouseLeave = () => {
    batteriesLeaveTimeout.current = setTimeout(() => {
      setBatteriesOpen(false);
    }, 250);
  };

  // Close menus on route change
  useEffect(() => {
    setUpsOpen(false);
    setBatteriesOpen(false);
    setProductsOpen(false);
    setBrandsOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. TOP BAR (DESKTOP) */}
      <div className="hidden lg:block bg-[#0f2b48] text-slate-200 text-xs py-2 px-4 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Left Contact & WhatsApp */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 font-medium">
              <a href="tel:+918884988990" className="flex items-center gap-1.5 hover:text-[#22c55e] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#22c55e]" />
                <span>+91 8884988990</span>
              </a>
              <span className="text-slate-500">|</span>
              <a href="tel:+919945535819" className="hover:text-[#22c55e] transition-colors">
                +91 9945535819
              </a>
            </div>

            {/* Social Media Logos (WhatsApp, FB, Insta, LinkedIn, YouTube) per image copy 67 */}
            <div className="flex items-center space-x-3 text-slate-300 pl-2 border-l border-slate-700/80">
              <a 
                href="https://wa.me/918884988990?text=Hi%20Livkam%20Power,%20I%20need%20assistance%20with%20UPS%20/%20Batteries" 
                target="_blank" 
                rel="noopener noreferrer"
                title="WhatsApp"
                className="text-[#22c55e] hover:text-[#16a34a] transition-transform hover:scale-110"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-[#22c55e]" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Facebook"
                className="hover:text-blue-400 transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Instagram"
                className="hover:text-pink-400 transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn"
                className="hover:text-sky-400 transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                title="YouTube"
                className="hover:text-red-500 transition-transform hover:scale-110"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Right Info: Email, Location, GST */}
          <div className="flex items-center space-x-6 font-medium text-slate-300">
            <a href="mailto:info@livkampower.in" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>info@livkampower.in</span>
            </a>
            
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>Bengaluru</span>
            </div>

            <div className="bg-slate-800/80 px-2.5 py-0.5 rounded text-[11px] font-mono text-slate-300 border border-slate-700">
              GST: <span className="text-[#22c55e] font-semibold">29CYMPN3694M1ZC</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER (DESKTOP & MOBILE) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[80px] sm:min-h-[96px] md:min-h-[108px] py-1.5">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center py-1">
            <LivkamLogo />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {/* 1. HOME */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                location.pathname === '/' 
                  ? 'text-[#16a34a] border-b-2 border-[#16a34a] rounded-none' 
                  : 'text-[#0f2b48] hover:text-[#16a34a]'
              }`}
            >
              Home
            </Link>

            {/* 2. ABOUT US */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                location.pathname === '/about' 
                  ? 'text-[#16a34a] border-b-2 border-[#16a34a] rounded-none' 
                  : 'text-[#0f2b48] hover:text-[#16a34a]'
              }`}
            >
              About Us
            </Link>

            {/* 3. PRODUCTS MEGA DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <Link
                to="/products"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/product') || location.pathname.startsWith('/categor')
                    ? 'text-[#16a34a]'
                    : 'text-[#0f2b48] hover:text-[#16a34a]'
                }`}
              >
                <span>Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${productsOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </Link>

              {/* Mega Menu Overlay */}
              {productsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[760px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {/* Col 1: UPS Systems */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#16a34a]" /> Online & Offline UPS
                      </h4>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/online-ups" className="text-slate-800 hover:text-[#16a34a] font-semibold block py-0.5">
                            Online UPS (1kVA - 500kVA)
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/small-backups" className="text-slate-600 hover:text-[#16a34a] font-medium block py-0.5">
                            Offline & Line Interactive UPS
                          </Link>
                        </li>
                        <li>
                          <Link to="/online-ups" className="text-slate-600 hover:text-[#16a34a] font-medium block py-0.5">
                            Industrial & Three-Phase UPS
                          </Link>
                        </li>
                        <li>
                          <Link to="/online-ups" className="text-slate-600 hover:text-[#16a34a] font-medium block py-0.5">
                            Modular & Rackmount UPS
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HomeIcon className="w-3.5 h-3.5 text-amber-500" /> Inverters & Solar
                      </h4>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/category/home-inverter" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Pure Sine Wave Home Inverters
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Col 2: Batteries & Power Protection */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BatteryCharging className="w-3.5 h-3.5 text-blue-600" /> UPS Batteries
                      </h4>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/batteries" className="text-blue-700 hover:underline font-bold block py-0.5">
                            All Batteries & Buyback Hub
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/smf-batteries" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            SMF / VRLA Batteries (AGM)
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/tubular-batteries" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Tubular Deep-Cycle Batteries
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/lithium-ups-batteries" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Lithium LiFePO4 Energy Storage
                          </Link>
                        </li>
                        <li>
                          <Link to="/batteries" className="text-slate-600 hover:text-[#16a34a] font-medium block py-0.5">
                            Battery Banks & Tiered Racks
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Voltage Stabilizers
                      </h4>
                      <ul className="space-y-1.5 text-xs">
                        <li>
                          <Link to="/category/stabilizer" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Servo & Static Stabilizers
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/stabilizer" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Power Protection Solutions
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Col 3: Promoted Card */}
                  <div className="bg-gradient-to-br from-[#0f2b48] to-[#1a3d60] rounded-xl p-5 text-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#16a34a] px-2 py-0.5 rounded text-white inline-block mb-2">
                        Livkam Power
                      </span>
                      <h4 className="font-bold text-sm leading-snug">Authorized Business Partner</h4>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        APC, Vertiv, Delta, Numeric, Exide & Amaron Quanta factory-sealed genuine products.
                      </p>
                    </div>
                    <div className="space-y-2 pt-4">
                      <Link
                        to="/online-ups"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-[#16a34a] hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Online UPS Section</span>
                      </Link>
                      <Link
                        to="/products"
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-white text-[#0f2b48] hover:bg-slate-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                      >
                        <span>All Products Directory</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. BRANDS DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => setBrandsOpen(true)}
              onMouseLeave={() => setBrandsOpen(false)}
            >
              <Link
                to="/brands"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/brand')
                    ? 'text-[#16a34a]'
                    : 'text-[#0f2b48] hover:text-[#16a34a]'
                }`}
              >
                <span>Brands</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${brandsOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </Link>

              {brandsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Authorized OEM Brand Partners
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        to={`/brands/${brand.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#16a34a] transition-colors"
                      >
                        <span className="font-bold">{brand.name}</span>
                        <span className="text-[10px] text-slate-400">{brand.country || 'India'}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/brands"
                      className="block text-center text-xs font-bold text-[#16a34a] hover:underline py-1"
                    >
                      View All 10 Brands →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 5. SERVICES DROPDOWN */}
            <div 
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                to="/services"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-semibold transition-colors ${
                  location.pathname.startsWith('/service')
                    ? 'text-[#16a34a]'
                    : 'text-[#0f2b48] hover:text-[#16a34a]'
                }`}
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </Link>

              {servicesOpen && (
                <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Power Engineering Services</span>
                    <span className="text-[10px] bg-emerald-100 text-[#16a34a] px-1.5 py-0.5 rounded font-bold">24/7 SLA</span>
                  </div>
                  <div className="py-2 space-y-1 text-xs">
                    <div className="text-[10px] font-bold text-slate-400 uppercase px-2 pt-1">Group A: Installation</div>
                    <Link to="/services/ups-installation" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#16a34a]">
                      <Wrench className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>UPS Installation & Commissioning</span>
                    </Link>
                    <Link to="/services/site-inspection" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#16a34a]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Site Inspection & Load Assessment</span>
                    </Link>
                    
                    <div className="text-[10px] font-bold text-slate-400 uppercase px-2 pt-2 border-t border-slate-100">Group B: Maintenance & AMC</div>
                    <Link to="/services/amc-maintenance" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Annual Maintenance Contracts (AMC)</span>
                    </Link>
                    <Link to="/services/ups-repair" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-blue-600">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Emergency UPS Repair (24/7)</span>
                    </Link>

                    <div className="text-[10px] font-bold text-slate-400 uppercase px-2 pt-2 border-t border-slate-100">Group C: Battery Support</div>
                    <Link to="/services/battery-replacement" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-purple-600">
                      <BatteryCharging className="w-3.5 h-3.5 text-purple-600" />
                      <span>Battery Replacement & Buyback</span>
                    </Link>
                    <Link to="/services/battery-maintenance-testing" className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-purple-600">
                      <Activity className="w-3.5 h-3.5 text-purple-600" />
                      <span>Battery Health Testing & Impedance</span>
                    </Link>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-center">
                    <Link
                      to="/services"
                      className="block text-xs font-bold text-[#16a34a] hover:underline py-1"
                    >
                      View All 9 Engineering Services →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* 6. ONLINE UPS DROPDOWN (Seamless 2-Pane Master-Detail Menu) */}
            <div 
              className="relative"
              onMouseEnter={handleUpsMouseEnter}
              onMouseLeave={handleUpsMouseLeave}
            >
              <Link
                to="/online-ups"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black tracking-wide transition-all ${
                  location.pathname.startsWith('/online-ups')
                    ? 'bg-[#16a34a] text-white shadow-sm'
                    : 'bg-emerald-50 text-[#16a34a] hover:bg-[#16a34a] hover:text-white border border-emerald-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>ONLINE UPS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${upsOpen ? 'rotate-180' : ''}`} />
              </Link>

              {upsOpen && (
                <div 
                  className="absolute top-full left-0 w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                  onMouseEnter={handleUpsMouseEnter}
                  onMouseLeave={handleUpsMouseLeave}
                >
                  {/* Left Column: Categories List */}
                  <div className="w-[270px] bg-slate-50/90 p-2.5 border-r border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/80 mb-1">
                        Select Category ({ONLINE_UPS_DROPDOWN.length})
                      </div>
                      <div className="space-y-0.5">
                        {ONLINE_UPS_DROPDOWN.map((cat) => {
                          const isSelected = cat.id === selectedUpsCat;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onMouseEnter={() => setSelectedUpsCat(cat.id)}
                              onClick={() => setSelectedUpsCat(cat.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-all ${
                                isSelected
                                  ? 'bg-emerald-100/80 text-[#16a34a] shadow-xs'
                                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              <span className="truncate pr-2">{cat.title}</span>
                              <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isSelected ? 'text-[#16a34a] translate-x-0.5' : 'text-slate-400'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/80">
                      <Link
                        to="/online-ups"
                        onClick={() => setUpsOpen(false)}
                        className="block text-center text-[11px] font-black text-[#16a34a] hover:underline py-1"
                      >
                        ⚡ View All Online UPS Systems →
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Catalogues of Active Category */}
                  <div className="flex-1 p-4 bg-white flex flex-col justify-between">
                    <div>
                      {(() => {
                        const currentCat = ONLINE_UPS_DROPDOWN.find(c => c.id === selectedUpsCat) || ONLINE_UPS_DROPDOWN[0];
                        return (
                          <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                              <div>
                                <span className="text-[10px] font-black uppercase text-[#16a34a] tracking-wider block">
                                  Category Catalogues
                                </span>
                                <h4 className="text-sm font-black text-slate-900">
                                  {currentCat.title}
                                </h4>
                              </div>
                              <span className="text-[10px] bg-emerald-50 text-[#16a34a] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                                {currentCat.items.length} Options
                              </span>
                            </div>

                            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                              {currentCat.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  to={`/online-ups/${item.slug}`}
                                  onClick={() => setUpsOpen(false)}
                                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/80 text-slate-700 hover:text-[#16a34a] transition-all group/item border border-transparent hover:border-emerald-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] group-hover/item:scale-125 transition-transform flex-shrink-0"></span>
                                    <span className="text-xs font-semibold leading-snug">{item.title}</span>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#16a34a] group-hover/item:translate-x-1 transition-all flex-shrink-0 ml-2" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Certified OEM Distributorship</span>
                      <span className="text-[#16a34a] font-bold">Bangalore Engineering Hub</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7. BATTERIES DROPDOWN (Seamless 2-Pane Master-Detail Menu) */}
            <div 
              className="relative"
              onMouseEnter={handleBatteriesMouseEnter}
              onMouseLeave={handleBatteriesMouseLeave}
            >
              <Link
                to="/batteries"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black tracking-wide transition-all ${
                  location.pathname.startsWith('/batteries')
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                }`}
              >
                <BatteryCharging className="w-3.5 h-3.5" />
                <span>BATTERIES</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${batteriesOpen ? 'rotate-180' : ''}`} />
              </Link>

              {batteriesOpen && (
                <div 
                  className="absolute top-full left-0 w-[640px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                  onMouseEnter={handleBatteriesMouseEnter}
                  onMouseLeave={handleBatteriesMouseLeave}
                >
                  {/* Left Column: Categories List */}
                  <div className="w-[270px] bg-slate-50/90 p-2.5 border-r border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/80 mb-1">
                        Battery Categories ({BATTERIES_DROPDOWN.length})
                      </div>
                      <div className="space-y-0.5">
                        {BATTERIES_DROPDOWN.map((cat) => {
                          const isSelected = cat.id === selectedBatCat;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onMouseEnter={() => setSelectedBatCat(cat.id)}
                              onClick={() => setSelectedBatCat(cat.id)}
                              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                isSelected
                                  ? 'bg-blue-100/80 text-blue-700 shadow-xs'
                                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
                              }`}
                            >
                              <span className="truncate pr-2">{cat.title}</span>
                              <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-slate-200/80">
                      <Link
                        to="/batteries"
                        onClick={() => setBatteriesOpen(false)}
                        className="block text-center text-[11px] font-black text-blue-600 hover:underline py-1"
                      >
                        🔋 View All Battery Solutions →
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: Catalogues of Active Category */}
                  <div className="flex-1 p-4 bg-white flex flex-col justify-between">
                    <div>
                      {(() => {
                        const currentCat = BATTERIES_DROPDOWN.find(c => c.id === selectedBatCat) || BATTERIES_DROPDOWN[0];
                        return (
                          <div>
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                              <div>
                                <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block">
                                  Category Catalogues
                                </span>
                                <h4 className="text-sm font-black text-slate-900">
                                  {currentCat.title}
                                </h4>
                              </div>
                              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                                {currentCat.items.length} Options
                              </span>
                            </div>

                            <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                              {currentCat.items.map((item) => (
                                <Link
                                  key={item.slug}
                                  to={`/batteries/${item.slug}`}
                                  onClick={() => setBatteriesOpen(false)}
                                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/80 text-slate-700 hover:text-blue-700 transition-all group/item border border-transparent hover:border-blue-100"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover/item:scale-125 transition-transform flex-shrink-0"></span>
                                    <span className="text-xs font-semibold leading-snug">{item.title}</span>
                                  </div>
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 group-hover/item:translate-x-1 transition-all flex-shrink-0 ml-2" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Amaron Quanta & Exide Authorized</span>
                      <span className="text-blue-600 font-bold">Scrap Buyback Available</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 7. CONTACT US */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                location.pathname === '/contact' 
                  ? 'text-[#16a34a] border-b-2 border-[#16a34a] rounded-none' 
                  : 'text-[#0f2b48] hover:text-[#16a34a]'
              }`}
            >
              Contact Us
            </Link>
          </nav>

          {/* Right Action Icons (Search, Account, Cart) */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2.5 text-[#0f2b48] hover:text-[#16a34a] hover:bg-slate-100 rounded-full transition-colors"
              title="Search products, brands, or categories"
              aria-label="Search"
            >
              <Search className="w-5 h-5 md:w-5 md:h-5" />
            </button>

            {/* Account Icon */}
            <Link
              to="/account"
              className="relative p-2.5 text-[#0f2b48] hover:text-[#16a34a] hover:bg-slate-100 rounded-full transition-colors"
              title={isLoggedIn ? `Account (${user.name})` : "Login / Account"}
              aria-label="Account"
            >
              <User className="w-5 h-5 md:w-5 md:h-5" />
              {isLoggedIn && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#16a34a] rounded-full ring-2 ring-white"></span>
              )}
            </Link>

            {/* Cart Icon with badge */}
            <button
              onClick={openCart}
              className="relative p-2.5 text-[#0f2b48] hover:text-[#16a34a] hover:bg-slate-100 rounded-full transition-colors"
              title="View Shopping Cart"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 md:w-5 md:h-5" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#16a34a] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 text-[#0f2b48] hover:text-[#16a34a] hover:bg-slate-100 rounded-lg transition-colors ml-1"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
