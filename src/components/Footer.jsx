import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, FileText } from 'lucide-react';
import LivkamLogo from './LivkamLogo';

export default function Footer() {
  return (
    <footer className="bg-[#0b1f33] text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <LivkamLogo variant="footer" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mt-3">
              Livkam Power Technologies is Bengaluru's premier authorized distributor and solutions provider for industrial Online UPS, SMF batteries, home inverters, and sustainable power backup equipment.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-mono bg-slate-800/90 text-emerald-400 px-3 py-1.5 rounded border border-slate-700">
                GSTIN: 29CYMPN3694M1ZC
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-emerald-400 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/brands" className="hover:text-emerald-400 transition-colors">Brands</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-400 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/posts" className="hover:text-emerald-400 transition-colors">Posts / Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category/online-ups" className="hover:text-emerald-400 transition-colors">Online UPS</Link>
              </li>
              <li>
                <Link to="/category/smf-batteries" className="hover:text-emerald-400 transition-colors">SMF Batteries</Link>
              </li>
              <li>
                <Link to="/category/tubular-batteries" className="hover:text-emerald-400 transition-colors">Tubular Batteries</Link>
              </li>
              <li>
                <Link to="/category/home-inverter" className="hover:text-emerald-400 transition-colors">Home Inverters</Link>
              </li>
              <li>
                <Link to="/category/lithium-ups-batteries" className="hover:text-emerald-400 transition-colors">Lithium UPS</Link>
              </li>
              <li>
                <Link to="/category/stabilizer" className="hover:text-emerald-400 transition-colors">Stabilizers</Link>
              </li>
              <li>
                <Link to="/category/small-backups" className="hover:text-emerald-400 transition-colors">Small Backups</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Support */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Customer Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-1" />
                <div className="flex flex-col">
                  <a href="tel:+918884988990" className="hover:text-emerald-400 font-semibold">+91 8884988990</a>
                  <a href="tel:+919945535819" className="hover:text-emerald-400 text-xs text-slate-400">+91 9945535819</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <a href="mailto:info@livkampower.in" className="hover:text-emerald-400 break-all text-xs">
                  info@livkampower.in
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                <span className="text-xs text-slate-400 leading-relaxed">
                  21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru 560070
                </span>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="pt-4">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Follow Us</span>
              <div className="flex items-center space-x-2.5">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-blue-600 text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="Facebook"
                >
                  f
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="YouTube"
                >
                  ▶
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-pink-600 text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="Instagram"
                >
                  IG
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-sky-600 text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="LinkedIn"
                >
                  in
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 gap-4">
          <p>© 2025-2026 Livkam Power Technologies. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">|</span>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
            <span className="text-slate-700">|</span>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Shipping & Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
