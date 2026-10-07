import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import {
  Zap, ShieldCheck, BatteryCharging, Wifi, Settings, Award, Server, Monitor,
  Building2, Heart, Radio, Camera, ShoppingCart, Clock, TrendingUp, Activity,
  RefreshCw, Filter, GitBranch, Globe, BarChart2, Plug, ArrowRight, Phone,
  Mail, MapPin, ChevronRight, Send, Loader, CheckCircle, XCircle, Star,
  Factory, Play, ChevronDown, ExternalLink
} from 'lucide-react';
import Footer from '../components/Footer';
import Header from '../components/Header';

// ─── Icon resolver ───────────────────────────────────────────
const ICON_MAP = {
  ShieldCheck, Zap, BatteryCharging, Wifi, Settings, Award, Server, Monitor,
  Building2, Heart, Radio, Camera, ShoppingCart, Clock, TrendingUp, Activity,
  RefreshCw, Filter, GitBranch, Globe, BarChart2, Plug, ArrowRight, Phone,
  Mail, MapPin, CheckCircle, Star, Factory, Play
};
function DynIcon({ name, className = 'w-6 h-6' }) {
  const Icon = ICON_MAP[name] || Zap;
  return <Icon className={className} />;
}

// ─── Simple rich-text sanitizer (strips scripts only, keeps formatting) ───
function SafeHTML({ html, className }) {
  const sanitized = html
    ? html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/on\w+="[^"]*"/gi, '')
    : '';
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// ─── Scroll-reveal hook ──────────────────────────────────────
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealSection({ children, className = '', delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Main APC Page Component ─────────────────────────────────
export default function APCPage() {
  const [sections, setSections] = useState([]);
  const [items, setItems] = useState({});  // sectionId → items[]
  const [images, setImages] = useState({}); // sectionId → images[]
  const [meta, setMeta] = useState(null);
  const [formConfig, setFormConfig] = useState([]);
  const [siteSettings, setSiteSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // ── Fetch all data ──────────────────────────────────────────
  useEffect(() => {
    fetchAll();

    // Listen for admin publish events
    const handleSync = () => fetchAll();
    window.addEventListener('livkam_data_updated', handleSync);
    let bc;
    if (typeof BroadcastChannel !== 'undefined') {
      bc = new BroadcastChannel('livkam_sync_channel');
      bc.onmessage = handleSync;
    }
    return () => {
      window.removeEventListener('livkam_data_updated', handleSync);
      try { bc?.close(); } catch (_) {}
    };
  }, []);

  async function fetchAll() {
    try {
      const [sectRes, itemsRes, imgsRes, metaRes, formRes, settRes] = await Promise.all([
        supabase.from('apc_page_sections').select('*').eq('status', 'published').order('sort_order'),
        supabase.from('apc_section_items').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('apc_page_images').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('apc_page_meta').select('*').limit(1).single(),
        supabase.from('apc_enquiry_form_config').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('site_settings').select('key, value'),
      ]);

      const sectsData = (sectRes.data || []).filter(s => s.is_visible);
      setSections(sectsData);

      // Group items by section_id
      const itemsMap = {};
      (itemsRes.data || []).forEach(item => {
        if (!itemsMap[item.section_id]) itemsMap[item.section_id] = [];
        itemsMap[item.section_id].push(item);
      });
      setItems(itemsMap);

      // Group images by section_id
      const imgsMap = {};
      (imgsRes.data || []).forEach(img => {
        if (!imgsMap[img.section_id]) imgsMap[img.section_id] = [];
        imgsMap[img.section_id].push(img);
      });
      setImages(imgsMap);

      if (metaRes.data) setMeta(metaRes.data);

      const sortedForm = (formRes.data || []).sort((a, b) => a.sort_order - b.sort_order);
      setFormConfig(sortedForm);

      const settMap = {};
      (settRes.data || []).forEach(s => { settMap[s.key] = s.value; });
      setSiteSettings(settMap);

    } catch (err) {
      console.error('APC page fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  // ── Form submission ─────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);
    try {
      const payload = {
        customer_name: formData.customer_name || '',
        company_name: formData.company_name || '',
        phone: formData.phone || '',
        email: formData.email || '',
        requirement: formData.requirement || '',
        preferred_contact: formData.preferred_contact || 'phone',
        message: formData.message || '',
        source: 'apc_page',
        status: 'new',
      };
      const { error } = await supabase.from('apc_enquiries').insert([payload]);
      if (error) throw error;
      setSubmitStatus('success');
      setFormData({});
    } catch (err) {
      console.error('Form submit error:', err);
      setSubmitStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Section getters ─────────────────────────────────────────
  const getSection = (type) => sections.find(s => s.section_type === type);
  const getSectionItems = (sectionId) => items[sectionId] || [];
  const getSectionImages = (sectionId) => images[sectionId] || [];

  // ── SEO title ───────────────────────────────────────────────
  useEffect(() => {
    if (meta?.seo_title) document.title = meta.seo_title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && meta?.seo_description) desc.setAttribute('content', meta.seo_description);
  }, [meta]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1f35]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm font-medium">Loading APC Solutions...</p>
        </div>
      </div>
    );
  }

  const hero = getSection('hero');
  const heroButtons = hero?.cta_buttons ? (typeof hero.cta_buttons === 'string' ? JSON.parse(hero.cta_buttons) : hero.cta_buttons) : [];
  const contentSections = sections.filter(s => s.section_type === 'content' || s.section_type === 'custom');
  const whyApc = getSection('why_apc');
  const solutions = getSection('solutions');
  const applications = getSection('applications');
  const benefits = getSection('benefits');
  const technical = getSection('technical');
  const howItWorks = getSection('how_it_works');
  const gallery = getSection('gallery');
  const cta = getSection('cta');
  const contact = getSection('contact');
  const enquiryForm = getSection('enquiry_form');
  const map = getSection('map');
  const ctaButtons = cta?.cta_buttons ? (typeof cta.cta_buttons === 'string' ? JSON.parse(cta.cta_buttons) : cta.cta_buttons) : [];
  const mapSettings = map?.settings ? (typeof map.settings === 'string' ? JSON.parse(map.settings) : map.settings) : {};
  const formSettings = enquiryForm?.settings ? (typeof enquiryForm.settings === 'string' ? JSON.parse(enquiryForm.settings) : enquiryForm.settings) : {};
  const galleryImgs = gallery ? getSectionImages(gallery.id) : [];

  return (
    <div className="bg-white">
      {/* ─── HERO ─────────────────────────────────────────── */}
      {hero && (
        <section
          id="hero"
          className="relative min-h-screen flex items-center overflow-hidden bg-[#0a1f35]"
        >
          {/* Background image */}
          {hero.image_url && (
            <div className="absolute inset-0">
              <img
                src={hero.image_url}
                alt={hero.image_alt || 'APC UPS'}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f35] via-[#0a1f35]/90 to-[#0a1f35]/60" />
            </div>
          )}

          {/* Animated grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(22,163,74,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.05)_1px,transparent_1px)] bg-[size:64px_64px]" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="max-w-3xl">
              {/* Label */}
              {hero.label && (
                <RevealSection>
                  <div className="inline-flex items-center gap-2 bg-[#16a34a]/20 border border-[#16a34a]/40 text-[#4ade80] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6 uppercase">
                    <Zap className="w-3.5 h-3.5" />
                    {hero.label}
                  </div>
                </RevealSection>
              )}

              {/* Main heading */}
              <RevealSection delay={100}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4">
                  {hero.title}
                </h1>
              </RevealSection>

              {/* Subheading */}
              {hero.subtitle && (
                <RevealSection delay={200}>
                  <p className="text-xl sm:text-2xl font-semibold text-[#4ade80] mb-4">
                    {hero.subtitle}
                  </p>
                </RevealSection>
              )}

              {/* Description */}
              {hero.description && (
                <RevealSection delay={300}>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
                    {hero.description}
                  </p>
                </RevealSection>
              )}

              {/* CTA Buttons */}
              {heroButtons.length > 0 && (
                <RevealSection delay={400}>
                  <div className="flex flex-wrap gap-4">
                    {heroButtons.map((btn, i) => (
                      btn.style === 'primary' ? (
                        <a
                          key={i}
                          href={btn.link}
                          className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-900/40 hover:shadow-xl hover:shadow-green-900/50 hover:-translate-y-0.5"
                        >
                          {btn.text}
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      ) : (
                        <a
                          key={i}
                          href={btn.link}
                          className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
                        >
                          {btn.text}
                        </a>
                      )
                    ))}
                  </div>
                </RevealSection>
              )}

              {/* Stats strip */}
              <RevealSection delay={500}>
                <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
                  {[
                    { value: '40+', label: 'Years Experience' },
                    { value: '500+', label: 'Installations' },
                    { value: '24/7', label: 'Support' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl sm:text-3xl font-black text-[#4ade80]">{stat.value}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
            <ChevronDown className="w-5 h-5" />
          </div>
        </section>
      )}

      {/* ─── CONTENT SECTIONS (About, etc.) ──────────────── */}
      {contentSections.map((sect, idx) => {
        const paragraphs = sect.paragraphs
          ? (typeof sect.paragraphs === 'string' ? JSON.parse(sect.paragraphs) : sect.paragraphs)
          : [];
        const isReversed = sect.image_position === 'left';
        return (
          <section key={sect.id} className={`py-20 lg:py-28 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col lg:flex-row items-center gap-12 xl:gap-16 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                {/* Text */}
                <div className="flex-1">
                  <RevealSection>
                    {sect.label && (
                      <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                        <span className="w-8 h-0.5 bg-[#16a34a]" />
                        {sect.label}
                      </div>
                    )}
                    <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f35] mb-6 leading-tight">
                      {sect.title}
                    </h2>
                    {sect.content ? (
                      <SafeHTML html={sect.content} className="text-slate-600 leading-relaxed space-y-4 prose prose-slate max-w-none" />
                    ) : (
                      <div className="space-y-4">
                        {paragraphs.map((p, pi) => (
                          <p key={pi} className="text-slate-600 leading-relaxed">{p}</p>
                        ))}
                      </div>
                    )}
                  </RevealSection>
                </div>

                {/* Image */}
                {sect.image_url && (
                  <div className="flex-1 w-full">
                    <RevealSection delay={200}>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200">
                        <img
                          src={sect.image_url}
                          alt={sect.image_alt || sect.title}
                          className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                          loading="lazy"
                        />
                        {sect.image_caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white text-xs font-medium">{sect.image_caption}</p>
                          </div>
                        )}
                        {/* APC badge */}
                        <div className="absolute top-4 right-4 bg-[#e11d48] text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg">
                          APC by<br/>Schneider Electric
                        </div>
                      </div>
                    </RevealSection>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── WHY APC ──────────────────────────────────────── */}
      {whyApc && (
        <section id="why-apc" className="py-20 lg:py-28 bg-[#0a1f35] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(22,163,74,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(22,163,74,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection>
              <div className="text-center mb-14">
                {whyApc.label && (
                  <div className="inline-flex items-center gap-2 text-[#4ade80] text-xs font-black tracking-widest uppercase mb-4">
                    <span className="w-6 h-0.5 bg-[#4ade80]" />
                    {whyApc.label}
                    <span className="w-6 h-0.5 bg-[#4ade80]" />
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{whyApc.title}</h2>
                {whyApc.description && <p className="text-slate-400 max-w-2xl mx-auto text-base">{whyApc.description}</p>}
              </div>
            </RevealSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {getSectionItems(whyApc.id).map((item, i) => (
                <RevealSection key={item.id} delay={i * 80}>
                  <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#16a34a]/50 rounded-2xl p-6 transition-all hover:-translate-y-1">
                    {item.item_number && (
                      <div className="text-5xl font-black text-[#16a34a]/20 group-hover:text-[#16a34a]/30 leading-none mb-3 transition-colors">
                        {item.item_number}
                      </div>
                    )}
                    <div className="w-10 h-10 bg-[#16a34a]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#16a34a]/30 transition-colors">
                      <DynIcon name={item.icon} className="w-5 h-5 text-[#4ade80]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── APC SOLUTIONS ────────────────────────────────── */}
      {solutions && (
        <section id="solutions" className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection>
              <div className="text-center mb-14">
                {solutions.label && (
                  <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                    {solutions.label}
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f35] mb-4">{solutions.title}</h2>
                {solutions.description && <p className="text-slate-500 max-w-2xl mx-auto">{solutions.description}</p>}
              </div>
            </RevealSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
              {getSectionItems(solutions.id).map((item, i) => (
                <RevealSection key={item.id} delay={i * 100}>
                  <div className="group bg-slate-50 hover:bg-white border border-slate-100 hover:border-[#16a34a]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
                    {item.image_url && (
                      <div className="h-48 overflow-hidden bg-slate-100">
                        <img
                          src={item.image_url}
                          alt={item.image_alt || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-black text-[#0a1f35]">{item.title}</h3>
                        <div className="w-8 h-8 bg-[#e11d48] rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3">{item.description}</p>
                      {item.application && (
                        <div className="flex items-center gap-2 text-xs text-[#16a34a] font-semibold mb-4">
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{item.application}</span>
                        </div>
                      )}
                      {item.link_url && (
                        <Link
                          to={item.link_url}
                          className="inline-flex items-center gap-1.5 text-[#16a34a] hover:text-[#15803d] font-bold text-sm transition-colors"
                        >
                          {item.link_text || 'Enquire Now'}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── APPLICATIONS ─────────────────────────────────── */}
      {applications && (
        <section className="py-20 lg:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection>
              <div className="text-center mb-14">
                {applications.label && (
                  <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                    {applications.label}
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f35] mb-4">{applications.title}</h2>
                {applications.description && <p className="text-slate-500 max-w-2xl mx-auto">{applications.description}</p>}
              </div>
            </RevealSection>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {getSectionItems(applications.id).map((item, i) => (
                <RevealSection key={item.id} delay={i * 60}>
                  <div className="group bg-white hover:bg-[#0a1f35] border border-slate-100 hover:border-[#0a1f35] rounded-2xl p-5 text-center transition-all hover:-translate-y-1 cursor-default shadow-sm hover:shadow-xl">
                    <div className="w-12 h-12 bg-slate-100 group-hover:bg-[#16a34a]/20 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors">
                      <DynIcon name={item.icon} className="w-6 h-6 text-[#16a34a] group-hover:text-[#4ade80]" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-white mb-1.5 transition-colors leading-snug">{item.title}</h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 group-hover:text-slate-300 leading-relaxed transition-colors line-clamp-3">{item.description}</p>
                    )}
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BENEFITS ─────────────────────────────────────── */}
      {benefits && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12 xl:gap-16 items-start">
              <div className="lg:w-1/3">
                <RevealSection>
                  {benefits.label && (
                    <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                      <span className="w-6 h-0.5 bg-[#16a34a]" />
                      {benefits.label}
                    </div>
                  )}
                  <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f35] mb-4 leading-tight">{benefits.title}</h2>
                  {benefits.description && <p className="text-slate-500 leading-relaxed">{benefits.description}</p>}
                </RevealSection>
              </div>

              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-5">
                {getSectionItems(benefits.id).map((item, i) => (
                  <RevealSection key={item.id} delay={i * 80}>
                    <div className="flex gap-4 p-5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all group">
                      <div className="w-10 h-10 bg-[#16a34a]/10 group-hover:bg-[#16a34a]/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors">
                        <DynIcon name={item.icon} className="w-5 h-5 text-[#16a34a]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#0a1f35] mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </RevealSection>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── TECHNICAL INFO ───────────────────────────────── */}
      {technical && (
        <section className="py-20 lg:py-28 bg-[#0a1f35] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#16a34a]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#e11d48]/5 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection>
              <div className="text-center mb-14">
                {technical.label && (
                  <div className="inline-flex items-center gap-2 text-[#4ade80] text-xs font-black tracking-widest uppercase mb-4">
                    <span className="w-6 h-0.5 bg-[#4ade80]" />
                    {technical.label}
                    <span className="w-6 h-0.5 bg-[#4ade80]" />
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">{technical.title}</h2>
                {technical.description && <p className="text-slate-400 max-w-2xl mx-auto">{technical.description}</p>}
              </div>
            </RevealSection>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {getSectionItems(technical.id).map((item, i) => (
                <RevealSection key={item.id} delay={i * 60}>
                  <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#16a34a]/40 rounded-2xl p-5 transition-all group">
                    <div className="w-10 h-10 bg-[#16a34a]/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#16a34a]/30 transition-colors">
                      <DynIcon name={item.icon} className="w-5 h-5 text-[#4ade80]" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      {howItWorks && (
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection>
              <div className="text-center mb-14">
                {howItWorks.label && (
                  <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                    {howItWorks.label}
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f35] mb-4">{howItWorks.title}</h2>
                {howItWorks.description && <p className="text-slate-500 max-w-2xl mx-auto">{howItWorks.description}</p>}
              </div>
            </RevealSection>

            {/* Desktop flow */}
            <div className="hidden md:flex items-start gap-0">
              {getSectionItems(howItWorks.id).map((step, i, arr) => (
                <React.Fragment key={step.id}>
                  <RevealSection delay={i * 100}>
                    <div className="flex-1 flex flex-col items-center text-center px-3">
                      <div className="w-14 h-14 bg-[#0a1f35] rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-slate-200">
                        <DynIcon name={step.icon} className="w-7 h-7 text-[#4ade80]" />
                      </div>
                      <div className="w-6 h-6 bg-[#16a34a] rounded-full flex items-center justify-center text-white text-[10px] font-black mb-3">
                        {step.item_number || i + 1}
                      </div>
                      <h3 className="font-bold text-[#0a1f35] text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                    </div>
                  </RevealSection>
                  {i < arr.length - 1 && (
                    <div className="flex items-center mt-7 px-1 flex-shrink-0">
                      <ChevronRight className="w-5 h-5 text-[#16a34a]" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Mobile flow */}
            <div className="md:hidden space-y-4">
              {getSectionItems(howItWorks.id).map((step, i, arr) => (
                <RevealSection key={step.id} delay={i * 80}>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-[#0a1f35] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <DynIcon name={step.icon} className="w-6 h-6 text-[#4ade80]" />
                      </div>
                      {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 my-2" />}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 bg-[#16a34a] rounded-full text-white text-[10px] font-black flex items-center justify-center">
                          {step.item_number || i + 1}
                        </span>
                        <h3 className="font-bold text-[#0a1f35] text-sm">{step.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY ──────────────────────────────────────── */}
      {gallery && galleryImgs.length > 0 && (
        <section className="py-20 lg:py-28 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RevealSection>
              <div className="text-center mb-10">
                {gallery.label && (
                  <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                    {gallery.label}
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                  </div>
                )}
                <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f35] mb-4">{gallery.title}</h2>
                {gallery.description && <p className="text-slate-500 max-w-2xl mx-auto">{gallery.description}</p>}
              </div>
            </RevealSection>

            {/* Main image */}
            <RevealSection>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-slate-200 mb-4 h-[340px] sm:h-[480px] lg:h-[560px]">
                <img
                  src={galleryImgs[galleryIndex]?.image_url}
                  alt={galleryImgs[galleryIndex]?.alt_text || 'APC UPS'}
                  className="w-full h-full object-cover transition-all duration-500"
                  loading="lazy"
                />
                {galleryImgs[galleryIndex]?.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
                    <p className="text-white text-sm font-medium">{galleryImgs[galleryIndex].caption}</p>
                  </div>
                )}
              </div>
            </RevealSection>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {galleryImgs.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setGalleryIndex(i)}
                  className={`relative rounded-xl overflow-hidden h-20 sm:h-28 transition-all ${
                    i === galleryIndex ? 'ring-2 ring-[#16a34a] shadow-lg' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.image_url} alt={img.alt_text || ''} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ───────────────────────────────────── */}
      {cta && (
        <section className="py-20 lg:py-28 relative overflow-hidden bg-[#0a1f35]">
          {cta.image_url && (
            <div className="absolute inset-0">
              <img src={cta.image_url} alt="" className="w-full h-full object-cover opacity-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f35] via-[#0a1f35]/95 to-[#0a1f35]/80" />
            </div>
          )}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <RevealSection>
              {cta.label && (
                <div className="inline-flex items-center gap-2 text-[#4ade80] text-xs font-black tracking-widest uppercase mb-6">
                  <span className="w-6 h-0.5 bg-[#4ade80]" />
                  {cta.label}
                  <span className="w-6 h-0.5 bg-[#4ade80]" />
                </div>
              )}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">{cta.title}</h2>
              {cta.description && <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">{cta.description}</p>}
              <div className="flex flex-wrap gap-4 justify-center">
                {ctaButtons.map((btn, i) =>
                  btn.style === 'primary' ? (
                    <a key={i} href={btn.link}
                      className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                      {btn.text} <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : btn.style === 'whatsapp' ? (
                    <a key={i} href={btn.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ea355] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5">
                      {btn.text}
                    </a>
                  ) : (
                    <a key={i} href={btn.link}
                      className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white hover:bg-white/10 px-7 py-3.5 rounded-xl font-bold text-sm transition-all">
                      {btn.text}
                    </a>
                  )
                )}
              </div>
            </RevealSection>
          </div>
        </section>
      )}

      {/* ─── CONTACT INFO + ENQUIRY FORM ─────────────────── */}
      {(contact || enquiryForm) && (
        <section id="enquiry" className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
              {/* Contact info */}
              {contact && (
                <RevealSection>
                  <div>
                    {contact.label && (
                      <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                        <span className="w-6 h-0.5 bg-[#16a34a]" />
                        {contact.label}
                      </div>
                    )}
                    <h2 className="text-3xl font-black text-[#0a1f35] mb-8">{contact.title}</h2>

                    <div className="space-y-6">
                      {/* Business Name */}
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-[#16a34a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5 text-[#16a34a]" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Business</div>
                          <div className="font-bold text-[#0a1f35]">{siteSettings.business_name || 'Livkam Power Technologies'}</div>
                          {siteSettings.tagline && <div className="text-sm text-slate-500">{siteSettings.tagline}</div>}
                        </div>
                      </div>

                      {/* Address */}
                      {siteSettings.address && (
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-[#16a34a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-[#16a34a]" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Address</div>
                            <div className="text-slate-700 leading-relaxed">{siteSettings.address}</div>
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {(siteSettings.phone1 || siteSettings.phone2) && (
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-[#16a34a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-[#16a34a]" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Phone</div>
                            {siteSettings.phone1 && (
                              <a href={`tel:${siteSettings.phone1}`} className="block font-bold text-[#0a1f35] hover:text-[#16a34a] transition-colors">
                                +91 {siteSettings.phone1}
                              </a>
                            )}
                            {siteSettings.phone2 && (
                              <a href={`tel:${siteSettings.phone2}`} className="block text-slate-600 hover:text-[#16a34a] transition-colors">
                                +91 {siteSettings.phone2}
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {siteSettings.email && (
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-[#16a34a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-[#16a34a]" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Email</div>
                            <a href={`mailto:${siteSettings.email}`} className="font-bold text-[#0a1f35] hover:text-[#16a34a] transition-colors">
                              {siteSettings.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Business Hours */}
                      {siteSettings.business_hours && (
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-[#16a34a]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-[#16a34a]" />
                          </div>
                          <div>
                            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Business Hours</div>
                            <div className="font-bold text-[#0a1f35]">{siteSettings.business_hours}</div>
                          </div>
                        </div>
                      )}

                      {/* WhatsApp */}
                      {siteSettings.whatsapp && (
                        <a
                          href={`https://wa.me/91${siteSettings.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 bg-[#25D366] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#1ea355] transition-all shadow-md hover:shadow-lg w-fit"
                        >
                          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                          WhatsApp Us
                        </a>
                      )}
                    </div>
                  </div>
                </RevealSection>
              )}

              {/* Enquiry Form */}
              {enquiryForm && (
                <RevealSection delay={200}>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-8">
                    {enquiryForm.label && (
                      <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-4">
                        <span className="w-6 h-0.5 bg-[#16a34a]" />
                        {enquiryForm.label}
                      </div>
                    )}
                    <h2 className="text-2xl font-black text-[#0a1f35] mb-2">{enquiryForm.title}</h2>
                    {enquiryForm.description && (
                      <p className="text-slate-500 text-sm mb-6">{enquiryForm.description}</p>
                    )}

                    {submitStatus === 'success' ? (
                      <div className="flex flex-col items-center text-center py-10">
                        <div className="w-16 h-16 bg-[#16a34a]/10 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle className="w-8 h-8 text-[#16a34a]" />
                        </div>
                        <h3 className="text-xl font-black text-[#0a1f35] mb-2">Enquiry Submitted!</h3>
                        <p className="text-slate-500 text-sm mb-5">Thank you for your enquiry. Our team will contact you shortly.</p>
                        <button
                          onClick={() => setSubmitStatus(null)}
                          className="text-[#16a34a] font-bold text-sm hover:underline"
                        >Submit Another Enquiry</button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {formConfig.map(field => (
                          <div key={field.field_key}>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              {field.field_label}
                              {field.is_required && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {field.field_type === 'textarea' ? (
                              <textarea
                                id={`apc-form-${field.field_key}`}
                                rows={4}
                                required={field.is_required}
                                placeholder={field.placeholder}
                                value={formData[field.field_key] || ''}
                                onChange={e => setFormData(prev => ({ ...prev, [field.field_key]: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all bg-white resize-none"
                              />
                            ) : field.field_type === 'select' ? (
                              <select
                                id={`apc-form-${field.field_key}`}
                                required={field.is_required}
                                value={formData[field.field_key] || ''}
                                onChange={e => setFormData(prev => ({ ...prev, [field.field_key]: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all bg-white"
                              >
                                <option value="">Select...</option>
                                {(typeof field.options === 'string' ? JSON.parse(field.options) : field.options || []).map(opt => (
                                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                id={`apc-form-${field.field_key}`}
                                type={field.field_type}
                                required={field.is_required}
                                placeholder={field.placeholder}
                                value={formData[field.field_key] || ''}
                                onChange={e => setFormData(prev => ({ ...prev, [field.field_key]: e.target.value }))}
                                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:ring-2 focus:ring-[#16a34a]/20 text-sm transition-all bg-white"
                              />
                            )}
                          </div>
                        ))}

                        {submitStatus === 'error' && (
                          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                            <XCircle className="w-4 h-4 flex-shrink-0" />
                            Failed to submit. Please try again or call us directly.
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg"
                        >
                          {submitting ? (
                            <><Loader className="w-4 h-4 animate-spin" /> Submitting...</>
                          ) : (
                            <><Send className="w-4 h-4" /> {formSettings.submit_button_text || 'Submit Enquiry'}</>
                          )}
                        </button>
                      </form>
                    )}
                  </div>
                </RevealSection>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── MAP ──────────────────────────────────────────── */}
      {map && (
        <section className="bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <RevealSection>
              <div className="text-center mb-8">
                {map.label && (
                  <div className="inline-flex items-center gap-2 text-[#16a34a] text-xs font-black tracking-widest uppercase mb-3">
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                    {map.label}
                    <span className="w-6 h-0.5 bg-[#16a34a]" />
                  </div>
                )}
                <h2 className="text-2xl font-black text-[#0a1f35] mb-2">{map.title}</h2>
                {map.description && <p className="text-slate-500 text-sm max-w-lg mx-auto">{map.description}</p>}
              </div>
            </RevealSection>
          </div>
          {mapSettings.map_embed_url && (
            <div className="w-full h-80 sm:h-96">
              <iframe
                src={mapSettings.map_embed_url}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Livkam Power Technologies Location"
              />
            </div>
          )}
          {mapSettings.address && (
            <div className="bg-[#0a1f35] py-4 px-4 text-center">
              <p className="text-slate-300 text-sm flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                {mapSettings.address}
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
