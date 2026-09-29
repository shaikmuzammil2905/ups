import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0b1f33] text-slate-300 pt-16 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-800/80">
          
          {/* COLUMN 1 — LIVKAM POWER TECHNOLOGIES */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-white font-bold text-lg">Livkam Power Technologies</h3>
            <p className="text-sm font-medium text-emerald-400">Smart Power. Sustainable Future.</p>
            <p className="text-sm text-slate-400 leading-relaxed mt-2">
              Reliable UPS, batteries, inverters, stabilizers and power protection solutions for residential, commercial and industrial requirements.
            </p>
            <div className="pt-2 text-sm text-slate-400 space-y-1">
              <p>8884988990</p>
              <p>9945535819</p>
              <p>info@livkampower.in</p>
              <p className="text-xs text-slate-500 mt-2">GST: 29CYMPN3694M1ZC</p>
            </div>
          </div>

          {/* COLUMN 2 — QUICK LINKS */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-emerald-400 transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="hover:text-emerald-400 transition-colors">Categories</Link></li>
              <li><Link to="/products" className="hover:text-emerald-400 transition-colors">Catalogs</Link></li>
              <li><Link to="/brands" className="hover:text-emerald-400 transition-colors">Brands</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/account" className="hover:text-emerald-400 transition-colors">My Account</Link></li>
              <li><Link to="/cart" className="hover:text-emerald-400 transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* COLUMN 3 — WHAT WE OFFER */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">What We Offer</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/online-ups" className="hover:text-emerald-400 transition-colors">Online UPS</Link></li>
              <li><Link to="/category/smf-batteries" className="hover:text-emerald-400 transition-colors">SMF Batteries</Link></li>
              <li><Link to="/category/tubular-batteries" className="hover:text-emerald-400 transition-colors">Tubular Batteries</Link></li>
              <li><Link to="/category/lithium-ups-batteries" className="hover:text-emerald-400 transition-colors">Lithium UPS & Batteries</Link></li>
              <li><Link to="/category/home-inverter" className="hover:text-emerald-400 transition-colors">Home Inverters</Link></li>
              <li><Link to="/category/stabilizer" className="hover:text-emerald-400 transition-colors">Stabilizers</Link></li>
              <li><Link to="/category/small-backups" className="hover:text-emerald-400 transition-colors">Small Backups</Link></li>
              <li><Link to="/services/ups-installation" className="hover:text-emerald-400 transition-colors">UPS Installation</Link></li>
              <li><Link to="/services/ups-maintenance" className="hover:text-emerald-400 transition-colors">UPS Maintenance</Link></li>
              <li><Link to="/services/battery-replacement" className="hover:text-emerald-400 transition-colors">Battery Services</Link></li>
              <li><Link to="/services/amc-maintenance" className="hover:text-emerald-400 transition-colors">AMC Services</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Power Solutions</Link></li>
            </ul>
          </div>

          {/* COLUMN 4 — BRANDS & SUPPLY */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Brands & Supply</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/brands/apc" className="hover:text-emerald-400 transition-colors">APC</Link></li>
              <li><Link to="/brands/delta" className="hover:text-emerald-400 transition-colors">Delta</Link></li>
              <li><Link to="/brands/luminous" className="hover:text-emerald-400 transition-colors">Luminous</Link></li>
              <li><Link to="/brands/microtek" className="hover:text-emerald-400 transition-colors">Microtek</Link></li>
              <li><Link to="/brands/vertiv" className="hover:text-emerald-400 transition-colors">Vertiv</Link></li>
              <li><Link to="/brands/numeric" className="hover:text-emerald-400 transition-colors">Numeric</Link></li>
              <li><Link to="/brands/elnova" className="hover:text-emerald-400 transition-colors">Elnova</Link></li>
              <li><Link to="/brands/exide" className="hover:text-emerald-400 transition-colors">Exide</Link></li>
              <li><Link to="/brands/amaron" className="hover:text-emerald-400 transition-colors">Amaron</Link></li>
              <li><Link to="/brands/quanta" className="hover:text-emerald-400 transition-colors">Quanta</Link></li>
              <li className="pt-2"><Link to="/brands" className="text-emerald-400 hover:text-emerald-300 font-medium">View All Brands →</Link></li>
            </ul>
          </div>

          {/* COLUMN 5 — RETAIL & SERVICES */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Retail & Services</h3>
            <ul className="space-y-2 text-sm">
              <li><span className="text-slate-400">Retail Sales</span></li>
              <li><span className="text-slate-400">Wholesale Supply</span></li>
              <li><Link to="/services/ups-installation" className="hover:text-emerald-400 transition-colors">UPS Installation</Link></li>
              <li><Link to="/services/ups-maintenance" className="hover:text-emerald-400 transition-colors">UPS Maintenance</Link></li>
              <li><Link to="/services/battery-replacement" className="hover:text-emerald-400 transition-colors">Battery Replacement</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Battery Maintenance</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Power Backup Consultation</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Commercial Solutions</Link></li>
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Residential Solutions</Link></li>
              <li><span className="text-slate-400">After-Sales Support</span></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Technical Support</Link></li>
            </ul>
          </div>

          {/* COLUMN 6 — HR / CAREERS */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">HR / Careers</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Job Opportunities</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Technician Jobs</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Sales Jobs</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Service Engineer Jobs</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Submit Your Resume</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact HR</Link></li>
            </ul>
            
            <div className="mt-6">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-3">Address</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                21, Subhash Chandra Bose Rd,<br/>
                Banashankari 2nd Stage,<br/>
                Bendre Nagar, Bengaluru,<br/>
                Karnataka 560070
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Livkam Power Technologies. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700 hidden md:inline">|</span>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
            <span className="text-slate-700 hidden md:inline">|</span>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Shipping Policy</Link>
            <span className="text-slate-700 hidden md:inline">|</span>
            <Link to="/contact" className="hover:text-emerald-400 transition-colors">Refund/Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
