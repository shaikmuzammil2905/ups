import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ImageUpload from './components/ImageUpload';
import ConfirmDialog from './components/ConfirmDialog';
import {
  Plus, Search, Edit2, Trash2, Wrench, Save, X, Loader,
  Check, Clock, IndianRupee, ShieldCheck, Sparkles, ExternalLink
} from 'lucide-react';

const DEFAULT_FORM = {
  id: '',
  title: '',
  slug: '',
  short_desc: '',
  introduction: '',
  badge: 'Certified Engineers',
  price_starts_at: '₹499',
  turnaround: 'Same Day Service',
  icon: 'Wrench',
  image_url: '',
  features: '',
  display_order: 0,
  is_published: true,
};

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });
      if (err) throw err;
      setServices(data || []);
    } catch (err) {
      console.error('Fetch services error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSlugify = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreate = () => {
    setEditingService(null);
    setFormData({
      ...DEFAULT_FORM,
      display_order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingService(svc);
    setFormData({
      ...svc,
      features: Array.isArray(svc.features)
        ? svc.features.map(f => typeof f === 'string' ? f : f.title || f.text || '').join('\n')
        : (svc.features || ''),
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: !editingService ? handleSlugify(val) : prev.slug,
      id: !editingService ? handleSlugify(val) : prev.id,
    }));
  };

  const handleTogglePublish = async (svc) => {
    try {
      const updatedStatus = !svc.is_published;
      const { error: err } = await supabase
        .from('services')
        .update({ is_published: updatedStatus, updated_at: new Date().toISOString() })
        .eq('id', svc.id);
      if (err) throw err;
      setServices(prev => prev.map(s => s.id === svc.id ? { ...s, is_published: updatedStatus } : s));
      showNotification(`Service "${svc.title}" ${updatedStatus ? 'published' : 'hidden'}.`);
    } catch (err) {
      alert(`Error toggling status: ${err.message}`);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Service title is required.');
      return;
    }
    const slug = formData.slug || handleSlugify(formData.title);
    const svcId = formData.id || slug;

    // parse features array
    const featuresList = typeof formData.features === 'string'
      ? formData.features.split('\n').map(s => s.trim()).filter(Boolean)
      : formData.features;

    setFormLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: slug.trim(),
        short_desc: formData.short_desc || '',
        introduction: formData.introduction || '',
        badge: formData.badge || '',
        price_starts_at: formData.price_starts_at || '₹499',
        turnaround: formData.turnaround || 'Same Day',
        icon: formData.icon || 'Wrench',
        image_url: formData.image_url || '',
        features: featuresList,
        display_order: parseInt(formData.display_order) || 0,
        is_published: formData.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editingService) {
        const { error: err } = await supabase
          .from('services')
          .update(payload)
          .eq('id', editingService.id);
        if (err) throw err;
        showNotification('Service updated successfully!');
      } else {
        const { error: err } = await supabase
          .from('services')
          .insert({ id: svcId, ...payload, created_at: new Date().toISOString() });
        if (err) throw err;
        showNotification('Service created successfully!');
      }

      setIsModalOpen(false);
      fetchServices();
    } catch (err) {
      console.error('Save error:', err);
      alert(`Failed to save service: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      const { error: err } = await supabase
        .from('services')
        .delete()
        .eq('id', deleteConfirm.id);
      if (err) throw err;
      showNotification(`Service "${deleteConfirm.title}" deleted.`);
      setServices(prev => prev.filter(s => s.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredServices = services.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.slug?.toLowerCase().includes(search.toLowerCase()) ||
    s.badge?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Wrench className="w-7 h-7 text-[#16a34a]" />
            Services Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage power engineering services, repair & AMC packages, turnaround times, and pricing.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#16a34a] hover:bg-green-700 text-white rounded-xl font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Notification */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-800 border border-green-200 rounded-xl text-sm font-medium animate-fade-in">
          <Check className="w-4 h-4 text-green-600" />
          {successMsg}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a] transition-colors"
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total Services: <span className="font-bold text-slate-800">{services.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-[#16a34a]" />
            Loading services...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-semibold text-slate-600">No services found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Turnaround</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredServices.map((svc) => (
                  <tr key={svc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400 font-bold">
                      #{svc.display_order ?? 0}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {svc.image_url ? (
                            <img src={svc.image_url} alt={svc.title} className="w-full h-full object-cover" />
                          ) : (
                            <Wrench className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            {svc.title}
                            {svc.badge && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                {svc.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 line-clamp-1 max-w-xs">{svc.short_desc}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {svc.price_starts_at || 'Custom Quote'}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-medium">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {svc.turnaround || 'Standard'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(svc)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          svc.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {svc.is_published ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Live
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(svc)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(svc)}
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingService ? 'Edit Service' : 'Create Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. UPS Repair & Servicing"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Slug / URL Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Price Starts At
                  </label>
                  <input
                    type="text"
                    value={formData.price_starts_at}
                    onChange={(e) => setFormData({ ...formData, price_starts_at: e.target.value })}
                    placeholder="e.g. ₹499"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Turnaround Time
                  </label>
                  <input
                    type="text"
                    value={formData.turnaround}
                    onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                    placeholder="e.g. 2-4 Hours / Same Day"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Certified Engineers"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Short Description (Card Summary)
                </label>
                <textarea
                  rows={2}
                  value={formData.short_desc}
                  onChange={(e) => setFormData({ ...formData, short_desc: e.target.value })}
                  placeholder="Summary for service cards..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Introduction
                </label>
                <textarea
                  rows={3}
                  value={formData.introduction}
                  onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
                  placeholder="Comprehensive introduction shown on service detail page..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* Service Hero Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Service Banner / Feature Image
                </label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => setFormData({ ...formData, image_url: url })}
                  folder="services"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Key Features / Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Component level motherboard diagnosis&#10;Genuine OEM replacement parts with warranty&#10;On-site emergency inspection within 2 hours&#10;Post-repair load bank testing"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 text-[#16a34a] rounded"
                  />
                  Published on Live Website
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
                  {editingService ? 'Update Service' : 'Create Service'}
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
          title="Delete Service"
          message={`Are you sure you want to delete service "${deleteConfirm.title}"?`}
          confirmText="Yes, Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
