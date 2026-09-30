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
  FileCheck,
  Server,
  Activity,
  Factory,
  Home as HomeIcon,
  CheckCircle,
  HelpCircle,
  Flame,
  BadgePercent
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
import heroSlide2Img from '../assets/hero-slide-2.png';
import heroSlide3Img from '../assets/hero-slide-3.png';
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
      { threshold: 0.15 }
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
    <div ref={elementRef} className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2b48] tracking-tight">
        {count}{suffix}
      </div>
      <div className="text-xs sm:text-sm font-bold text-slate-800 mt-2">{label}</div>
      <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{sublabel}</div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const bestSellersContainerRef = useRef(null);

  // Hero Section Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  useEffect(() => {
    if (isHeroHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHeroHovered]);

  const nextHeroSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3);
  };

  const prevHeroSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3);
  };

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
      {/* 1. HERO SECTION: ANIMATED AUTO-SCROLLING CAROUSEL (3 SLIDES) */}
      {/* ============================================================ */}
      <section 
        className="relative w-full overflow-hidden bg-slate-900 border-b border-slate-200/60"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        {/* Slides Track */}
        <div 
          className="flex w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* SLIDE 1: CURRENT HERO SECTION (Original Picture & Layout) */}
          <div className="w-full flex-shrink-0 relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] flex items-center">
            {/* Desktop Background */}
            <div 
              className="hidden lg:block absolute inset-0 bg-no-repeat bg-cover bg-right xl:bg-center"
              style={{ backgroundImage: `url(${heroDesktopImg})` }}
            />
            {/* Mobile Background */}
            <div 
              className="block lg:hidden absolute inset-0 bg-no-repeat bg-cover bg-top"
              style={{ backgroundImage: `url(${heroMobileImg})` }}
            />
            
            {/* Slide 1 Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-12 lg:py-16">
              <div className="max-w-xl space-y-5 lg:space-y-6 pt-2 text-center lg:text-left mx-auto lg:mx-0">
                {/* Pill Badge */}
                <div className="inline-flex items-center gap-2 bg-[#16a34a] text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm">
                  <span>Reliable Power Solutions</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl xl:text-[54px] font-black text-[#0f2b48] tracking-tight leading-[1.12] drop-shadow-xs">
                  Uninterrupted Power <br />
                  for a <span className="text-[#16a34a]">Better Tomorrow</span>
                </h1>

                {/* Supporting Text */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-700 font-semibold max-w-lg leading-relaxed drop-shadow-xs">
                  Premium UPS, Batteries, Inverters & Power Solutions from World's Leading Brands.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 bg-white/95 hover:bg-white text-[#16a34a] border-2 border-[#16a34a] px-7 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 2: IMAGE COPY 27 (Powering Your Business with Confidence) */}
          <div className="w-full flex-shrink-0 relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] bg-white flex items-center justify-center overflow-hidden">
            <Link to="/services/ups-installation" className="block w-full h-full relative cursor-pointer">
              <img 
                src={heroSlide2Img} 
                alt="Powering Your Business with Confidence - Professional UPS and Battery Installation" 
                className="w-full h-full object-cover object-[10%_center] lg:object-center"
              />
            </Link>
            
            {/* Clickable Hotspot Zones matching the baked-in buttons */}
            <Link
              to="/services/ups-installation"
              title="Get Installation Support"
              className="hidden lg:block absolute z-20 cursor-pointer rounded-full"
              style={{ left: '4.5%', bottom: '18%', width: '17%', height: '9%' }}
            />
            <Link
              to="/contact"
              title="Contact Our Experts"
              className="hidden lg:block absolute z-20 cursor-pointer rounded-full"
              style={{ left: '22.5%', bottom: '18%', width: '13%', height: '9%' }}
            />
          </div>

          {/* SLIDE 3: IMAGE COPY 28 (Reliable UPS Services for Uninterrupted Operations) */}
          <div className="w-full flex-shrink-0 relative min-h-[440px] sm:min-h-[500px] lg:min-h-[560px] xl:min-h-[600px] bg-white flex items-center justify-center overflow-hidden">
            <Link to="/services" className="block w-full h-full relative cursor-pointer">
              <img 
                src={heroSlide3Img} 
                alt="Reliable UPS Services for Uninterrupted Operations" 
                className="w-full h-full object-cover object-[10%_center] lg:object-center"
              />
            </Link>

            {/* Clickable Hotspot Zones matching the baked-in buttons */}
            <Link
              to="/services"
              title="Get Service Support"
              className="hidden lg:block absolute z-20 cursor-pointer rounded-full"
              style={{ left: '4.5%', bottom: '18%', width: '16%', height: '9%' }}
            />
            <Link
              to="/about"
              title="Learn More"
              className="hidden lg:block absolute z-20 cursor-pointer rounded-full"
              style={{ left: '21.5%', bottom: '18%', width: '10.5%', height: '9%' }}
            />
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#0f2b48] hover:text-[#16a34a] shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 border border-slate-200/80 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        <button
          onClick={nextHeroSlide}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#0f2b48] hover:text-[#16a34a] shadow-lg backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 border border-slate-200/80 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        {/* Carousel Indicators / Dots */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                currentSlide === idx 
                  ? 'w-7 sm:w-8 h-2.5 bg-[#16a34a]' 
                  : 'w-2.5 h-2.5 bg-white/70 hover:bg-white'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Floating Trust Bar Across Bottom */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-5 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:divide-x lg:divide-slate-200/80">
          {/* 1. Trusted Brands */}
          <div className="flex items-center gap-3.5 pl-1 sm:pl-2">
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b48]">Trusted Brands</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">APC, Vertiv, Exide & more</p>
            </div>
          </div>

          {/* 2. Genuine Products */}
          <div className="flex items-center gap-3.5 pl-1 sm:pl-6">
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <CheckCircle2 className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b48]">Genuine Products</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">100% Official Warranty</p>
            </div>
          </div>

          {/* 3. Fast Delivery */}
          <div className="flex items-center gap-3.5 pl-1 sm:pl-6">
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Truck className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b48]">Fast Delivery</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Same Day / Pan-India</p>
            </div>
          </div>

          {/* 4. Expert Support */}
          <div className="flex items-center gap-3.5 pl-1 sm:pl-6">
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Headphones className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0f2b48]">Expert Support</h4>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Dedicated Engineering</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. IMAGE COPY 7: SHOP BY CATEGORY (STUDIO IMAGES) */}
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
              Explore our comprehensive range of high-efficiency products tailored for residential, commercial, and heavy-duty industrial backup.
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

        {/* 8 Category Cards Grid with Studio Product Photos */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group bg-gradient-to-b from-sky-50/60 to-white rounded-2xl border border-sky-100/80 hover:border-emerald-400 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-xl transition-all duration-300 text-center"
            >
              {/* Product Category Studio Photo */}
              <div className="w-full aspect-4/3 flex items-center justify-center p-2 mb-3 bg-white rounded-xl shadow-2xs group-hover:scale-105 transition-transform duration-300">
                <ProductImage categorySlug={cat.slug} className="w-full h-full" />
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors line-clamp-1">
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
      {/* 3. BUSINESS PARTNER OF LEADING BRANDS */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                OUR BRANDS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Business Partner of Leading Brands
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                We deal directly with globally recognized manufacturers to ensure 100% genuine products with manufacturer warranty.
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
                className="group bg-white rounded-xl border border-slate-200/90 hover:border-[#16a34a] hover:shadow-lg p-5 flex items-center justify-center min-h-[110px] transition-all duration-200"
                title={`View ${brand.name} Products`}
              >
                <BrandLogo brandId={brand.id} className="h-12 md:h-16 w-full group-hover:scale-105 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. IMAGE COPY 8: FEATURED PRODUCTS / BEST SELLERS */}
      {/* ============================================================ */}
      <section className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              FEATURED PRODUCTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
              Best Sellers & Top Performers
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
              High-reliability backup systems trusted by hospitals, IT server rooms, factories, and residences across South India.
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

        {/* Scrollable Products Carousel */}
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
      {/* 5. IMAGE COPY 11: EXPANDED CONTENT DEPTH (4-5 SCROLL EXPERIENCES) */}
      {/* ============================================================ */}
      
      {/* SCROLL SUB-SECTION A: POWER ECOSYSTEM & SOLUTIONS SPECTRUM */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
              ENGINEERED POWER ARCHITECTURE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
              Comprehensive Power Solutions for Every Scale
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 font-medium">
              From zero-millisecond enterprise server switchovers to ultra-long runtime solar inverter storage, Livkam delivers engineered continuity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Mission-Critical Online UPS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-bold">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f2b48] mb-2">Double-Conversion Online UPS</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                0ms transfer time, pure sine wave output, and unity power factor for data centers, medical ICU machinery, and high-frequency CNC setups.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> 1kVA to 500kVA 3-Phase Systems</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> APC, Vertiv & Delta Authorized</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Hot-Swappable Battery Modules</li>
              </ul>
            </div>

            {/* Box 2: High-Density Battery Storage */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16a34a] flex items-center justify-center mb-4 font-bold">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f2b48] mb-2">Industrial & Lithium Storage</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Factory-fresh SMF VRLA, deep-cycle tall tubular, and next-gen LiFePO4 rack batteries engineered for thousands of recharge cycles.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Exide, Amaron & Quanta Authorized</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Smart BMS & Fast 2-Hour Charging</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> 36 to 60 Months On-Site Warranty</li>
              </ul>
            </div>

            {/* Box 3: Smart Hybrid & Voltage Regulation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 font-bold">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0f2b48] mb-2">Smart Inverters & Stabilizers</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Microcontroller-driven voltage regulators and pure sine wave hybrid inverters protecting against brownouts and heavy voltage surges.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Luminous & Microtek Official Hub</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> High Inrush Handling for Motors</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Digital Real-time Voltage Displays</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL SUB-SECTION B: WHY CUSTOMERS CHOOSE LIVKAM (6 PILLARS) */}
      <section className="py-12 md:py-16 bg-white border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                THE LIVKAM ADVANTAGE
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Why Thousands Choose Livkam Power
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                Backed by 15+ years of engineering rigor, business partner relationships, and an unwavering commitment to zero downtime.
              </p>
            </div>
          </div>

          {/* 6 Value Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-[#16a34a] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#16a34a] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f2b48]">100% Genuine Direct Supply</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Direct brand sourcing with genuine holograms, sealed packaging, and full manufacturer warranty registration across India.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-[#16a34a] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#16a34a] flex items-center justify-center mb-3">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f2b48]">Expert Certified Engineering</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dedicated power engineers conduct proper electrical load auditing, harmonic distortion checks, and cable sizing before installation.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-[#16a34a] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#16a34a] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f2b48]">4-Hour Rapid Bangalore Response</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Emergency mobile breakdown squads on standby across Bengaluru for prompt troubleshooting, battery swaps, and repair.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-[#16a34a] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#16a34a] flex items-center justify-center mb-3">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f2b48]">Pan-India Logistics & Delivery</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Secure palletized freight dispatch for heavy industrial UPS and battery banks across Karnataka, South India, and nationwide.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-[#16a34a] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#16a34a] flex items-center justify-center mb-3">
                <Percent className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f2b48]">Transparent Wholesale & Retail Rates</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Direct authorized distributor pricing with GST tax invoices, institutional volume discounts, and attractive old battery scrap rebates.
              </p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 hover:border-[#16a34a] transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-[#16a34a] flex items-center justify-center mb-3">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#0f2b48]">Multi-Brand AMC & Maintenance</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Single-window annual maintenance agreements protecting your entire fleet of UPS, inverters, and battery banks with uptime SLA.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL SUB-SECTION C: INDUSTRIES & APPLICATIONS WE POWER */}
      <section className="py-12 md:py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              MISSION-CRITICAL RELIABILITY
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
              Industries & Sectors Powered by Livkam
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-2 font-medium">
              We engineer dependable continuous power backups where a single second of outage is not an option.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">Healthcare & Hospitals</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Zero-tolerance continuous power for ICU ventilators, dialysis units, MRI machines, and OT lighting.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">IT & Data Centers</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                N+1 parallel redundant 3-phase UPS setups safeguarding cloud server racks and networking hubs.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">Manufacturing & CNC</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Heavy surge protection for CNC cutters, robotic lines, textile machinery, and automation PLCs.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 flex flex-col items-center text-center hover:border-emerald-500 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <HomeIcon className="w-6 h-6" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white">Commercial & Residential</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Silent pure sine wave home inverters, solar backups, and elevator auxiliary power units for apartments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLL SUB-SECTION D: QUALITY COMMITMENT & SLA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-emerald-900 to-[#0f2b48] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              <span>Livkam Quality Guarantee</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Our 100% Zero-Downtime Commitment
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Every unit dispatched undergoes strict quality benchmarking, load bank testing, and comes bundled with official manufacturer warranty and Livkam certified engineer support.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3.5 rounded-full text-xs font-bold transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <span>Consult Our Engineers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="tel:+918884988990"
              className="inline-flex items-center gap-2 bg-white text-[#0f2b48] hover:bg-slate-100 px-7 py-3.5 rounded-full text-xs font-bold transition-all shadow-lg active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#16a34a]" />
              <span>+91 8884988990</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. IMAGE COPY 12: ABOUT US (STORYTELLING + ANIMATED COUNTERS) */}
      {/* ============================================================ */}
      <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Storefront Showcase Graphic (from image copy 10.png) */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-950 transition-transform duration-300 hover:scale-[1.01]">
              <img 
                src={aboutShowcaseImg} 
                alt="Livkam Power Technologies - Banashankari Bengaluru Storefront & Power Hub" 
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Text Content */}
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
              Founded under the visionary leadership of <strong>Venu B N</strong>, Livkam Power Technologies stands as South India's premier multi-brand power backup destination. Operating both a prominent physical retail showroom and a wholesale logistics depot in Banashankari 2nd Stage, Bengaluru, we cater to over 10,000 satisfied residential, corporate, and industrial clients.
            </p>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
              We are official authorized distributors and service partners for world-leading brands including <strong>APC by Schneider Electric, Vertiv Liebert, Delta, Luminous, Microtek, Numeric, Elnova, Exide, Amaron, and Quanta</strong>. Beyond product supply, our in-house certified engineering cadre handles end-to-end electrical sizing, site audits, turnkey installations, and emergency 24/7 AMC support.
            </p>

            <div className="flex flex-wrap gap-2 text-xs font-semibold pt-1">
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Retail + Wholesale</span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">Banashankari 2nd Stage, Bengaluru</span>
              <span className="bg-emerald-50 text-[#16a34a] font-bold px-3 py-1 rounded-lg">GST: 29CYMPN3694M1ZC</span>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3 rounded-full text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                <span>Discover Our Story & Values</span>
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
            sublabel="Ready in Bengaluru Depot" 
            suffix="+" 
          />
          <CounterCard 
            value="10" 
            label="Leading Brands" 
            sublabel="Authorized Direct Hub" 
            suffix="+" 
          />
          <CounterCard 
            value="15" 
            label="Years Engineering" 
            sublabel="Field Service Mastery" 
            suffix="+ Yrs" 
          />
          <CounterCard 
            value="100" 
            label="Genuine Products" 
            sublabel="Official Manufacturer Warranty" 
            suffix="%" 
          />
        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. IMAGE COPY 13: GRAND SERVICES SECTION (PICTORIAL & EXPANDED) */}
      {/* ============================================================ */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white via-sky-50/40 to-slate-100 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Services Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                ENGINEERING & FIELD SERVICES
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0f2b48] tracking-tight">
                Certified On-Site Services & AMC Solutions
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                Complete engineering support from certified technicians: UPS commissioning, emergency breakdown repair, battery bank replacement, and annual maintenance agreements across Karnataka.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0f2b48] hover:text-[#16a34a] border border-slate-300 hover:border-[#16a34a] px-4 py-2 rounded-full transition-colors self-start md:self-auto"
            >
              <span>Explore All Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grand Pictorial Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(0, 4).map((srv) => (
              <div 
                key={srv.id} 
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 hover:border-[#16a34a] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Pictorial Service Photo */}
                <Link to={`/services/${srv.slug}`} className="block relative w-full h-48 sm:h-52 bg-slate-100 overflow-hidden cursor-pointer">
                  <img
                    src={srv.banner || srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <span className="absolute top-3 left-3 bg-[#16a34a] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {srv.badge}
                  </span>
                  <div className="absolute bottom-3 left-3 text-white text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{srv.turnaround}</span>
                  </div>
                </Link>

                {/* Service Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <Link to={`/services/${srv.slug}`}>
                      <h3 className="text-base font-bold text-[#0f2b48] group-hover:text-[#16a34a] transition-colors leading-snug">
                        {srv.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    <Link
                      to={`/services/${srv.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#16a34a] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4-Step Engineering Service Workflow */}
          <div className="mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#16a34a] uppercase tracking-wider block mb-1">
                OUR PROVEN METHODOLOGY
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0f2b48]">
                How We Deliver Seamless Field Services
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-2xl font-black text-emerald-500">01</span>
                <h4 className="text-sm font-bold text-[#0f2b48] mt-2">Load & Site Audit</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Engineers analyze connected wattage, harmonic levels, and wiring infrastructure.
                </p>
              </div>

              <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-2xl font-black text-emerald-500">02</span>
                <h4 className="text-sm font-bold text-[#0f2b48] mt-2">Certified Dispatch</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Trained technicians arrive with diagnostic gear and authentic OEM components.
                </p>
              </div>

              <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-2xl font-black text-emerald-500">03</span>
                <h4 className="text-sm font-bold text-[#0f2b48] mt-2">Precision Commissioning</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Rigorous load bank testing, bypass calibration, and safety compliance handoff.
                </p>
              </div>

              <div className="relative p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-2xl font-black text-emerald-500">04</span>
                <h4 className="text-sm font-bold text-[#0f2b48] mt-2">Continuous AMC Care</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Regular quarterly health checks, thermal scanning, and guaranteed 4-hour SLA.
                </p>
              </div>
            </div>
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
