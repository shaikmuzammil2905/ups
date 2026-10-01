import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './components/ImageUpload';
import {
  Globe, Shield, Sparkles, Plus, Trash2, Save, Loader,
  Check, AlertTriangle, Layers, Edit2, X
} from 'lucide-react';

const DEFAULT_CONTENT = {
  hero_title: 'Smart Power. Sustainable Future.',
  hero_subtitle: 'Leading industrial UPS systems, solar inverters, and high-performance battery solutions in Bengaluru.',
  emergency_banner_text: '⚡ 24/7 Emergency UPS Breakdown Support & Mobile Battery Delivery in Bengaluru: +91 8884988990',
  emergency_banner_active: true,
  about_summary: 'Livkam Power Technologies is Bangalore\'s trusted partner for high-reliability Online UPS systems, Tubular and SMF batteries, and expert multi-brand AMC power engineering services.',
  years_experience: '15+',
  clients_served: '10,000+',
  seo_title: 'Livkam Power Technologies | Online UPS, Batteries & Inverters Bengaluru',
  seo_description: 'Bangalore\'s leading authorized distributor & service provider for APC, Luminous, Exide, and Vertiv Online UPS systems, SMF batteries, and emergency repair.',
};

export default function WebsiteContentAdmin() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideForm, setSlideForm] = useState({
    title: '',
    subtitle: '',
    badge: 'Industrial Power Grade',
    cta_primary_text: 'Explore Online UPS',
    cta_primary_url: '/products',
    cta_secondary_text: 'Book Repair Service',
    cta_secondary_url: '/services',
    bg_image: '',
    display_order: 1,
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      // fetch website_content key-values
      const { data: webData } = await supabase.from('website_content').select('*');
      if (webData && webData.length > 0) {
        const mapped = { ...DEFAULT_CONTENT };
        webData.forEach(item => {
          if (item.key in mapped) {
            mapped[item.key] = item.key === 'emergency_banner_active' ? item.value === 'true' : item.value;
          }
        });
        setContent(mapped);
      }

      // fetch hero_slides
      const { data: slidesData } = await supabase
        .from('hero_slides')
        .select('*')
        .order('display_order', { ascending: true });
      setHeroSlides(slidesData || []);
    } catch (err) {
      console.error('Fetch website content error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = Object.entries(content).map(([key, value]) => ({
        section: key.startsWith('seo') ? 'seo' : 'homepage',
        key,
        value: String(value),
      }));

      const { error } = await supabase
        .from('website_content')
        .upsert(updates, { onConflict: 'section,key' });

      if (error) throw error;
      setSuccessMsg('Website content saved successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Save content error:', err);
      alert(`Save error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    try {
      if (editingSlide) {
        const { error } = await supabase
          .from('hero_slides')
          .update(slideForm)
          .eq('id', editingSlide.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hero_slides')
          .insert({ ...slideForm, created_at: new Date().toISOString() });
        if (error) throw error;
      }
      setIsSlideModalOpen(false);
      fetchContent();
      setSuccessMsg('Hero slide saved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(`Error saving slide: ${err.message}`);
    }
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm('Delete this hero slide?')) return;
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
      setHeroSlides(prev => prev.filter(s => s.id !== id));
      setSuccessMsg('Hero slide deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Globe className="w-7 h-7 text-[#16a34a]" />
            Website Content & Hero Protection
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Safely update Homepage Hero sliders, emergency 24/7 announcements, and SEO meta tags.
          </p>
        </div>
        <button
          onClick={handleSaveGeneral}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Safety Alert */}
      <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs leading-relaxed">
        <Shield className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">HERO PROTECTION ENABLED:</strong> Changes saved here sync directly with live
          homepage animations without interrupting hero visibility, CTA routes, or responsive mobile scaling.
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Emergency Helpline Banner */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Top Announcement & Emergency Helpline Bar
          </h2>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={content.emergency_banner_active}
              onChange={(e) => setContent({ ...content, emergency_banner_active: e.target.checked })}
              className="w-4 h-4 text-[#16a34a] rounded"
            />
            Show Bar
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Banner Announcement Text
          </label>
          <input
            type="text"
            value={content.emergency_banner_text}
            onChange={(e) => setContent({ ...content, emergency_banner_text: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
      </div>

      {/* Hero Slides Manager */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#16a34a]" />
              Homepage Hero Slides
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Control the slides rotating in the main homepage header</p>
          </div>
          <button
            onClick={() => {
              setEditingSlide(null);
              setSlideForm({
                title: '',
                subtitle: '',
                badge: 'Industrial Power Grade',
                cta_primary_text: 'Explore Online UPS',
                cta_primary_url: '/products',
                cta_secondary_text: 'Book Repair Service',
                cta_secondary_url: '/services',
                bg_image: '',
                display_order: heroSlides.length + 1,
              });
              setIsSlideModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Slide
          </button>
        </div>

        <div className="space-y-3">
          {heroSlides.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              Using default built-in hero slider configuration. Click "Add Slide" to customize slides.
            </div>
          ) : (
            heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 rounded bg-slate-200 overflow-hidden flex-shrink-0">
                    {slide.bg_image ? (
                      <img src={slide.bg_image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#0a1f35]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{slide.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{slide.subtitle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingSlide(slide);
                      setSlideForm(slide);
                      setIsSlideModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SEO & Meta Tags */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
        <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
          SEO & Meta Tags
        </h2>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Homepage Browser Title
          </label>
          <input
            type="text"
            value={content.seo_title}
            onChange={(e) => setContent({ ...content, seo_title: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Meta Description (Search Engine Preview)
          </label>
          <textarea
            rows={2}
            value={content.seo_description}
            onChange={(e) => setContent({ ...content, seo_description: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
      </div>

      {/* Slide Modal */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">
                {editingSlide ? 'Edit Hero Slide' : 'Add Hero Slide'}
              </h2>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Badge</label>
                <input
                  type="text"
                  value={slideForm.badge}
                  onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  placeholder="e.g. Pure Sine Wave Online UPS"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">CTA 1 Text</label>
                  <input
                    type="text"
                    value={slideForm.cta_primary_text}
                    onChange={(e) => setSlideForm({ ...slideForm, cta_primary_text: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">CTA 1 URL</label>
                  <input
                    type="text"
                    value={slideForm.cta_primary_url}
                    onChange={(e) => setSlideForm({ ...slideForm, cta_primary_url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Hero Background Image</label>
                <ImageUpload
                  value={slideForm.bg_image}
                  onChange={(url) => setSlideForm({ ...slideForm, bg_image: url })}
                  folder="hero"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
