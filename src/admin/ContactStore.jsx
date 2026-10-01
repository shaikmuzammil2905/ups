import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  MapPin, Phone, Mail, Clock, Shield, Globe, Save, Loader,
  Check, MessageSquare, ExternalLink, Building
} from 'lucide-react';

const DEFAULT_SETTINGS = {
  business_name: 'Livkam Power Technologies',
  tagline: 'Smart Power. Sustainable Future.',
  phone1: '8884988990',
  phone2: '9945535819',
  whatsapp: '8884988990',
  email: 'info@livkampower.in',
  address: '21, Subhash Chandra Bose Rd, Banashankari 2nd Stage, Bendre Nagar, Bengaluru, Karnataka 560070',
  gst: '29CYMPN3694M1ZC',
  business_hours: 'Mon-Sat: 9AM - 7PM',
  google_maps_url: 'https://maps.google.com/?q=21+Subhash+Chandra+Bose+Rd+Banashankari+2nd+Stage+Bengaluru',
  google_maps_embed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3245!2d77.5495!3d12.9279!',
  facebook_url: '',
  instagram_url: '',
  linkedin_url: '',
  youtube_url: '',
};

export default function ContactStoreAdmin() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (!error && data && data.length > 0) {
        const mapped = { ...DEFAULT_SETTINGS };
        data.forEach(item => {
          if (item.key in mapped) {
            mapped[item.key] = item.value || '';
          }
        });
        setSettings(mapped);
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from('site_settings')
        .upsert(updates, { onConflict: 'key' });

      if (error) throw error;
      setSuccessMsg('Store information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Save settings error:', err);
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-[#16a34a]" />
            Contact & Store Information
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official business details, verified GSTIN, phone lines, Bengaluru store address, and Google Maps integration.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto disabled:opacity-50"
        >
          {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
          Loading store details...
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Business & Tax Identity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building className="w-5 h-5 text-[#16a34a]" />
              Business & Legal Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Registered Business Name
                </label>
                <input
                  type="text"
                  value={settings.business_name}
                  onChange={(e) => handleChange('business_name', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Brand Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#16a34a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  Official GSTIN Number (Karnataka)
                </label>
                <input
                  type="text"
                  value={settings.gst}
                  onChange={(e) => handleChange('gst', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800 focus:outline-none focus:border-[#16a34a]"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Displayed on customer footer, quotation printouts, and tax invoices.
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Store Operating Hours
                </label>
                <input
                  type="text"
                  value={settings.business_hours}
                  onChange={(e) => handleChange('business_hours', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#16a34a]"
                />
              </div>
            </div>
          </div>

          {/* Contact Numbers & Communication */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Phone className="w-5 h-5 text-[#16a34a]" />
              Helplines & Digital Contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Primary Phone Line
                </label>
                <input
                  type="text"
                  value={settings.phone1}
                  onChange={(e) => handleChange('phone1', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold focus:outline-none focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Secondary Phone Line
                </label>
                <input
                  type="text"
                  value={settings.phone2}
                  onChange={(e) => handleChange('phone2', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold focus:outline-none focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1 text-emerald-700">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  WhatsApp Direct Number
                </label>
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) => handleChange('whatsapp', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-emerald-50/50 border border-emerald-200 rounded-xl font-mono font-bold text-emerald-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Support Email Address
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#16a34a]"
              />
            </div>
          </div>

          {/* Location & Map Coordinates */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-[#16a34a]" />
              Store Physical Address & Map
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Full Physical Address (Bengaluru, Karnataka)
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#16a34a]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={settings.google_maps_url}
                  onChange={(e) => handleChange('google_maps_url', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#16a34a]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Google Maps Embed Iframe SRC
                </label>
                <input
                  type="text"
                  value={settings.google_maps_embed}
                  onChange={(e) => handleChange('google_maps_embed', e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#16a34a]"
                />
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="w-5 h-5 text-[#16a34a]" />
              Social Media Channels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={settings.facebook_url}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={settings.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  LinkedIn Company URL
                </label>
                <input
                  type="url"
                  value={settings.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/company/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={settings.youtube_url}
                  onChange={(e) => handleChange('youtube_url', e.target.value)}
                  placeholder="https://youtube.com/@..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save All Store Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
