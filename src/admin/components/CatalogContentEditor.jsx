import React, { useState, useEffect, useMemo } from 'react';
import { 
  Save, Eye, Plus, Trash2, Video, Image as ImageIcon, 
  HelpCircle, Wrench, CheckCircle2, RefreshCw, ExternalLink,
  ChevronRight, Layers, FileText, Check, AlertCircle, Sparkles
} from 'lucide-react';
import { getCatalogEntry } from '../../data/catalogsData';
import { notifyDataUpdated } from '../../lib/syncEvents';
import { useData } from '../../context/DataContext';
import ImageUpload from './ImageUpload';

export default function CatalogContentEditor({ type = 'online-ups', categoriesList = [] }) {
  // Flatten all items from categoriesList into a single selectable list
  const flatItems = useMemo(() => {
    const items = [];
    categoriesList.forEach(cat => {
      if (cat.items && cat.items.length > 0) {
        cat.items.forEach(it => {
          items.push({
            categoryTitle: cat.title,
            slug: it.slug,
            title: it.title,
          });
        });
      }
    });
    return items;
  }, [categoriesList]);

  // Selected catalogue slug
  const [selectedSlug, setSelectedSlug] = useState(() => {
    return flatItems[0]?.slug || (type === 'batteries' ? 'amaron-quanta-battery' : 'ups-manufacturers-in-bangalore-peenya');
  });

  const { customCatalogs, saveCustomCatalog } = useData();

  // Current working form state
  const [form, setForm] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load catalog entry when selectedSlug changes
  useEffect(() => {
    if (!selectedSlug) return;
    
    // 1. Check DataContext customCatalogs (synced from Supabase)
    if (customCatalogs && customCatalogs[selectedSlug]) {
      setForm(JSON.parse(JSON.stringify(customCatalogs[selectedSlug])));
      return;
    }

    // 2. Check local browser storage
    try {
      const customOverrides = JSON.parse(localStorage.getItem('livkam_custom_catalogs') || '{}');
      if (customOverrides[selectedSlug]) {
        setForm(JSON.parse(JSON.stringify(customOverrides[selectedSlug])));
        return;
      }
    } catch (_) {}

    // 3. Fallback to factory defaults
    const initial = getCatalogEntry(selectedSlug, type);
    setForm(JSON.parse(JSON.stringify(initial)));
  }, [selectedSlug, type, customCatalogs]);

  if (!form) {
    return (
      <div className="p-8 text-center text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#16a34a]" />
        <span>Loading catalogue editor...</span>
      </div>
    );
  }

  // Handle saving across Supabase, localStorage & all devices
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        slug: selectedSlug,
        type: type,
        lastUpdated: new Date().toISOString()
      };

      if (saveCustomCatalog) {
        await saveCustomCatalog(selectedSlug, payload);
      } else {
        const customOverrides = JSON.parse(localStorage.getItem('livkam_custom_catalogs') || '{}');
        customOverrides[selectedSlug] = payload;
        localStorage.setItem('livkam_custom_catalogs', JSON.stringify(customOverrides));
        notifyDataUpdated({ type: 'CATALOG_SAVED', slug: selectedSlug });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Error saving custom catalog:', err);
      alert('Failed to save changes: ' + (err.message || 'Please check connection.'));
    } finally {
      setSaving(false);
    }
  };

  // Reset to static code defaults
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to revert all changes for this catalog back to factory defaults?')) {
      try {
        const defaultEntry = getCatalogEntry(selectedSlug, type);
        setForm(JSON.parse(JSON.stringify(defaultEntry)));
        
        if (saveCustomCatalog) {
          await saveCustomCatalog(selectedSlug, defaultEntry);
        } else {
          const customOverrides = JSON.parse(localStorage.getItem('livkam_custom_catalogs') || '{}');
          delete customOverrides[selectedSlug];
          localStorage.setItem('livkam_custom_catalogs', JSON.stringify(customOverrides));
          notifyDataUpdated({ type: 'CATALOG_SAVED', slug: selectedSlug });
        }

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error('Error resetting:', err);
      }
    }
  };

  // Helper to format YouTube embed link
  const getEmbedVideoUrl = (url) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // Pictorial Model handlers
  const handleAddModel = () => {
    const newModels = [...(form.models || [])];
    newModels.push({
      name: `New Model ${newModels.length + 1}`,
      specs: 'Certified Specs • On-Site Warranty',
      image: type === 'batteries' ? '/images/products/tubular-battery.jpg' : '/images/products/online-ups.jpg'
    });
    setForm({ ...form, models: newModels });
  };

  const handleUpdateModel = (idx, field, value) => {
    const newModels = [...(form.models || [])];
    newModels[idx][field] = value;
    setForm({ ...form, models: newModels });
  };

  const handleDeleteModel = (idx) => {
    const newModels = form.models.filter((_, i) => i !== idx);
    setForm({ ...form, models: newModels });
  };

  // Technical Specs handlers
  const handleAddSpec = () => {
    const newSpecs = [...(form.specsData || [])];
    newSpecs.push({ param: 'Parameter Name', m1: 'Specification Value' });
    setForm({ ...form, specsData: newSpecs });
  };

  const handleUpdateSpec = (idx, field, value) => {
    const newSpecs = [...(form.specsData || [])];
    newSpecs[idx][field] = value;
    setForm({ ...form, specsData: newSpecs });
  };

  const handleDeleteSpec = (idx) => {
    const newSpecs = form.specsData.filter((_, i) => i !== idx);
    setForm({ ...form, specsData: newSpecs });
  };

  // FAQs handlers
  const handleAddFaq = () => {
    const newFaqs = [...(form.faqs || [])];
    newFaqs.push({ q: 'Frequently Asked Question', a: 'Answer explaining details and benefits.' });
    setForm({ ...form, faqs: newFaqs });
  };

  const handleUpdateFaq = (idx, field, value) => {
    const newFaqs = [...(form.faqs || [])];
    newFaqs[idx][field] = value;
    setForm({ ...form, faqs: newFaqs });
  };

  const handleDeleteFaq = (idx) => {
    const newFaqs = form.faqs.filter((_, i) => i !== idx);
    setForm({ ...form, faqs: newFaqs });
  };

  const livePagePath = type === 'batteries' ? `/batteries/${selectedSlug}` : `/online-ups/${selectedSlug}`;

  return (
    <div className="space-y-6">
      {/* 1. TOP CONTROLS & CATALOGUE SELECTOR */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full md:w-auto flex-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Select Catalogue to Edit & Manage:
          </label>
          <div className="relative">
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full md:max-w-md bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a] shadow-xs"
            >
              {categoriesList.map((catGroup) => (
                <optgroup key={catGroup.id} label={catGroup.title}>
                  {catGroup.items.map((it) => (
                    <option key={it.slug} value={it.slug}>
                      {it.title} ({it.slug})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleReset}
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
          >
            Reset Defaults
          </button>

          <a
            href={livePagePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#0f2b48] hover:text-[#16a34a] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Live Page</span>
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-green-900/20 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>Catalogue content successfully updated! Changes are live immediately on the website.</span>
          </div>
          <a
            href={livePagePath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 underline font-bold hover:text-emerald-900 ml-4 flex-shrink-0"
          >
            View Live →
          </a>
        </div>
      )}

      {/* 2. MAIN METADATA & EDITORIAL CONTENT */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#16a34a]" />
            <span>1. Headline & Editorial Narrative (Grand Content)</span>
          </h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">
            Slug: {selectedSlug}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Page Main Title *</label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              placeholder="e.g. UPS Manufacturers In Bangalore Peenya"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Section Subheading / Tagline</label>
            <input
              type="text"
              value={form.subheading || ''}
              onChange={(e) => setForm({ ...form, subheading: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              placeholder="e.g. Certified High-Performance Pure Sine Wave Double-Conversion Online UPS Systems"
            />
          </div>
        </div>

        {/* Banner Image URL & Uploader */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Hero Banner Image (Grand Look)</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <input
              type="text"
              value={form.banner || ''}
              onChange={(e) => setForm({ ...form, banner: e.target.value })}
              placeholder="https://... or /images/..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            />
            <div className="max-w-xs">
              <ImageUpload
                value={form.banner}
                onChange={(url) => setForm({ ...form, banner: url })}
                folder="catalogs"
                label="Upload Banner Image"
                aspectRatio="16/9"
              />
            </div>
          </div>
        </div>

        {/* Main Editorial Content */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Rich Editorial Description / Article Content (image copy 41, 61)
          </label>
          <p className="text-xs text-slate-400 mb-2">
            This narrative appears right below the hero banner with Livkam Power Technologies company identity, certifications, and engineering capabilities.
          </p>
          <textarea
            rows={5}
            value={form.editorialContent || ''}
            onChange={(e) => setForm({ ...form, editorialContent: e.target.value })}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            placeholder="Write the complete technical overview, advantages, and applications..."
          ></textarea>
        </div>
      </div>

      {/* 3. YOUTUBE VIDEO SECTION (image copy 62) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <Video className="w-4 h-4 text-red-500" />
            <span>2. YouTube Video Integration (image copy 62)</span>
          </h3>
          <span className="text-[11px] font-bold text-slate-400">Live Video Embed</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            YouTube Video Link / Watch URL *
          </label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={form.videoUrl || ''}
              onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="e.g. https://www.youtube.com/watch?v=5qap5aO4i9A or https://youtu.be/..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Accepts standard YouTube links or direct embed URLs. The video player automatically loads on this catalog's page.
          </p>
        </div>

        {/* Live Video Preview Box */}
        {form.videoUrl && (
          <div className="mt-3 bg-slate-900 rounded-2xl p-3 border border-slate-800 max-w-xl">
            <div className="text-[10px] font-mono text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
              Live Player Preview:
            </div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={getEmbedVideoUrl(form.videoUrl)}
                title="Catalogue Video Preview"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </div>

      {/* 4. PICTORIAL SHOWCASE MODELS (image copy 42, 61 - Amber Backgrounds) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>3. Pictorial Model Showcase Cards (Amber Backgrounds per image copy 42 & 61)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual product cards on golden-amber gradient containers with image upload and capacity specs.
            </p>
          </div>
          <button
            onClick={handleAddModel}
            className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Model Card</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(form.models || []).map((model, idx) => (
            <div key={idx} className="bg-gradient-to-b from-amber-50/60 to-amber-100/40 rounded-2xl p-4 border border-amber-200/90 shadow-xs relative flex flex-col justify-between">
              <button
                onClick={() => handleDeleteModel(idx)}
                className="absolute top-3 right-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                title="Remove Model Card"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-3 pr-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Model Title
                  </label>
                  <input
                    type="text"
                    value={model.name || ''}
                    onChange={(e) => handleUpdateModel(idx, 'name', e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. APC Smart-UPS 10kVA"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Specs / Tagline
                  </label>
                  <input
                    type="text"
                    value={model.specs || ''}
                    onChange={(e) => handleUpdateModel(idx, 'specs', e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="e.g. 1P/1P • Pure Sine Wave • 0 ms"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                    Image URL & Upload
                  </label>
                  <input
                    type="text"
                    value={model.image || ''}
                    onChange={(e) => handleUpdateModel(idx, 'image', e.target.value)}
                    className="w-full bg-white border border-amber-200 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-700 mb-2"
                    placeholder="/images/... or https://"
                  />
                  <ImageUpload
                    value={model.image}
                    onChange={(url) => handleUpdateModel(idx, 'image', url)}
                    folder="models"
                    label="Upload Picture"
                    aspectRatio="1/1"
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-900">Card #{idx + 1}</span>
                {model.image && (
                  <img src={model.image} alt={model.name} className="w-10 h-10 object-contain rounded bg-white p-1 border border-amber-200" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. TECHNICAL SPECIFICATIONS TABLE (image copy 46) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#16a34a]" />
              <span>4. Technical Specifications Table (image copy 46)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Key engineering parameters (Capacity, Topology, Voltage, Power Factor, Battery Bus, etc.)
            </p>
          </div>
          <button
            onClick={handleAddSpec}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Spec Row</span>
          </button>
        </div>

        <div className="space-y-2">
          {(form.specsData || []).map((spec, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="text"
                value={spec.param || ''}
                onChange={(e) => handleUpdateSpec(idx, 'param', e.target.value)}
                placeholder="Parameter Name (e.g. Capacity Range)"
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
              />
              <input
                type="text"
                value={spec.m1 || ''}
                onChange={(e) => handleUpdateSpec(idx, 'm1', e.target.value)}
                placeholder="Specification (e.g. 1kVA to 120kVA)"
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
              />
              <button
                onClick={() => handleDeleteSpec(idx)}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. FAQS ACCORDION (image copy 65) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>5. Frequently Asked Questions (image copy 65)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Client FAQ accordion displayed at the bottom before quotation form.
            </p>
          </div>
          <button
            onClick={handleAddFaq}
            className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#16a34a] border border-emerald-200 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-3">
          {(form.faqs || []).map((faq, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 relative">
              <button
                onClick={() => handleDeleteFaq(idx)}
                className="absolute top-3 right-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete FAQ"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="pr-8">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Question #{idx + 1}
                </label>
                <input
                  type="text"
                  value={faq.q || ''}
                  onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                  placeholder="e.g. What warranty is provided on this system?"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Answer
                </label>
                <textarea
                  rows={2}
                  value={faq.a || ''}
                  onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                  placeholder="e.g. All units carry OEM manufacturer warranty plus local Bangalore on-site engineering support..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#16a34a]"
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM FLOATING SAVE BAR */}
      <div className="sticky bottom-4 z-20 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-[#16a34a] inline-block animate-pulse"></span>
          <div>
            <div className="text-xs font-black">Managing: {form.title}</div>
            <div className="text-[11px] text-slate-400">All modifications immediately synchronize to customer pages upon save.</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={livePagePath}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Preview Live
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-green-900/40 disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save & Publish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
