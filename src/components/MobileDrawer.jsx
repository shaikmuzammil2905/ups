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
import { categories } from '../data/categories';
import { brands } from '../data/brands';
import { services } from '../data/services';
import { products } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function MobileDrawer({ isOpen, onClose }) {
  const { user, isLoggedIn } = useAuth();
  const { totalItems } = useCart();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [onlineUpsOpen, setOnlineUpsOpen] = useState(false);
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
              <span>Home</span>
            </Link>

            <Link
              to="/products"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>All Products</span>
              <span className="text-xs bg-emerald-100 text-[#16a34a] px-2 py-0.5 rounded-full font-bold">500+</span>
            </Link>

            {/* Categories Accordion */}
            <div>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
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

            {/* Online UPS Accordion */}
            <div>
              <button
                onClick={() => setOnlineUpsOpen(!onlineUpsOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span>Online UPS Products</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${onlineUpsOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </button>

              {onlineUpsOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1 max-h-60 overflow-y-auto">
                  {products.filter(p => p.categoryId === 'online-ups' || p.categoryId === 'small-backups').map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/products/${prod.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 px-2 text-xs font-medium text-slate-600 hover:text-[#16a34a]"
                    >
                      <span className="truncate pr-2">{prod.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    </Link>
                  ))}
                  <Link
                    to="/category/online-ups"
                    onClick={onClose}
                    className="block py-2 text-center text-xs font-bold text-[#16a34a] hover:underline"
                  >
                    View All UPS →
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

            {/* Services Accordion */}
            <div>
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="w-full flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-[#16a34a]' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50 rounded-lg my-1">
                  {services.map((srv) => (
                    <Link
                      key={srv.id}
                      to={`/services/${srv.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-2 px-2 text-xs font-medium text-slate-600 hover:text-[#16a34a]"
                    >
                      <span className="truncate pr-2">{srv.title}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>About Us</span>
            </Link>

            <Link
              to="/posts"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>Guides & Posts</span>
            </Link>

            <Link
              to="/contact"
              onClick={onClose}
              className="flex items-center justify-between p-3 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <span>Contact & Store</span>
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
