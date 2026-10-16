import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  ChevronDown, 
  Phone, 
  Mail, 
  MapPin, 
  Zap, 
  BatteryCharging, 
  Home, 
  ShieldAlert, 
  Wrench, 
  Tag, 
  User, 
  ShoppingBag, 
  FileText,
  MessageCircle 
} from 'lucide-react';
import LivkamLogo from './LivkamLogo';
import { useCategories, useBrands, useServices, useProducts } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ONLINE_UPS_DROPDOWN, BATTERIES_DROPDOWN } from '../data/catalogsData';

export default function MobileDrawer({ isOpen, onClose }) {
  const categories = useCategories();
  const brands = useBrands();
  const services = useServices();
  const products = useProducts();

  const { user, isLoggedIn } = useAuth();
  const { totalItems } = useCart();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [onlineUpsOpen, setOnlineUpsOpen] = useState(false);
  const [batteriesOpen, setBatteriesOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300">
        <div>
          {/* Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/80">
            <LivkamLogo showTagline={false} />
            <button 
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick User / Cart strip */}
          <div className="p-4 bg-[#0f2b48] text-white flex justify-between items-center text-xs">
            <Link 
              to="/account" 
              onClick={onClose}
              className="flex items-center gap-2 hover:text-[#22c55e] transition-colors"
            >
              <User className="w-4 h-4 text-[#22c55e]" />
              <span className="font-semibold">{isLoggedIn ? user.name : "Sign In / Register"}</span>
            </Link>
            <Link 
              to="/cart" 
              onClick={onClose}
              className="flex items-center gap-1.5 bg-[#16a34a] text-white px-2.5 py-1 rounded-full font-bold"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{totalItems} Items</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <Home className="w-4 h-4 text-slate-500" />
                <span>Home</span>
              </span>
            </Link>

            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>About Us</span>
            </Link>

            {/* Products Accordion */}
            <div>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-500" />
                  <span>Products</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                  <Link
                    to="/products"
                    onClick={onClose}
                    className="flex items-center justify-between py-2 px-2 text-xs font-bold text-[#16a34a]"
                  >
                    <span>⚡ Browse All Products (500+)</span>
                    <ChevronRight className="w-3 h-3 text-[#16a34a]" />
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 px-2 text-xs font-medium text-slate-600 hover:text-[#16a34a]"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
                  <Link
                    to="/categories"
                    onClick={onClose}
                    className="block py-2 text-center text-xs font-bold text-[#16a34a] hover:underline"
                  >
                    View All Categories →
                  </Link>
                </div>
              )}
            </div>

            {/* Brands Accordion */}
            <div>
              <button
                onClick={() => setBrandsOpen(!brandsOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span>Brands</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${brandsOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </button>

              {brandsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      to={`/brands/${brand.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 px-2 text-xs font-medium text-slate-600 hover:text-[#16a34a]"
                    >
                      <span>{brand.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </Link>
                  ))}
                  <Link
                    to="/brands"
                    onClick={onClose}
                    className="block py-2 text-center text-xs font-bold text-[#16a34a] hover:underline"
                  >
                    View All Brands →
                  </Link>
                </div>
              )}
            </div>

            {/* Services Accordion (3 Groups) */}
            <div>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-slate-500" />
                  <span>Services</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1 max-h-80 overflow-y-auto">
                  <Link
                    to="/services"
                    onClick={onClose}
                    className="block py-2 px-2 text-xs font-bold text-[#16a34a] border-b border-slate-200/60"
                  >
                    🛠️ All 9 Comprehensive Services →
                  </Link>

                  <div className="px-2 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Group A: UPS Installation
                  </div>
                  <Link to="/services/ups-installation" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    UPS Installation & Setup
                  </Link>
                  <Link to="/services/preventive-maintenance" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    Preventive Maintenance
                  </Link>
                  <Link to="/services/testing-commissioning" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    Testing & Commissioning
                  </Link>

                  <div className="px-2 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-200/60 mt-1">
                    Group B: Maintenance & Repair (AMC)
                  </div>
                  <Link to="/services/ups-repair" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    UPS Repair & Troubleshooting
                  </Link>
                  <Link to="/services/amc-contracts" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    AMC Maintenance Contracts
                  </Link>
                  <Link to="/services/emergency-support" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    24/7 Emergency Support
                  </Link>

                  <div className="px-2 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-t border-slate-200/60 mt-1">
                    Group C: Battery & Power Support
                  </div>
                  <Link to="/services/battery-replacement" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    Battery Replacement & Install
                  </Link>
                  <Link to="/services/battery-health-check" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    Battery Health & Impedance
                  </Link>
                  <Link to="/services/scrap-battery-buyback" onClick={onClose} className="block py-1 px-2 text-xs text-slate-600 hover:text-[#16a34a]">
                    Scrap Battery Buyback
                  </Link>
                </div>
              )}
            </div>

            {/* ONLINE UPS ACCORDION (9 Categories with Catalogues) */}
            <div>
              <div className="flex items-center justify-between p-3 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                <Link
                  to="/online-ups"
                  onClick={onClose}
                  className="flex items-center gap-2 flex-1"
                >
                  <Zap className="w-4 h-4 text-[#16a34a] fill-[#16a34a]" />
                  <span>ONLINE UPS</span>
                </Link>
                <button
                  onClick={() => setOnlineUpsOpen(!onlineUpsOpen)}
                  className="p-1 text-emerald-700 hover:text-emerald-900"
                  aria-label="Toggle Online UPS"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${onlineUpsOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {onlineUpsOpen && (
                <div className="pl-3 pr-2 py-2 space-y-2 bg-slate-50/80 rounded-lg my-1 max-h-80 overflow-y-auto border border-emerald-100">
                  <Link
                    to="/online-ups"
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-bold text-[#16a34a] border-b border-slate-200"
                  >
                    ⚡ All Online UPS Catalogues Hub →
                  </Link>
                  {ONLINE_UPS_DROPDOWN.map((cat) => (
                    <div key={cat.id} className="pt-1">
                      <div className="px-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        {cat.title}
                      </div>
                      <div className="space-y-0.5 mt-0.5">
                        {cat.items.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/online-ups/${item.slug}`}
                            onClick={onClose}
                            className="block py-1 px-2 text-xs text-slate-700 hover:text-[#16a34a] hover:bg-emerald-50/50 rounded"
                          >
                            • {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BATTERIES ACCORDION (3 Categories with Catalogues) */}
            <div>
              <div className="flex items-center justify-between p-3 rounded-lg text-sm font-bold text-blue-800 bg-blue-50 border border-blue-200">
                <Link
                  to="/batteries"
                  onClick={onClose}
                  className="flex items-center gap-2 flex-1"
                >
                  <BatteryCharging className="w-4 h-4 text-blue-600" />
                  <span>BATTERIES</span>
                </Link>
                <button
                  onClick={() => setBatteriesOpen(!batteriesOpen)}
                  className="p-1 text-blue-700 hover:text-blue-900"
                  aria-label="Toggle Batteries"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${batteriesOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {batteriesOpen && (
                <div className="pl-3 pr-2 py-2 space-y-2 bg-slate-50/80 rounded-lg my-1 max-h-80 overflow-y-auto border border-blue-100">
                  <Link
                    to="/batteries"
                    onClick={onClose}
                    className="block py-1.5 px-2 text-xs font-bold text-blue-700 border-b border-slate-200"
                  >
                    🔋 All Batteries & Buyback Hub →
                  </Link>
                  {BATTERIES_DROPDOWN.map((cat) => (
                    <div key={cat.id} className="pt-1">
                      <div className="px-2 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                        {cat.title}
                      </div>
                      <div className="space-y-0.5 mt-0.5">
                        {cat.items.map((item) => (
                          <Link
                            key={item.slug}
                            to={`/batteries/${item.slug}`}
                            onClick={onClose}
                            className="block py-1 px-2 text-xs text-slate-700 hover:text-blue-600 hover:bg-blue-50/50 rounded"
                          >
                            • {item.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/posts"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Guides & Posts</span>
              </span>
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Contact & Store</span>
              </span>
            </Link>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Livkam Bengaluru Store
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#16a34a]" />
            <a href="tel:+918884988990" className="font-semibold text-slate-800">+91 8884988990</a>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-[#22c55e]" />
            <a 
              href="https://wa.me/918884988990" 
              target="_blank" 
              rel="noreferrer"
              className="font-semibold text-[#16a34a]"
            >
              Chat on WhatsApp
            </a>
          </div>
          <div className="text-[10px] text-slate-500 pt-1 font-mono">
            GSTIN: 29CYMPN3694M1ZC
          </div>
        </div>
      </div>
    </div>
  );
}
