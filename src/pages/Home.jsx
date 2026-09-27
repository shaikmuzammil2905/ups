import React, { useRef, useState, useEffect } from 'react';
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
  Leaf,
  Shield,
  BatteryCharging,
  FileCheck
} from 'lucide-react';
import { categories } from '../data/categories';
import { brands } from '../data/brands';
import { products } from '../data/products';
import { services } from '../data/services';
import BrandLogo from '../components/BrandLogo';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import heroDesktopImg from '../assets/hero-desktop.png';
import heroMobileImg from '../assets/hero-mobile.png';
import aboutShowcaseImg from '../assets/about-showcase.png';

// Custom Animated Counter Hook
function useCounter(endValue, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = parseFloat(endValue.toString().replace(/[^0-9.]/g, ''));
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Number(start.toFixed(end % 1 === 0 ? 0 : 1)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, endValue, duration]);

  return { count, elementRef };
}

function CounterCard({ value, label, sublabel, suffix = '+' }) {
  const isDecimal = value.toString().includes('.');
  const numValue = isDecimal ? 99.9 : parseInt(value);
  const { count, elementRef } = useCounter(numValue, 1800);

  return (
    <div ref={elementRef} className="bg-white rounded-2xl p-5 border border-slate-200/80 text-center shadow-xs hover:shadow-md transition-shadow">
      <div className="text-3xl sm:text-4xl font-black text-[#0f2b48]">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">{label}</div>
      <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{sublabel}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const bestSellersContainerRef = useRef(null);

  // Best seller products from products data
  const bestSellers = products.slice(0, 10);

  const scrollBestSellers = (direction) => {
    if (bestSellersContainerRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      bestSellersContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] overflow-hidden">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (FULL-BLEED NATURE & POWER BACKGROUND) */}
      {/* ============================================================ */}
      {/* DESKTOP HERO (Hidden on mobile) */}
      <section 
        className="hidden lg:block relative w-full min-h-[580px] xl:min-h-[640px] bg-no-repeat bg-cover bg-right xl:bg-center border-b border-slate-200/60 overflow-hidden"
        style={{ backgroundImage: `url(${heroDesktopImg})` }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full min-h-[580px] xl:min-h-[640px] flex flex-col justify-between py-12">
          {/* Main Hero Content (Left Text Area) */}
          <div className="max-w-xl space-y-6 pt-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-[#16a34a] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
              <span>Reliable Power Solutions</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl xl:text-[54px] font-black text-[#0f2b48] tracking-tight leading-[1.12] drop-shadow-xs">
              Uninterrupted Power <br />
              for a <span className="text-[#16a34a]">Better Tomorrow</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg text-slate-700 font-semibold max-w-lg leading-relaxed drop-shadow-xs">
              Premium UPS, Batteries, Inverters & Power Solutions from World's Leading Brands.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-[#16a34a] border-2 border-[#16a34a] px-8 py-3.5 rounded-full text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Floating Trust Bar Across Bottom */}
          <div className="mt-auto pt-8">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/80 p-5 grid grid-cols-4 gap-6 divide-x divide-slate-200/80">
              {/* 1. Trusted Brands */}
              <div className="flex items-center gap-3.5 pl-2">
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b48]">Trusted Brands</h4>
                  <p className="text-xs text-slate-500 font-medium">APC, Vertiv, Exide & more</p>
                </div>
              </div>

              {/* 2. Genuine Products */}
              <div className="flex items-center gap-3.5 pl-6">
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b48]">Genuine Products</h4>
                  <p className="text-xs text-slate-500 font-medium">100% Official Warranty</p>
                </div>
              </div>

              {/* 3. Fast Delivery */}
              <div className="flex items-center gap-3.5 pl-6">
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b48]">Fast Delivery</h4>
                  <p className="text-xs text-slate-500 font-medium">Same Day / Pan-India</p>
                </div>
              </div>

              {/* 4. Expert Support */}
              <div className="flex items-center gap-3.5 pl-6">
                <div className="w-11 h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0f2b48]">Expert Support</h4>
                  <p className="text-xs text-slate-500 font-medium">Dedicated Engineering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE HERO (Visible only on mobile/tablet screens < 1024px) */}
      <section 
        className="block lg:hidden relative w-full bg-no-repeat bg-cover bg-top pt-8 pb-8 px-4"
        style={{ backgroundImage: `url(${heroMobileImg})` }}
      >
        <div className="max-w-md mx-auto space-y-5 text-center">
          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl font-black text-[#0f2b48] tracking-tight leading-tight drop-shadow-xs">
            Uninterrupted Power <br />
            for a <span className="text-[#16a34a]">Better Tomorrow</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-base text-slate-700 font-semibold leading-relaxed">
            Premium UPS, Batteries, Inverters & Power Solutions from World's Leading Brands.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3 rounded-full text-xs font-bold shadow-md active:scale-95"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-[#16a34a] border-2 border-[#16a34a] px-7 py-3 rounded-full text-xs font-bold shadow-md active:scale-95"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Spacing for background products to shine through */}
          <div className="h-64 sm:h-80 w-full pointer-events-none"></div>

          {/* Mobile Trust Bar Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white p-4 grid grid-cols-2 gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#0f2b48]">Trusted Brands</h4>
                <p className="text-[10px] text-slate-500 font-medium">APC, Vertiv, Exide</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#0f2b48]">Genuine Products</h4>
                <p className="text-[10px] text-slate-500 font-medium">Official Warranty</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#0f2b48]">Fast Delivery</h4>
                <p className="text-[10px] text-slate-500 font-medium">Pan-India Support</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Headphones className="w-5 h-5 text-[#16a34a] flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-[#0f2b48]">Expert Support</h4>
                <p className="text-[10px] text-slate-500 font-medium">Certified Engineers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. SHOP BY CATEGORY */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* 8 Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-gradient-to-b from-sky-50/60 to-white rounded-2xl border border-sky-100/80 hover:border-emerald-300 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 text-center"
            >
              {/* Product Category Illustration */}
              <div className="w-full aspect-4/3 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform duration-300">
                <ProductImage categorySlug={cat.slug} className="w-full h-full" />
              </div>

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

          {/* 10 Brand Logo Grid */}
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
      {/* 4. FEATURED PRODUCTS (BEST SELLERS WITH MULTI-SCROLL) */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                className="p-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs hover:border-[#16a34a]"
                aria-label="Previous products"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollBestSellers('right')}
                className="p-2.5 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors shadow-2xs hover:border-[#16a34a]"
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

        {/* Scrollable Products Carousel (4-5 scrolls) */}
        <div 
          ref={bestSellersContainerRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-none snap-x"
        >
          {bestSellers.map((prod) => (
            <div key={prod.id} className="snap-start min-w-[260px] sm:min-w-[280px] max-w-[280px] flex-shrink-0">
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
                We are committed to providing reliable power solutions with unmatched service and support across Bengaluru & Pan-India.
              </p>
            </div>

            {/* 5 Features */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">100% Genuine Products</h3>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Expert Technical Support</h3>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Percent className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Competitive Pricing</h3>
              </div>

              <div className="bg-white rounded-2xl p-4 text-center shadow-xs border border-slate-100 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-2">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xs font-bold text-[#0f2b48]">Pan India Delivery</h3>
              </div>

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
      {/* 6. ABOUT US SECTION WITH SHOWCASE GRAPHIC & ANIMATED COUNTERS */}
      {/* ============================================================ */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Storefront / Showcase Graphic (from image copy 10.png) */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 transition-transform duration-300 hover:scale-[1.01]">
              <img 
                src={aboutShowcaseImg} 
                alt="Livkam Power Technologies - Banashankari Showroom, APC UPS, Exide Hub, Lithium BMS" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right Text Content & Animated Counting Numbers */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                ABOUT US
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Livkam Power Technologies
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
              Founded under the visionary leadership of <strong>Venu B N</strong>, Livkam Power Technologies is a trusted provider of high-quality power solutions, including UPS, batteries, inverters and more. We are proud to be authorized dealers of leading brands like APC, Delta, Luminous, Microtek, Vertiv, Numeric, Elnova, Exide, Amaron and Quanta. With a strong focus on customer satisfaction, we deliver reliable products and expert service for homes, businesses and industries.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold pt-1">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Retail + Wholesale</span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Banashankari 2nd Stage</span>
              <span className="bg-emerald-50 text-[#16a34a] font-bold px-3 py-1 rounded-lg">GST: 29CYMPN3694M1ZC</span>
            </div>

            <div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                <span>Know More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

        {/* 4 Animated Numbers Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 pt-8 border-t border-slate-200">
          <CounterCard 
            value="500" 
            label="Active Products" 
            sublabel="Ready in Bangalore Depot" 
            suffix="+" 
          />
          <CounterCard 
            value="10" 
            label="Trusted Brands" 
            sublabel="Multiple Leading Brands" 
            suffix="+" 
          />
          <CounterCard 
            value="15" 
            label="Years Experience" 
            sublabel="Expert Support Team" 
            suffix="+ Yrs" 
          />
          <CounterCard 
            value="100" 
            label="Satisfaction" 
            sublabel="Our Highest Priority" 
            suffix="%" 
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. GRAND SERVICES & ENGINEERING SECTION */}
      {/* ============================================================ */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white via-sky-50/40 to-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                ENGINEERING & MAINTENANCE
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Complete Field Services & AMC
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                Certified on-site engineering, 4-hour emergency breakdown response, and annual maintenance agreements across Karnataka.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] border border-slate-300 hover:border-[#16a34a] px-4 py-2 rounded-full transition-colors self-start md:self-auto"
            >
              <span>View All 8 Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grand Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((srv) => (
              <div 
                key={srv.id} 
                className="group bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-[#16a34a] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#16a34a] flex items-center justify-center group-hover:bg-[#16a34a] group-hover:text-white transition-colors shadow-2xs">
                    <Wrench className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      {srv.badge}
                    </span>
                    <h3 className="text-base font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors leading-snug">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>{srv.turnaround}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-black text-[#0f2b48]">{srv.priceStartsAt}</span>
                  <Link
                    to={`/services/${srv.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] group-hover:underline"
                  >
                    <span>Book Visit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. CONTACT & CONSULTATION BANNER */}
      {/* ============================================================ */}
      <section className="bg-gradient-to-r from-[#0f2b48] to-[#163f68] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Need Help Choosing the Right Power Backup?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
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
