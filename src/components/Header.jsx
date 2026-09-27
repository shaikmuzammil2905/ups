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
  Zap, 
  BatteryCharging, 
  Battery, 
  Cpu, 
  Home as HomeIcon, 
  Wrench, 
  ShieldAlert, 
  Monitor,
  MessageCircle,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import LivkamLogo from './LivkamLogo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { brands } from '../data/brands';
import { services } from '../data/services';
import { categories } from '../data/categories';

export default function Header({ onOpenSearch, onOpenMobileMenu }) {
  const { totalItems, openCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [productsOpen, setProductsOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
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

            <a 
              href="https://wa.me/918884988990?text=Hi%20Livkam%20Power,%20I%20need%20assistance%20with%20UPS%20/%20Batteries" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#22c55e] font-semibold hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#22c55e]" />
              <span>WhatsApp</span>
            </a>
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
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <LivkamLogo />
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
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

            {/* Products Mega Dropdown */}
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
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white rounded-xl shadow-2xl border border-slate-100 p-6 grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  {/* Col 1: UPS & Batteries */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-[#16a34a]" /> Online UPS
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        <li>
                          <Link to="/category/online-ups" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Online UPS (1kVA - 200kVA)
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/small-backups" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Small Backups (600VA - 2kVA)
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <BatteryCharging className="w-3.5 h-3.5 text-blue-600" /> Batteries
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        <li>
                          <Link to="/category/smf-batteries" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            SMF VRLA Batteries
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/tubular-batteries" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Tubular Deep Cycle Batteries
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Col 2: Inverters & Lithium */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HomeIcon className="w-3.5 h-3.5 text-amber-500" /> Home Inverters
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        <li>
                          <Link to="/category/home-inverter" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Pure Sine Wave Inverters
                          </Link>
                        </li>
                        <li>
                          <Link to="/category/lithium-ups-batteries" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Lithium UPS & Storage
                          </Link>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" /> Power Protection
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        <li>
                          <Link to="/category/stabilizer" className="text-slate-700 hover:text-[#16a34a] font-medium block py-0.5">
                            Automatic Voltage Stabilizers
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Col 3: Quick Promo Box */}
                  <div className="bg-gradient-to-br from-[#0f2b48] to-[#1a3d60] rounded-lg p-5 text-white flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#16a34a] px-2 py-0.5 rounded text-white inline-block mb-2">
                        500+ Products
                      </span>
                      <h4 className="font-bold text-base leading-snug">Authorized Dealer</h4>
                      <p className="text-xs text-slate-300 mt-1">
                        APC, Vertiv, Exide, Amaron & Luminous genuine power products with factory warranty.
                      </p>
                    </div>
                    <Link
                      to="/products"
                      className="mt-4 inline-flex items-center justify-center gap-1.5 bg-white text-[#0f2b48] hover:bg-[#16a34a] hover:text-white px-3 py-2 rounded-md text-xs font-bold transition-colors"
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
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
                    Authorized Brand Partners
                  </div>
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        to={`/brands/${brand.slug}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#16a34a] transition-colors"
                      >
                        <span>{brand.name}</span>
                        <span className="text-[10px] text-slate-400">{brand.popularCategories?.length || 2}+ lines</span>
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

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/about' 
                  ? 'text-[#16a34a] border-b-2 border-[#16a34a] rounded-none' 
                  : 'text-[#0f2b48] hover:text-[#16a34a]'
              }`}
            >
              About Us
            </Link>

            {/* Services Dropdown */}
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
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-2 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Engineering & Maintenance
                  </div>
                  <div className="py-1">
                    {services.slice(0, 6).map((srv) => (
                      <Link
                        key={srv.id}
                        to={`/services/${srv.slug}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#16a34a] transition-colors"
                      >
                        <Wrench className="w-3.5 h-3.5 text-[#16a34a]" />
                        <span>{srv.title}</span>
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <Link
                      to="/services"
                      className="block text-center text-xs font-bold text-[#16a34a] hover:underline py-1"
                    >
                      View All 8 Services →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Posts / Blog */}
            <Link
              to="/posts"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname.startsWith('/posts') 
                  ? 'text-[#16a34a] border-b-2 border-[#16a34a] rounded-none' 
                  : 'text-[#0f2b48] hover:text-[#16a34a]'
              }`}
            >
              Posts
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-semibold transition-colors ${
                location.pathname === '/contact' 
                  ? 'text-[#16a34a] border-b-2 border-[#16a34a] rounded-none' 
                  : 'text-[#0f2b48] hover:text-[#16a34a]'
              }`}
            >
              Contact
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
