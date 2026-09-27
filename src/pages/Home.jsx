import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2, 
  Sparkles, 
  Package, 
  Award, 
  Users, 
  ThumbsUp, 
  Phone,
  MessageCircle,
  Clock,
  Wrench,
  Cpu,
  Layers,
  Percent,
  Check,
  Building2,
  Leaf
} from 'lucide-react';
import { categories } from '../data/categories';
import { brands } from '../data/brands';
import { products } from '../data/products';
import BrandLogo from '../components/BrandLogo';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';

export default function Home() {
  const navigate = useNavigate();
  const bestSellersContainerRef = useRef(null);

  // Best seller products from products data
  const bestSellers = products.filter((p) => p.bestseller || p.featured).slice(0, 6);

  const scrollBestSellers = (direction) => {
    if (bestSellersContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      bestSellersContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] overflow-hidden">
      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-6 pb-12 md:pt-12 md:pb-20 bg-gradient-to-b from-sky-50/80 via-white to-[#f8fafc] border-b border-slate-100">
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-200/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 bg-[#16a34a] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-xs">
                <span>Reliable Power Solutions</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#0f2b48] tracking-tight leading-[1.12]">
                Uninterrupted Power <br />
                for a <span className="text-[#16a34a]">Better Tomorrow</span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Premium UPS, Batteries, Inverters & Power Solutions from World's Leading Brands.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-white hover:bg-slate-50 text-[#0f2b48] border-2 border-[#0f2b48] px-7 py-3.5 rounded-full text-sm font-bold transition-all hover:shadow-xs active:scale-95"
                >
                  <span>Explore Products</span>
                </Link>
              </div>
            </div>

            {/* Right Visual Power Collage Montage */}
            <div className="lg:col-span-6 relative">
              {/* Script Slogan Tag */}
              <div className="absolute -top-6 right-4 sm:right-10 z-10 text-right hidden sm:block">
                <span className="font-serif italic text-lg sm:text-2xl font-bold text-sky-800/80 drop-shadow-xs">
                  Reliable Brands. <br />
                  <span className="text-[#16a34a]">Lasting Performance.</span>
                </span>
              </div>

              {/* Realistic Montage Presentation Frame */}
              <div className="relative rounded-3xl bg-gradient-to-tr from-sky-100/60 via-emerald-50/40 to-slate-100 p-4 sm:p-6 border border-slate-200/60 shadow-xl overflow-hidden">
                {/* Background Solar & Energy Graphic */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Product Montage Lineup */}
                <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-3 items-end">
                  {/* Item 1: APC / Vertiv UPS Rack Tower */}
                  <div className="bg-slate-900 text-white rounded-xl p-3 shadow-lg border border-slate-700 flex flex-col justify-between h-44 sm:h-52 transform hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-center text-[8px] text-emerald-400 font-mono">
                      <span>APC 3kVA</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </div>
                    <div className="space-y-1.5 my-auto">
                      <div className="h-1 bg-slate-800 rounded"></div>
                      <div className="h-1 bg-slate-800 rounded"></div>
                      <div className="h-1 bg-slate-800 rounded"></div>
                      <div className="h-1 bg-slate-800 rounded"></div>
                    </div>
                    <div className="text-center font-bold text-[9px] text-slate-300">
                      ONLINE UPS
                    </div>
                  </div>

                  {/* Item 2: Batteries Stack (Exide + Amaron) */}
                  <div className="space-y-2">
                    {/* Exide Tubular */}
                    <div className="bg-white rounded-xl p-2.5 shadow-md border-2 border-red-600 text-center transform hover:-translate-y-1 transition-transform">
                      <div className="text-[8px] font-black text-red-600 uppercase font-mono">EXIDE</div>
                      <div className="text-[7px] font-bold text-slate-700">INVA TUBULAR</div>
                    </div>
                    {/* Amaron Battery */}
                    <div className="bg-emerald-800 text-white rounded-xl p-2.5 shadow-md border border-emerald-600 text-center transform hover:-translate-y-1 transition-transform">
                      <div className="text-[8px] font-black uppercase">AMARON</div>
                      <div className="text-[7px] font-semibold text-emerald-200">200Ah SMF</div>
                    </div>
                  </div>

                  {/* Item 3: Vertiv Tower & Luminous Inverter */}
                  <div className="space-y-2">
                    <div className="bg-slate-950 text-white rounded-xl p-3 shadow-lg border border-slate-800 flex flex-col justify-between h-28 transform hover:-translate-y-1 transition-transform">
                      <span className="text-[8px] font-bold tracking-widest text-slate-400">VERTIV</span>
                      <span className="text-[7px] text-emerald-400 font-mono">LIEBERT GXT5</span>
                    </div>
                    <div className="bg-blue-800 text-white rounded-xl p-2.5 shadow-md border border-blue-600 text-center transform hover:-translate-y-1 transition-transform">
                      <div className="text-[8px] font-black uppercase tracking-wider">LUMINOUS</div>
                      <div className="text-[7px] text-blue-200">Pure Sine Wave</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Trust Tag on Montage */}
                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-[#0f2b48]">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" /> 100% Genuine Authorized
                  </span>
                  <span className="text-slate-500">Karnataka & Pan-India</span>
                </div>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* FLOATING TRUST BAR */}
          {/* ============================================================ */}
          <div className="mt-12 bg-white rounded-2xl shadow-md border border-slate-200/80 p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {/* 1. Trusted Brands */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f2b48]">Trusted Brands</h4>
                <p className="text-[11px] text-slate-500 font-medium">APC, Vertiv, Exide & more</p>
              </div>
            </div>

            {/* 2. Genuine Products */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-6">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f2b48]">Genuine Products</h4>
                <p className="text-[11px] text-slate-500 font-medium">100% Official Warranty</p>
              </div>
            </div>

            {/* 3. Fast Delivery */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-6">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f2b48]">Fast Delivery</h4>
                <p className="text-[11px] text-slate-500 font-medium">Same Day / Pan-India</p>
              </div>
            </div>

            {/* 4. Expert Support */}
            <div className="flex items-center gap-3.5 pt-2 md:pt-0 md:pl-6">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0f2b48]">Expert Support</h4>
                <p className="text-[11px] text-slate-500 font-medium">Dedicated Engineering</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SHOP BY CATEGORY */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              SHOP BY CATEGORY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
              Power Solutions for Every Need
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Explore our wide range of products designed for homes, businesses and industries.
            </p>
          </div>

          <Link
            to="/categories"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] border border-slate-300 hover:border-[#16a34a] px-4 py-2 rounded-full transition-colors self-start md:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8 Category Cards Grid (4x2 on large screen, 2x4 on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-gradient-to-b from-sky-50/60 to-white rounded-2xl border border-sky-100/80 hover:border-emerald-300 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 text-center"
            >
              {/* Product Category Illustration */}
              <div className="w-full aspect-4/3 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform duration-300">
                <ProductImage categorySlug={cat.slug} className="w-full h-full" />
              </div>

              {/* Title and View link */}
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors">
                  {cat.name}
                </h3>
                
                <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] group-hover:underline">
                  <span>View Products</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. AUTHORIZED DEALER OF LEADING BRANDS */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                OUR BRANDS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Authorized Dealer of Leading Brands
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                We deal with trusted and reputed brands to ensure the best quality and performance.
              </p>
            </div>

            <Link
              to="/brands"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] border border-slate-300 hover:border-[#16a34a] px-4 py-2 rounded-full transition-colors self-start md:self-auto"
            >
              <span>View All Brands</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 10 Brand Logo Grid (2 rows of 5 on desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="group bg-white rounded-xl border border-slate-200/90 hover:border-[#16a34a] hover:shadow-md p-4 flex items-center justify-center min-h-[85px] transition-all duration-200"
                title={`View ${brand.name} Products`}
              >
                <BrandLogo brandId={brand.id} className="h-8 md:h-10 group-hover:scale-105 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FEATURED PRODUCTS (BEST SELLERS) */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              FEATURED PRODUCTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
              Best Sellers
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              Top quality products trusted by thousands of customers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Prev/Next arrows for scrollable carousel */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBestSellers('left')}
                className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBestSellers('right')}
                className="p-2 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                aria-label="Next products"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] border border-slate-300 hover:border-[#16a34a] px-4 py-2 rounded-full transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Products Grid / Horizontal Scroll for Mobile */}
        <div 
          ref={bestSellersContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none snap-x"
        >
          {bestSellers.map((prod) => (
            <div key={prod.id} className="snap-start min-w-[240px] sm:min-w-0">
              <ProductCard product={prod} />
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. WHY CHOOSE LIVKAM */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-sky-50/50 to-emerald-50/30 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Header */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b48] tracking-tight">
                Why Choose Livkam?
              </h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                We are committed to providing reliable power solutions with unmatched service and support.
              </p>
            </div>

            {/* 5 Features */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">100% Genuine Products</h3>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Expert Technical Support</h3>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Competitive Pricing</h3>
              </div>

              {/* Feature 4 */}
              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Pan India Delivery</h3>
              </div>

              {/* Feature 5 */}
              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center col-span-2 sm:col-span-1">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Installation & Maintenance</h3>
              </div>
            </div>

          </div>

          {/* Slogan Banner */}
          <div className="mt-8 bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-sm sm:text-base font-bold text-[#0f2b48]">
                Powering Homes, Businesses & Industries across Karnataka and India
              </span>
            </div>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-1 bg-[#16a34a] text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-[#15803d] transition-colors"
            >
              <span>Get Free Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. ABOUT US SECTION */}
      {/* ============================================================ */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Storefront / Facility Visual */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-4/3 relative group">
              {/* Facility Storefront Graphic */}
              <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 p-6 flex flex-col justify-between text-white">
                {/* Storefront Signboard */}
                <div className="bg-[#0f2b48] border-2 border-emerald-500 rounded-xl p-3 flex items-center gap-3 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                    ⚡
                  </div>
                  <div>
                    <span className="text-base font-black tracking-tight text-white block">Livkam</span>
                    <span className="text-[8px] font-bold tracking-widest text-emerald-400 uppercase">POWER TECHNOLOGIES</span>
                  </div>
                </div>

                {/* Showroom Window Display */}
                <div className="grid grid-cols-3 gap-2 my-auto">
                  <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-700 text-center">
                    <span className="text-[9px] font-bold text-slate-300">APC UPS</span>
                  </div>
                  <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-700 text-center">
                    <span className="text-[9px] font-bold text-slate-300">Exide Hub</span>
                  </div>
                  <div className="bg-slate-950/80 rounded-lg p-2 border border-slate-700 text-center">
                    <span className="text-[9px] font-bold text-slate-300">Lithium BMS</span>
                  </div>
                </div>

                {/* Physical Store Badge */}
                <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-700/80 pt-2">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Building2 className="w-3.5 h-3.5" /> Banashankari 2nd Stage, Bengaluru
                  </span>
                  <span className="text-xs font-mono font-bold bg-emerald-500 text-white px-2 py-0.5 rounded">
                    OPEN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Content & Stats */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                ABOUT US
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Livkam Power Technologies
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Livkam Power Technologies is a trusted provider of high-quality power solutions, including UPS, batteries, inverters and more. We are proud to be authorized dealers of leading brands like APC, Delta, Luminous, Microtek, Vertiv, Numeric, Elnova, Exide, Amaron and Quanta. With a strong focus on customer satisfaction, we deliver reliable products and expert service for homes, businesses and industries.
            </p>

            {/* Know More Button */}
            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-3 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div className="space-y-0.5">
                <span className="text-2xl font-black text-[#0f2b48]">500+</span>
                <p className="text-xs font-bold text-slate-700">Products</p>
                <p className="text-[10px] text-slate-400">Ready in stock</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-2xl font-black text-[#0f2b48]">10+</span>
                <p className="text-xs font-bold text-slate-700">Trusted Brands</p>
                <p className="text-[10px] text-slate-400">Multiple Leading Brands</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-2xl font-black text-[#0f2b48]">15+ Yrs</span>
                <p className="text-xs font-bold text-slate-700">Experienced Team</p>
                <p className="text-[10px] text-slate-400">Expert Support</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-2xl font-black text-[#0f2b48]">100%</span>
                <p className="text-xs font-bold text-slate-700">Satisfaction</p>
                <p className="text-[10px] text-slate-400">Our Priority</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. CONTACT & CONSULTATION BANNER */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0f2b48] to-[#163f68] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Need Help Choosing the Right Power Backup?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Talk directly with our power engineering specialists for custom load sizing, site inspection, or bulk enterprise pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+918884988990"
              className="inline-flex items-center gap-2 bg-white text-[#0f2b48] hover:bg-slate-100 px-5 py-3 rounded-full text-xs font-bold transition-all shadow-md"
            >
              <Phone className="w-4 h-4 text-[#16a34a]" />
              <span>Call +91 8884988990</span>
            </a>

            <a
              href="https://wa.me/918884988990?text=Hi%20Livkam%20Power,%20I%20would%20like%20to%20enquire%20about%20power%20solutions"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
