import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Megaphone, Plus, Search, Edit2, Trash2, Eye, Save, X, Loader,
  Check, ExternalLink, Calendar, MousePointerClick
} from 'lucide-react';

const DEFAULT_FORM = {
  title: '',
  placement: 'hero',
  image_url: '',
  mobile_image_url: '',
  link_url: '',
  caption: '',
  cta_text: 'Explore Now',
  display_order: 0,
  is_active: true,
};

export default function AdvertisementsAdmin() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [placementFilter, setPlacementFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('advertisements')
        .select('*')
        .order('display_order', { ascending: true });

      if (placementFilter) {
        query = query.eq('placement', placementFilter);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setAds(data || []);
    } catch (err) {
      console.error('Fetch advertisements error:', err);
    } finally {
      setLoading(false);
    }
  }, [placementFilter]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingAd(null);
    setFormData({
      ...DEFAULT_FORM,
      display_order: ads.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad) => {
    setEditingAd(ad);
    setFormData({ ...ad });
    setIsModalOpen(true);
  };

  const handleToggleActive = async (ad) => {
    try {
      const updatedStatus = !ad.is_active;
      const { error: err } = await supabase
        .from('advertisements')
        .update({ is_active: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', ad.id);
      if (err) throw err;
      setAds(prev => prev.map(a => a.id === ad.id ? { ...a, is_active: updatedStatus } : a));
      showNotification(`Banner ${updatedStatus ? 'activated' : 'paused'}.`);
    } catch (err) {
      alert(`Error toggling banner: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Title is required.');
      return;
    }

    setFormLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        placement: formData.placement,
        image_url: formData.image_url || '',
        mobile_image_url: formData.mobile_image_url || '',
        link_url: formData.link_url || '',
        caption: formData.caption || '',
        cta_text: formData.cta_text || 'Explore Now',
        display_order: parseInt(formData.display_order) || 0,
        is_active: formData.is_active,
        updated_at: new Date().toISOString(),
      };

      if (editingAd) {
        const { error: err } = await supabase
          .from('advertisements')
          .update(payload)
          .eq('id', editingAd.id);
        if (err) throw err;
        showNotification('Advertisement updated successfully!');
      } else {
        const { error: err } = await supabase
          .from('advertisements')
          .insert({ ...payload, created_at: new Date().toISOString() });
        if (err) throw err;
        showNotification('Advertisement created successfully!');
      }

      setIsModalOpen(false);
      fetchAds();
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save ad: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      setAds(prev => prev.filter(a => a.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      showNotification('Banner deleted.');
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredAds = ads.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.placement?.toLowerCase().includes(search.toLowerCase()) ||
    a.caption?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-[#16a34a]" />
            Advertisements & Banners
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage promotional banners, hero sliders, seasonal discount notices, and custom redirect links.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search banners by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={placementFilter}
            onChange={(e) => setPlacementFilter(e.target.value)}
            className="px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
          >
            <option value="">All Placements</option>
            <option value="hero">Hero Slider</option>
            <option value="promo_bar">Top Promo Bar</option>
            <option value="middle_banner">Homepage Middle Banner</option>
            <option value="sidebar">Sidebar Ad</option>
            <option value="popup">Special Offer Popup</option>
          </select>
          <div className="text-sm text-slate-500 font-medium whitespace-nowrap">
            Total: <span className="font-bold text-slate-800">{ads.length}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading advertisements...
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No advertisements found</p>
            <p className="text-xs text-slate-400 mt-1">Create banners to highlight promotions on the homepage.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Banner</th>
                  <th className="py-3 px-4">Placement</th>
                  <th className="py-3 px-4">Target Link</th>
                  <th className="py-3 px-4">Clicks</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-bold">
                      #{ad.display_order ?? 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-11 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {ad.image_url ? (
                            <img src={ad.image_url} alt={ad.title} className="w-full h-full object-cover" />
                          ) : (
                            <Megaphone className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{ad.title}</div>
                          {ad.caption && (
                            <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{ad.caption}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600">
                        {ad.placement}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500 max-w-xs truncate">
                      {ad.link_url || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600 font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5 text-slate-400" />
                        {ad.click_count || 0}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(ad)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          ad.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {ad.is_active ? 'Active' : 'Paused'}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(ad)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(ad)}
                          title="Delete"
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingAd ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 15% Off APC Online UPS Monsoon Offer"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Placement
                  </label>
                  <select
                    value={formData.placement}
                    onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                  >
                    <option value="hero">Hero Slider</option>
                    <option value="promo_bar">Top Announcement Bar</option>
                    <option value="middle_banner">Homepage Middle Banner</option>
                    <option value="sidebar">Catalog / Sidebar Ad</option>
                    <option value="popup">Promotional Modal Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="e.g. Shop Now"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Target Link (Internal or External URL)
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="e.g. /products?category=online-ups"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Sub-heading / Caption
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. Zero Downtime for High-Tech Hospitals & Datacenters"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Banner Desktop Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Desktop Banner Image (1200x500 recommended)
                </label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="banners"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Active (Display on Website)
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-600 uppercase">Order:</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-20 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {formLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {editingAd ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Advertisement"
          message={`Are you sure you want to delete banner "${deleteConfirm.title}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
